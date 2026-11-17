
const mockData = {
  slideshows: [
    {
      id: "ss-1",
      title: "Product Intro",
      slides: [
        {
          id: "slide-1",
          items: [
            { id: "item-1", type: "rectangle", x: 10, y: 10, width: 30, height: 20, fill: "#111827" },
            { id: "item-2", type: "circle", x: 60, y: 20, radius: 10, fill: "#f59e0b" },
            { id: "item-3", type: "text", x: 10, y: 50, text: "Welcome!", fontSize: 28, color: "#111827" },
            { id: "item-4", type: "rectangle", x: 10, y: 65, width: 80, height: 2, fill: "#6366f1" },
            { id: "item-5", type: "text", x: 10, y: 75, text: "Introducing our new product", fontSize: 16, color: "#64748b" }
          ]
        },
        {
          id: "slide-2",
          items: [
            { id: "item-6", type: "rectangle", x: 10, y: 10, width: 35, height: 25, fill: "#4f46e5" },
            { id: "item-7", type: "text", x: 55, y: 20, text: "Features", fontSize: 26, color: "#16a34a" },
            { id: "item-8", type: "circle", x: 20, y: 50, radius: 10, fill: "#f59e0b" },
            { id: "item-9", type: "circle", x: 50, y: 50, radius: 10, fill: "#ec4899" },
            { id: "item-10", type: "text", x: 10, y: 75, text: "Simple. Fast. Powerful.", fontSize: 18, color: "#111827" }
          ]
        },
        {
          id: "slide-3",
          items: [
            { id: "item-11", type: "rectangle", x: 5, y: 5, width: 90, height: 90, fill: "#eff6ff" },
            { id: "item-12", type: "text", x: 15, y: 20, text: "Fast Performance", fontSize: 24, color: "#1e40af" },
            { id: "item-13", type: "circle", x: 75, y: 45, radius: 12, fill: "#3b82f6" },
            { id: "item-14", type: "text", x: 15, y: 60, text: "Built for speed and reliability.", fontSize: 16, color: "#334155" }
          ]
        },
        {
          id: "slide-4",
          items: [
            { id: "item-15", type: "rectangle", x: 10, y: 10, width: 80, height: 70, fill: "#fef3c7" },
            { id: "item-16", type: "text", x: 20, y: 20, text: "Smart Design", fontSize: 26, color: "#92400e" },
            { id: "item-17", type: "circle", x: 30, y: 60, radius: 8, fill: "#f97316" },
            { id: "item-18", type: "circle", x: 55, y: 60, radius: 8, fill: "#eab308" }
          ]
        },
        {
          id: "slide-5",
          items: [
            { id: "item-19", type: "rectangle", x: 0, y: 0, width: 100, height: 100, fill: "#111827" },
            { id: "item-20", type: "text", x: 20, y: 30, text: "Thank You!", fontSize: 32, color: "#ffffff" },
            { id: "item-21", type: "text", x: 20, y: 50, text: "Let's build something amazing.", fontSize: 16, color: "#cbd5e1" },
            { id: "item-22", type: "circle", x: 85, y: 85, radius: 8, fill: "#f59e0b" }
          ]
        }
      ]
    },
    {
      id: "ss-2",
      title: "Marketing Campaign",
      slides: [
        {
          id: "slide-6",
          items: [
            { id: "item-23", type: "rectangle", x: 0, y: 0, width: 100, height: 100, fill: "#7c3aed" },
            { id: "item-24", type: "text", x: 15, y: 25, text: "Summer Sale", fontSize: 32, color: "#ffffff" },
            { id: "item-25", type: "text", x: 15, y: 50, text: "Up to 50% OFF", fontSize: 24, color: "#facc15" }
          ]
        },
        {
          id: "slide-7",
          items: [
            { id: "item-26", type: "rectangle", x: 10, y: 10, width: 80, height: 75, fill: "#fce7f3" },
            { id: "item-27", type: "text", x: 20, y: 20, text: "Limited Offer", fontSize: 26, color: "#be185d" },
            { id: "item-28", type: "circle", x: 70, y: 60, radius: 15, fill: "#ec4899" },
            { id: "item-29", type: "text", x: 20, y: 55, text: "Don't miss out!", fontSize: 18, color: "#831843" }
          ]
        },
        {
          id: "slide-8",
          items: [
            { id: "item-30", type: "rectangle", x: 5, y: 10, width: 90, height: 70, fill: "#dcfce7" },
            { id: "item-31", type: "text", x: 15, y: 25, text: "Shop Now", fontSize: 30, color: "#166534" },
            { id: "item-32", type: "circle", x: 75, y: 65, radius: 10, fill: "#22c55e" }
          ]
        },
        {
          id: "slide-9",
          items: [
            { id: "item-33", type: "rectangle", x: 10, y: 10, width: 80, height: 80, fill: "#1e293b" },
            { id: "item-34", type: "text", x: 20, y: 30, text: "New Collection", fontSize: 25, color: "#ffffff" },
            { id: "item-35", type: "text", x: 20, y: 55, text: "Explore the latest trends", fontSize: 15, color: "#cbd5e1" }
          ]
        },
        {
          id: "slide-10",
          items: [
            { id: "item-36", type: "circle", x: 50, y: 50, radius: 30, fill: "#f97316" },
            { id: "item-37", type: "text", x: 20, y: 45, text: "SALE ENDS TODAY!", fontSize: 22, color: "#ffffff" }
          ]
        }
      ]
    },
    {
      id: "ss-3",
      title: "Business Presentation",
      slides: [
        {
          id: "slide-11",
          items: [
            { id: "item-38", type: "rectangle", x: 0, y: 0, width: 100, height: 100, fill: "#0f172a" },
            { id: "item-39", type: "text", x: 15, y: 30, text: "Business Overview", fontSize: 30, color: "#ffffff" },
            { id: "item-40", type: "text", x: 15, y: 55, text: "Annual Company Report 2026", fontSize: 16, color: "#94a3b8" }
          ]
        },
        {
          id: "slide-12",
          items: [
            { id: "item-41", type: "rectangle", x: 10, y: 10, width: 35, height: 40, fill: "#2563eb" },
            { id: "item-42", type: "rectangle", x: 55, y: 10, width: 35, height: 40, fill: "#16a34a" },
            { id: "item-43", type: "text", x: 15, y: 60, text: "Our Mission", fontSize: 25, color: "#1e293b" },
            { id: "item-44", type: "text", x: 15, y: 78, text: "Innovation and customer success.", fontSize: 15, color: "#64748b" }
          ]
        },
        {
          id: "slide-13",
          items: [
            { id: "item-45", type: "circle", x: 25, y: 35, radius: 12, fill: "#3b82f6" },
            { id: "item-46", type: "circle", x: 50, y: 35, radius: 12, fill: "#22c55e" },
            { id: "item-47", type: "circle", x: 75, y: 35, radius: 12, fill: "#f59e0b" },
            { id: "item-48", type: "text", x: 15, y: 65, text: "Our Core Values", fontSize: 26, color: "#111827" }
          ]
        },
        {
          id: "slide-14",
          items: [
            { id: "item-49", type: "rectangle", x: 10, y: 10, width: 25, height: 50, fill: "#6366f1" },
            { id: "item-50", type: "rectangle", x: 40, y: 25, width: 25, height: 35, fill: "#8b5cf6" },
            { id: "item-51", type: "rectangle", x: 70, y: 5, width: 25, height: 55, fill: "#a78bfa" },
            { id: "item-52", type: "text", x: 15, y: 75, text: "Growth Statistics", fontSize: 24, color: "#111827" }
          ]
        },
        {
          id: "slide-15",
          items: [
            { id: "item-53", type: "rectangle", x: 0, y: 0, width: 100, height: 100, fill: "#172554" },
            { id: "item-54", type: "text", x: 20, y: 30, text: "Thank You", fontSize: 34, color: "#ffffff" },
            { id: "item-55", type: "text", x: 20, y: 55, text: "Questions & Discussion", fontSize: 18, color: "#bfdbfe" },
            { id: "item-56", type: "circle", x: 85, y: 85, radius: 7, fill: "#facc15" }
          ]
        }
      ]
    }
  ]
}

export default mockData