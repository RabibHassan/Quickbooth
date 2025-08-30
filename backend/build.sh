#!/usr/bin/env bash
# Exit on error
set -o errexit

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Create static directory if it doesn't exist
mkdir -p static

# Build frontend
cd ../frontend
npm install
npm run build
mkdir -p ../backend/static
cp -r dist/* ../backend/static/

# Back to backend directory
cd ../backend

# Collect static files
python manage.py collectstatic --no-input

# Run migrations
python manage.py migrate
