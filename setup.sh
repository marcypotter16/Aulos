
#!/usr/bin/env bash
set -e

# 1. Backend
echo "→ Setting up backend…"
cd API
uv venv .
source .venv/bin/activate
uv sync

# 2. Frontend
echo "→ Installing frontend deps…"
cd ..
npm install

echo "✅ All set! Run 'cd API && uv run uvicorn main:app' in one terminal and 'npx expo start' in another."
