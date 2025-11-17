Embeddable NPS Widget
======================

Quick guide to embed the NPS widget into any website.

Files added
- `backend/static/nps-widget.js` — standalone JS file you can include on any page.
- `backend/widget_embed_demo.html` — a small demo page showing usage.

How to use
1. Ensure your backend server (the repository's `server.py`) is running and reachable. By default the server runs at `http://127.0.0.1:8000`.
2. Serve `nps-widget.js` from a web-accessible location (CDN, your server's static directory, or copy into your app).
3. Add the script tag to the host website and call `NPSWidget.init(...)` with the backend endpoint:

```html
<script src="/path/to/nps-widget.js"></script>
<script>
  NPSWidget.init({ backendUrl: 'http://your-backend-host/submit_feedback' });
</script>
```

Notes
- The widget records audio using the browser's MediaRecorder API and sends a multipart/form-data POST to `backendUrl` with fields `score` (0-10) and `audio_data` (file).
- The server in this repo already enables CORS for all origins (fastapi CORSMiddleware allow_origins=["*"]) so cross-origin requests should work during development. Tighten this for production.
- `server.py` expects `audio_data` as an UploadFile and `score` as a form field (see `/submit_feedback`).

Security & production
- Restrict CORS origins on your backend in production.
- Serve the widget over HTTPS.
- Consider signing requests or adding an API key header if you want to restrict submissions.

Local test
1. Run the FastAPI server: `python backend/server.py` (or use uvicorn) — it listens on port 8000 by default.
2. Open `backend/widget_embed_demo.html` in a browser (or serve it from a simple static file server) and click the floating control to try the flow.
