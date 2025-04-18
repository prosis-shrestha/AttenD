FROM node:18-alpine

# Create app directory and set permissions
WORKDIR /app

# Add a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY --chown=appuser:appgroup . .

# Create a simple health check endpoint
RUN echo 'app.get("/health", (req, res) => res.status(200).send("OK"));' >> src/index.js

# Expose port
EXPOSE 5000

# Switch to non-root user
USER appuser

# Start the application
CMD ["node", "src/index.js"]