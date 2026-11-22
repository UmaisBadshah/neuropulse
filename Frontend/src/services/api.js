const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'

// These endpoints are placeholders. Match them to your Django REST API before enabling live processing.
export async function uploadRecording(file) {
  const body = new FormData()
  body.append('file', file)
  const response = await fetch(`${API_BASE}/recordings/upload/`, { method: 'POST', body })
  if (!response.ok) throw new Error(`Upload failed (${response.status})`)
  return response.json()
}

export async function startAnalysis(recordingId) {
  const response = await fetch(`${API_BASE}/recordings/${recordingId}/analyze/`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({})
  })
  if (!response.ok) throw new Error(`Analysis request failed (${response.status})`)
  return response.json()
}

export async function getAnalysis(analysisId) {
  const response = await fetch(`${API_BASE}/analysis/${analysisId}/`)
  if (!response.ok) throw new Error(`Could not load analysis (${response.status})`)
  return response.json()
}
