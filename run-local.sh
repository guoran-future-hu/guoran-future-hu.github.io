#!/usr/bin/env bash
set -e
# Run with Git Bash on Windows: bash run-local.sh
cd "$(dirname "$0")"
# Install dependencies on the first run (requires Node.js 22.12+).
if [ ! -d node_modules ]; then npm ci; fi
# Open http://localhost:4000. Saved edits update automatically. Ctrl+C stops it.
npm run dev
