# ===========================================
# BACKEND STAGES
# ===========================================

# ===========================
# Stage 1: Base Image
# ===========================
ARG PYTHON_VERSION=3.11
FROM python:${PYTHON_VERSION}-slim-bookworm AS base

USER root

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    tini \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r owner && useradd -r -g owner -m -d /home/owner owner

# ===========================
# Stage 2: Dependencies
# ===========================
FROM base AS dependencies

USER owner
WORKDIR /var/www/html

# Set PATH for user-installed packages
ENV PATH="/home/owner/.local/bin:${PATH}"

# Copy and install Python dependencies
COPY --chown=owner:owner ./backend/requirements.txt /var/www/html/requirements.txt

RUN pip3 install --upgrade pip --no-cache-dir \
    && pip3 install --no-cache-dir -r requirements.txt \
    && pip3 install --no-cache-dir uvicorn[standard]

# ===========================
# Stage 3: Application
# ===========================
FROM dependencies AS application

USER root

WORKDIR /var/www/html

ENV PATH="/home/owner/.local/bin:${PATH}"

# Copy application code
COPY --chown=owner:owner ./backend/ .

# Copy entrypoint script
COPY --chown=owner:owner ./backend/entrypoint.sh /usr/local/bin/entrypoint.sh

# Set permissions
RUN chmod +x /usr/local/bin/entrypoint.sh \
    && chown -R owner:owner /var/www/html

USER owner
WORKDIR /var/www/html

# Expose port
EXPOSE 8000

# Use tini as init system
CMD ["/usr/bin/tini", "--", "/usr/local/bin/entrypoint.sh"]

# ===========================================
# FRONTEND STAGES
# ===========================================

# ===========================
# Stage 4: Frontend Build
# ===========================
FROM node:18-alpine AS frontend-build

ARG VITE_API_URL=""

WORKDIR /app

# Copy package files
COPY ./frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY ./frontend/ .

# Set build-time env vars
ENV VITE_API_URL=${VITE_API_URL}

# Build the application
RUN npm run build

# ===========================
# Stage 5: Frontend (Nginx)
# ===========================
FROM nginx:1.27-alpine AS frontend

ENV APP_HOST=app
ENV APP_PORT=8000
ENV PORT=80
ENV SERVER_NAME=_

# Copy nginx template (envsubst-compatible)
COPY ./frontend/.dockerfiles/nginx/templates/default.conf /etc/nginx/templates/default.conf.template

# Copy built assets from build stage
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
