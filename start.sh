#!/usr/bin/env bash
echo "========================================================"
echo "Starting EduIdentityAI Platform (Full Stack / Frontend)"
echo "========================================================"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting development server on http://localhost:3000 ..."
npm run dev
