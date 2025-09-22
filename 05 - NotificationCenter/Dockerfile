# syntax=docker/dockerfile:1

############################
# 1) Builder stage         #
############################
FROM golang:1.24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./

# Install git required for go mod download
RUN apk add --no-cache git

# Download dependencies (skip TLS verification for build environment)
ENV GOPROXY=direct
ENV GOSUMDB=off
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o notification-center .

############################
# 2) Runtime stage         #
############################
FROM alpine:latest

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S app && \
    adduser -u 1001 -S app -G app

# Copy binary from builder stage
COPY --from=builder /app/notification-center /app/notification-center

# Change ownership and make executable
RUN chown -R app:app /app && \
    chmod +x /app/notification-center

# Switch to non-root user
USER app

# Expose port
EXPOSE 8080

# Run the application
CMD ["./notification-center"]