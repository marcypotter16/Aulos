
#!/usr/bin/env bash
set -e

# 1. Backend
echo "→ Setting up backend…"
cd API
uv venv .
source .venv/bin/activate
uv pip install .

# 2. Frontend
echo "→ Installing frontend deps…"
cd ..
npm install

echo "✅ All set! Run 'cd API && PYTHONPATH=src uvicorn main:app --reload' in one terminal and 'npx expo start' in another."
