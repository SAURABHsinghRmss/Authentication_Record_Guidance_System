# EduIdentityAI Production Dockerfile
# Python 3.13 Slim with compiled system dependencies and air-gapped wheel support

FROM python:3.13-slim

WORKDIR /app

# Install system dependencies required for PostgreSQL, OpenCV/Facial Biometrics, and Audio processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsndfile1 \
    ffmpeg \
    curl \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Copy requirements and dependency cache
COPY backend/requirements.txt ./backend/
COPY backend/requirements-ai.txt ./backend/
COPY dependencies/python_wheels/ ./dependencies/python_wheels/

# Install Python dependencies (prefers offline cached wheels if available, falls back to PyPI)
RUN if [ -d "dependencies/python_wheels" ] && [ "$(ls -A dependencies/python_wheels)" ]; then \
        pip install --no-index --find-links=dependencies/python_wheels/ -r backend/requirements.txt; \
    else \
        pip install --no-cache-dir -r backend/requirements.txt; \
    fi

# Copy application source code
COPY backend/ ./backend/
COPY alembic/ ./alembic/
COPY alembic.ini ./alembic.ini
COPY storage/ ./storage/
COPY eduidentity.db ./eduidentity.db

# Expose FastAPI port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Run Uvicorn multi-worker production server
CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
