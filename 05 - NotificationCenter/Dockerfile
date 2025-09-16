# Use a minimal Alpine Linux image as the base
FROM alpine:latest

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S app && \
    adduser -u 1001 -S app -G app

# Copy the pre-built binary
COPY notification-center /app/notification-center

# Change ownership and make executable
RUN chown -R app:app /app && \
    chmod +x /app/notification-center

# Switch to non-root user
USER app

# Expose port
EXPOSE 8080

# Run the application
CMD ["./notification-center"]