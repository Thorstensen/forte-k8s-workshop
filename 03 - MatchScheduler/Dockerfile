# ---- Build stage: compile TypeScript to dist/ ----
FROM node:18-alpine AS builder

WORKDIR /app

# Install build deps (dev deps included for TypeScript, etc.)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- Production stage: only runtime deps + compiled output ----
FROM node:18-alpine AS production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

# Create non-root user and group
RUN addgroup -g 1001 -S nodejs \
 && adduser -S matchscheduler -u 1001 -G nodejs

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Bring in compiled JS from builder
COPY --from=builder --chown=matchscheduler:nodejs /app/dist ./dist

USER matchscheduler

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { hostname: 'localhost', port: 3000, path: '/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { \
      if (res.statusCode === 200) process.exit(0); \
      else process.exit(1); \
    }); \
    req.on('error', () => process.exit(1)); \
    req.on('timeout', () => process.exit(1)); \
    req.end();"

CMD ["node", "dist/api/index.js"]