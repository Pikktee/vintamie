// API utilities to communicate with the FastAPI backend
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000'
  : `${window.location.protocol}//${window.location.hostname}:8000`; // Dynamic fallback for local network access

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

export const uploadAndAnalyze = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Fehler beim Hochladen und Analysieren des Bildes.');
  }

  return response.json();
};

export const getDrafts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/drafts`);
  if (!response.ok) {
    throw new Error('Fehler beim Laden der Entwürfe.');
  }
  return response.json();
};

export const getDraft = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/drafts/${id}`);
  if (!response.ok) {
    throw new Error('Fehler beim Laden des Entwurfs.');
  }
  return response.json();
};

export const updateDraft = async (id, draftData) => {
  const response = await fetch(`${API_BASE_URL}/api/drafts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(draftData),
  });

  if (!response.ok) {
    throw new Error('Fehler beim Aktualisieren des Entwurfs.');
  }

  return response.json();
};

export const deleteDraft = async (id) => {
  const response = await fetch(`${API_BASE_URL}/api/drafts/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Fehler beim Löschen des Entwurfs.');
  }
  
  return true;
};
