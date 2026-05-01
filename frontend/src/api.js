const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // ✅ CKD chatbot with history
  chat: (message, history = []) =>
    request("/api/chat/chat", {
      method: "POST",
      body: JSON.stringify({ message, history }),
    }),

  // ✅ Lab analyzer – PDF / image / txt (backend handles types)
  analyzeLab: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${API_BASE}/api/labs/upload`, {
      method: "POST",
      body: formData, // do NOT set Content-Type, browser sets multipart boundary
    }).then((res) => {
      if (!res.ok) {
        return res.text().then((t) => {
          throw new Error(t || "Lab analysis failed");
        });
      }
      return res.json();
    });
  },

  // ✅ Diet planner
  planDiet: (params) =>
    request("/api/diet/plan", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  // ✅ Risk assessment
  assessRisk: (params) =>
    request("/api/risk/assess", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  // ✅ Medications
  listMeds: () => request("/api/meds"),
  addMed: (med) =>
    request("/api/meds", {
      method: "POST",
      body: JSON.stringify(med),
    }),
  deleteMed: (id) =>
    request(`/api/meds/${id}`, {
      method: "DELETE",
    }),

  // ✅ Wellness companion
  wellnessChat: (message) =>
    request("/api/wellness/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  // ✅ Progress summary
  progressSummary: () => request("/api/progress"),
};
