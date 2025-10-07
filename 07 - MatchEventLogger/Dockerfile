# Multi-stage build for Match Event Logger
FROM python:3.11-slim AS builder

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Runtime stage
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY main.py .

# Ensure scripts are in PATH
ENV PATH=/root/.local/bin:$PATH

# Create default log directory (will be overridden by volume mount)
RUN mkdir -p /var/log/match-events && \
    chmod 777 /var/log/match-events

# Environment variable for log directory
ENV LOG_DIR=/var/log/match-events

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/api/health')" || exit 1

CMD ["python", "main.py"]
