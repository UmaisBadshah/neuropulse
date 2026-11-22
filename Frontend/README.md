# NeuroClean — EEG Artifact Analysis Frontend

A responsive React + Vite dashboard starter for an EEG artifact detection and reconstruction research workflow. It is designed to connect to a Django REST API and a server-side Python/MNE/ZUNA processing service.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

For Windows CMD, create `.env` manually by copying `.env.example` and keep the same variable name.

## Build for deployment

```bash
npm run build
npm run preview
```

The production build is written to `dist/`.

## Included screens
- Dashboard overview and recent recordings
- EEG file upload interface (FIF, EDF, BDF, SET)
- Signal analysis waveform explorer
- Artifact interval review table with selectable segments
- ZUNA1.1 reconstruction configuration and before/after preview
- Reports placeholder
- Django API / model integration settings

## Important: demo data vs real processing
This ZIP contains the frontend only. The charts, statistics, artifact intervals, reconstruction progress and sample recordings are illustrative UI data. The reconstruction screen does **not** run ZUNA1.1 in the browser. Real artifact detection and reconstruction must be implemented in your Django/Python backend and returned through API endpoints.

The upload page attempts a request only when `VITE_API_BASE_URL` is configured. Without that variable it adds a local demo recording so you can explore the UI.

## Django API contract to implement
The frontend service is in `src/services/api.js`. The starter expects these endpoints; adjust them to your actual Django URLs and response format:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/recordings/upload/` | Multipart upload; form field `file`; return `{ "id": "...", "name": "..." }` |
| POST | `/api/recordings/{id}/analyze/` | Queue preprocessing + artifact detection; return `{ "analysis_id": "...", "status": "queued" }` |
| GET | `/api/analysis/{analysis_id}/` | Return job status, artifact intervals, metadata and output URLs |

For long recordings, use a background worker (for example Celery) and have the frontend poll the analysis endpoint. Keep the original EEG file immutable and store reconstructed output separately.

## Suggested backend response shape

```json
{
  "analysis_id": "analysis-123",
  "status": "completed",
  "recording": { "id": "rec-123", "sampling_rate": 256, "channels": ["Fp1", "Fp2", "C3"] },
  "artifacts": [
    { "channel": "Fp1", "type": "eye_movement", "start_seconds": 5.2, "end_seconds": 8.4, "confidence": 0.96 }
  ],
  "outputs": { "reconstructed_fif_url": "/media/processed/rec-123_clean.fif" }
}
```

## Notes
- Use anonymized/coded subject identifiers in development.
- Do not treat artifact labels or reconstructed signals as clinical findings.
- Have qualified reviewers assess whether reconstruction preserves relevant EEG information.
