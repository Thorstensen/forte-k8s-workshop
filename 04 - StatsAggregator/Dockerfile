# Runtime stage only - using pre-built binary
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r statsaggregator && useradd -r -g statsaggregator statsaggregator

# Set working directory
WORKDIR /app

# Copy the pre-built binary
COPY target/release/stats-aggregator /app/stats-aggregator

# Change ownership to non-root user
RUN chown -R statsaggregator:statsaggregator /app

# Switch to non-root user
USER statsaggregator

# Expose the port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Run the application
CMD ["./stats-aggregator"]