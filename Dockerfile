# syntax=docker/dockerfile:1.7

# --- Stage 1: build frontend ---
FROM node:22-alpine AS frontend
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

# --- Stage 2: python runtime ---
FROM python:3.12-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    STATIC_DIR=/app/static \
    DB_PATH=/data/site.db \
    PORT=8000

# unprivileged user that runs the app; setpriv (util-linux) drops root at start
RUN useradd --system --uid 10001 --no-create-home --shell /usr/sbin/nologin app \
    && setpriv --version

WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/main.py backend/start.sh ./
COPY --from=frontend /app/dist ./static
RUN chmod 0755 /app/start.sh && mkdir -p /data

EXPOSE 8000
CMD ["/app/start.sh"]
