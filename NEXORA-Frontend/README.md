# NEXORA Frontend

This folder contains only the React/Vite frontend extracted from the Google AI Studio project. The original UI pages and styling are preserved. The old Express backend (`server.ts` and `src/serverApp.ts`) has been excluded.

## Requirements
- Node.js 20.19+ or 22.12+ (Vite 8 requirement)
- The separate NEXORA Java Spring Boot backend running at `http://localhost:8080`

## Run locally
1. Open this folder in VS Code.
2. Open a terminal in this folder.
3. Install frontend dependencies:
   ```bash
   npm install
   ```
4. Start the frontend:
   ```bash
   npm run dev
   ```
5. Open the local URL shown by Vite (usually `http://127.0.0.1:5173`).

The Vite development server proxies `/api` requests to `http://localhost:8080`, so the frontend can call your Java backend without hardcoding a different API URL in each component.

## Important integration note
The UI is preserved, but its API client was originally written against the old Express backend's response shapes and authentication behavior. The Java backend may return different fields or support a different set of routes. If a page fails after the frontend starts, the next step is to align `src/utils/api.ts` and any response mapping with the actual Java endpoints. This extraction does not change the database or Java backend.
