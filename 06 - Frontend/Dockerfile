# ---- Build stage ----
FROM node:18-alpine AS build

WORKDIR /app
# Keep prod env while explicitly including dev deps for the build
ENV NODE_ENV=production

# Install deps (incl. dev) for Vite build
COPY package*.json ./
RUN npm ci --include=dev

# Build
COPY . .
RUN npm run build \
  && npm prune --omit=dev \
  && npm cache clean --force

# ---- Runtime stage (unprivileged NGINX) ----
# Runs as non-root by default and listens on 8080
FROM nginxinc/nginx-unprivileged:stable-alpine

# Optional: quiet some entrypoint logs
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

# Static site
COPY --from=build /app/dist /usr/share/nginx/html

# Your config should listen on 8080 (e.g., `listen 8080;`)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

# Use busybox wget for healthcheck (already in the image)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://localhost:8080/health >/dev/null 2>&1 || exit 1

# Already non-root (USER 101) and correct NGINX entrypoint
CMD ["nginx", "-g", "daemon off;"]