import axios from 'axios'
import { API_URL } from '../config'

const api = axios.create({
  baseURL: API_URL,
})

export async function getSlideshows() {
  const res = await api.get('/slideshows')
  return res.data
}

export async function createSlide(slideshowId) {
  const res = await api.post(`/slideshows/${slideshowId}/slides`)
  return res.data
}

export async function moveSlide(slideId, position) {
  const res = await api.patch(`/slides/${slideId}`, { position })
  return res.data
}

export async function deleteSlide(slideId) {
  const res = await api.delete(`/slides/${slideId}`)
  return res.data
}

export async function createItem(slideId, item) {
  const res = await api.post(`/slides/${slideId}/items`, item)
  return res.data
}

export async function updateItem(itemId, changes) {
  const res = await api.patch(`/items/${itemId}`, changes)
  return res.data
}

export async function replaceItem(itemId, item) {
  const res = await api.put(`/items/${itemId}`, item)
  return res.data
}

export async function deleteItem(itemId) {
  const res = await api.delete(`/items/${itemId}`)
  return res.data
}

export async function getView() {
  const res = await api.get('/view')
  return res.data
}

export async function saveView(view) {
  const res = await api.put('/view', view)
  return res.data
}