# syntax=docker/dockerfile:1

############################
# 1) Builder stage         #
############################
FROM rust:1.80-bookworm AS builder
WORKDIR /app

# System deps needed by common crates (openssl, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
      pkg-config libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the whole repo (simple & reliable; works for workspaces too)
COPY . .

# If you use a workspace and want reproducible builds, keep --locked
RUN cargo build --release --locked

############################
# 2) Runtime stage         #
############################
FROM debian:bookworm-slim AS runtime
WORKDIR /app

# Runtime libs the compiled binary often needs (glibc, openssl), plus curl for healthcheck, tini for PID 1
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates libssl3 libgcc-s1 libstdc++6 curl tini \
    && rm -rf /var/lib/apt/lists/*

# Copy only the binary (adjust name if your [[bin]] has a different name)
COPY --from=builder /app/target/release/stats-aggregator /app/stats-aggregator

# If your app needs runtime assets/config, include them here:
# COPY --from=builder /app/config ./config
# COPY --from=builder /app/migrations ./migrations
# COPY --from=builder /app/static ./static
# COPY --from=builder /app/.env ./.env

# Non-root user
RUN useradd -r -u 10001 -g nogroup app \
 && chown -R app:nogroup /app \
 && chmod +x /app/stats-aggregator
USER app

# Sensible defaults for web servers that might bind to 127.0.0.1 otherwise
ENV HOST=0.0.0.0 \
    ROCKET_ADDRESS=0.0.0.0 \
    AXUM_ADDR=0.0.0.0 \
    RUST_LOG=info \
    RUST_BACKTRACE=1

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost:8080/health || exit 1

ENTRYPOINT ["/usr/bin/tini","--"]
CMD ["./stats-aggregator"]