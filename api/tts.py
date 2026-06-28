from http.server import BaseHTTPRequestHandler
import json
import asyncio
import edge_tts

VOICES = {
    "female": "en-NG-EzinneNeural",
    "male":   "en-NG-AbeoNeural",
}

class handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # suppress default request logging

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)

        try:
            data = json.loads(body)
        except Exception:
            self._error(400, "invalid json")
            return

        text = (data.get("text") or "").strip()
        if not text:
            self._error(400, "text is required")
            return

        voice_name = VOICES.get(data.get("voice", "female"), VOICES["female"])

        try:
            audio = asyncio.run(self._synth(text[:500], voice_name))
        except Exception as exc:
            self._error(500, str(exc))
            return

        self.send_response(200)
        self.send_header("Content-Type", "audio/mpeg")
        self.send_header("Content-Length", str(len(audio)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(audio)

    def _error(self, status: int, msg: str):
        body = json.dumps({"error": msg}).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    async def _synth(self, text: str, voice: str) -> bytes:
        communicate = edge_tts.Communicate(text, voice)
        chunks = []
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                chunks.append(chunk["data"])
        return b"".join(chunks)
