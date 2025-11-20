# Women Safety Backend

This Express + MongoDB backend exposes APIs for user onboarding and short emergency audio uploads. The new `/api/v1/recordings` endpoint accepts a 10-second clip, streams it to Cloudinary, and persists metadata for later alerting workflows.

## Environment

Create a `.env` file in the project root with at least:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/women-safety
CLOUDINARY_CLOUD_NAME=acme-cloud
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
# Optional custom folder inside Cloudinary
CLOUDINARY_AUDIO_FOLDER=women-safety/recordings
```

## Install & Run

```powershell
cd "d:/women safety/backend"
npm install
npm start
```

The server expects a reachable MongoDB URI and valid Cloudinary credentials.

## Auth API

- `POST /api/v1/auth/login` – email/password login, returns access + refresh tokens (also set as HTTP-only cookies).
- `POST /api/v1/auth/refresh-token` – exchange a valid refresh token for fresh tokens.
- `GET /api/v1/auth/me` – protected endpoint, returns the authenticated user's profile.
- `POST /api/v1/auth/logout` – protected endpoint, clears stored refresh token and auth cookies.

## Recording Upload API

- **Route**: `POST /api/v1/recordings`
- **Form field**: `recording` (audio file, ≤10 MB)
- **Body fields** (multipart alongside the file):
    - `userId` (required) – MongoDB `_id` of the reporter
    - `durationSeconds` (optional, defaults to 10)
    - `recordedAt` (ISO date string, optional)
    - `latitude` / `longitude` (optional)
    - `notes` (optional text)

### Sample cURL

```bash
curl -X POST http://localhost:8000/api/v1/recordings \
  -F "userId=6656c757f8a3b06ad9c23d11" \
  -F "durationSeconds=10" \
  -F "recording=@./sos.m4a"
```

Successful uploads respond with the stored recording document, including the `cloudStorageUrl` pointing at the uploaded object.
