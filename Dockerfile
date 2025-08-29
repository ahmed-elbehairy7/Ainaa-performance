FROM golang:1.25-alpine 
# as builder

# Install required tools for building
RUN apk add --no-cache git build-base

# Install xk6
RUN go install go.k6.io/xk6/cmd/xk6@latest

# Build k6 with dns extension
RUN xk6 build --with github.com/grafana/xk6-dns@latest

# Final stage
# FROM alpine:3.18

# # Install CA certificates
# RUN apk add --no-cache ca-certificates

# # Copy the k6 binary from builder
# COPY --from=builder /go/k6 /usr/bin/k6

# Set working directory
WORKDIR /scripts

# Copy the test script
COPY dns_soak.js .

# Command to run the test
ENTRYPOINT ["k6", "run", "dns_soak.js"]
