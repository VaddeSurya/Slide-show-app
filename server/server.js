const http = require('http');
const crypto = require('crypto');
const loaded = require('./mock');
const data = loaded.default || loaded;
const startData = Array.isArray(data) ? data : data.slideshows || [];

const slideshowsMap = new Map(); // id → { id, title, slideIds: [] }
const slidesMap = new Map();     // id → { id, slideshowId, itemIds: [] }
const itemsMap = new Map();      // id → { id, slideId, type, ...fields }

startData.forEach((slideshow) => {
  slideshowsMap.set(slideshow.id, {
    id: slideshow.id,
    title: slideshow.title,
    slideIds: slideshow.slides.map((slide) => slide.id),
  });

  slideshow.slides.forEach((slide) => {
    slidesMap.set(slide.id, {
      id: slide.id,
      slideshowId: slideshow.id,
      itemIds: slide.items.map((item) => item.id),
    });

    slide.items.forEach((item) => {
      itemsMap.set(item.id, { ...item, slideId: slide.id });
    });
  });
});

let view = { mode: 'editor', activeSlideshowId: null, currentIndex: 0, ended: false };

// Which fields each item type can have
const ITEM_FIELDS = {
  rectangle: ['x', 'y', 'width', 'height', 'fill'],
  circle: ['x', 'y', 'radius', 'fill'],
  text: ['x', 'y', 'text', 'fontSize', 'color'],
};
const NUMBER_FIELDS = ['x', 'y', 'width', 'height', 'radius', 'fontSize'];

// Returns an error message, or null if the fields are fine
const checkItemFields = (type, fields, requireAll) => {
  if (!ITEM_FIELDS[type]) return 'Invalid type: must be rectangle, circle or text';

  for (const key of Object.keys(fields)) {
    if (!ITEM_FIELDS[type].includes(key)) return `Field not allowed for ${type}: ${key}`;

    const value = fields[key];
    const isValid = NUMBER_FIELDS.includes(key) ? Number.isFinite(value) : typeof value === 'string';
    if (!isValid) return `Invalid value for ${key}`;
  }

  if (requireAll) {
    const missing = ITEM_FIELDS[type].filter((key) => !(key in fields));
    if (missing.length) return `Missing fields: ${missing.join(', ')}`;
  }

  return null;
};

// Turn stored data back into the nested shape the frontend uses
const toItem = (item) => {
  const { slideId, ...rest } = item;
  return rest;
};

const toSlide = (slide) => ({
  id: slide.id,
  items: slide.itemIds.map((itemId) => toItem(itemsMap.get(itemId))),
});

const toSlideshow = (slideshow) => ({
  id: slideshow.id,
  title: slideshow.title,
  slides: slideshow.slideIds.map((slideId) => toSlide(slidesMap.get(slideId))),
});

// Helper to send JSON responses
const sendJSON = (res, statusCode, payload) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

// Helper to read the JSON body of a request
const readBody = (req, callback) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    try {
      callback(null, JSON.parse(body || '{}'));
    } catch (err) {
      callback(err);
    }
  });
};

const server = http.createServer((req, res) => {
  const { method } = req;
  // '/slides/slide-1/items' → ['slides', 'slide-1', 'items']
  const parts = req.url.split('?')[0].split('/').filter(Boolean);
  const [resource, id, sub] = parts;

  // GET /slideshows - all slideshows (nested, ready to draw)
  if (method === 'GET' && resource === 'slideshows' && parts.length === 1) {
    return sendJSON(res, 200, Array.from(slideshowsMap.values()).map(toSlideshow));
  }

  // GET /slideshows/:id - one slideshow
  if (method === 'GET' && resource === 'slideshows' && parts.length === 2) {
    if (!slideshowsMap.has(id)) return sendJSON(res, 404, { error: 'Slideshow not found' });
    return sendJSON(res, 200, toSlideshow(slideshowsMap.get(id)));
  }

  // POST /slideshows - create a slideshow { title }
  if (method === 'POST' && resource === 'slideshows' && parts.length === 1) {
    return readBody(req, (err, body) => {
      if (err) return sendJSON(res, 400, { error: 'Invalid JSON body' });
      if (typeof body.title !== 'string' || !body.title.trim()) {
        return sendJSON(res, 400, { error: 'Missing required parameter: title' });
      }

      const slideshow = { id: `ss-${crypto.randomUUID()}`, title: body.title, slideIds: [] };
      slideshowsMap.set(slideshow.id, slideshow);
      return sendJSON(res, 201, toSlideshow(slideshow));
    });
  }

  // POST /slideshows/:id/slides - add an empty slide at the end
  if (method === 'POST' && resource === 'slideshows' && sub === 'slides' && parts.length === 3) {
    const slideshow = slideshowsMap.get(id);
    if (!slideshow) return sendJSON(res, 404, { error: 'Slideshow not found' });

    const slide = { id: `slide-${crypto.randomUUID()}`, slideshowId: id, itemIds: [] };
    slidesMap.set(slide.id, slide);
    slideshow.slideIds.push(slide.id);
    return sendJSON(res, 201, toSlide(slide));
  }

  // GET /slides/:id - one slide
  if (method === 'GET' && resource === 'slides' && parts.length === 2) {
    if (!slidesMap.has(id)) return sendJSON(res, 404, { error: 'Slide not found' });
    return sendJSON(res, 200, toSlide(slidesMap.get(id)));
  }

  // PATCH /slides/:id - move a slide { position }
  if (method === 'PATCH' && resource === 'slides' && parts.length === 2) {
    const slide = slidesMap.get(id);
    if (!slide) return sendJSON(res, 404, { error: 'Slide not found' });

    return readBody(req, (err, body) => {
      if (err) return sendJSON(res, 400, { error: 'Invalid JSON body' });

      const slideIds = slideshowsMap.get(slide.slideshowId).slideIds;
      const { position } = body;

      if (!Number.isInteger(position) || position < 0 || position >= slideIds.length) {
        return sendJSON(res, 400, { error: `position must be a whole number from 0 to ${slideIds.length - 1}` });
      }

      slideIds.splice(slideIds.indexOf(id), 1); // take it out
      slideIds.splice(position, 0, id);         // put it at the new position
      return sendJSON(res, 200, { id, position });
    });
  }

  // DELETE /slides/:id - delete a slide and its items
  if (method === 'DELETE' && resource === 'slides' && parts.length === 2) {
    const slide = slidesMap.get(id);
    if (!slide) return sendJSON(res, 404, { error: 'Slide not found' });

    const slideshow = slideshowsMap.get(slide.slideshowId);
    slideshow.slideIds = slideshow.slideIds.filter((slideId) => slideId !== id);
    slide.itemIds.forEach((itemId) => itemsMap.delete(itemId));
    slidesMap.delete(id);
    return sendJSON(res, 200, { deleted: id });
  }


  // POST /slides/:id/items - add an item { type, ...fields }
  if (method === 'POST' && resource === 'slides' && sub === 'items' && parts.length === 3) {
    const slide = slidesMap.get(id);
    if (!slide) return sendJSON(res, 404, { error: 'Slide not found' });

    return readBody(req, (err, body) => {
      if (err) return sendJSON(res, 400, { error: 'Invalid JSON body' });

      const { type, ...fields } = body;
      const problem = checkItemFields(type, fields, true);
      if (problem) return sendJSON(res, 400, { error: problem });

      const item = { id: `item-${crypto.randomUUID()}`, type, ...fields, slideId: id };
      itemsMap.set(item.id, item);
      slide.itemIds.push(item.id);
      return sendJSON(res, 201, toItem(item));
    });
  }

  // GET /items/:id - one item
  if (method === 'GET' && resource === 'items' && parts.length === 2) {
    if (!itemsMap.has(id)) return sendJSON(res, 404, { error: 'Item not found' });
    return sendJSON(res, 200, toItem(itemsMap.get(id)));
  }

  // PATCH /items/:id - change some fields { fontSize: 40 }
  if (method === 'PATCH' && resource === 'items' && parts.length === 2) {
    const item = itemsMap.get(id);
    if (!item) return sendJSON(res, 404, { error: 'Item not found' });

    return readBody(req, (err, body) => {
      if (err) return sendJSON(res, 400, { error: 'Invalid JSON body' });

      const problem = checkItemFields(item.type, body, false);
      if (problem) return sendJSON(res, 400, { error: problem });

      const updated = { ...item, ...body };
      itemsMap.set(id, updated);
      return sendJSON(res, 200, toItem(updated));
    });
  }

  // PUT /items/:id - replace the whole item { type, ...all fields }
  if (method === 'PUT' && resource === 'items' && parts.length === 2) {
    const item = itemsMap.get(id);
    if (!item) return sendJSON(res, 404, { error: 'Item not found' });

    return readBody(req, (err, body) => {
      if (err) return sendJSON(res, 400, { error: 'Invalid JSON body' });

      const { type, ...fields } = body;
      const problem = checkItemFields(type, fields, true);
      if (problem) return sendJSON(res, 400, { error: problem });

      const replaced = { id, type, ...fields, slideId: item.slideId };
      itemsMap.set(id, replaced);
      return sendJSON(res, 200, toItem(replaced));
    });
  }

  // DELETE /items/:id - delete one item
  if (method === 'DELETE' && resource === 'items' && parts.length === 2) {
    const item = itemsMap.get(id);
    if (!item) return sendJSON(res, 404, { error: 'Item not found' });

    const slide = slidesMap.get(item.slideId);
    slide.itemIds = slide.itemIds.filter((itemId) => itemId !== id);
    itemsMap.delete(id);
    return sendJSON(res, 200, { deleted: id });
  }


  // GET /view - what the user has open
  if (method === 'GET' && resource === 'view' && parts.length === 1) {
    return sendJSON(res, 200, view);
  }

  // PUT /view - save what the user has open
  if (method === 'PUT' && resource === 'view' && parts.length === 1) {
    return readBody(req, (err, body) => {
      if (err) return sendJSON(res, 400, { error: 'Invalid JSON body' });

      const { mode, activeSlideshowId, currentIndex, ended } = body;

      if (
        !['editor', 'viewer'].includes(mode) ||
        (activeSlideshowId !== null && typeof activeSlideshowId !== 'string') ||
        !Number.isInteger(currentIndex) || currentIndex < 0 ||
        typeof ended !== 'boolean'
      ) {
        return sendJSON(res, 400, { error: 'Invalid view' });
      }

      view = { mode, activeSlideshowId, currentIndex, ended };
      return sendJSON(res, 200, view);
    });
  }

  // Fallback 404 for unhandled routes
  sendJSON(res, 404, { error: 'Route not found' });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});