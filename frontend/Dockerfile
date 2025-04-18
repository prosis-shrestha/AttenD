# # Build stage
# FROM node:18-alpine AS builder
# WORKDIR /app

# # Install dependencies
# COPY package*.json ./
# RUN npm ci

# # Build the app
# COPY . .
# RUN npm run build

# # Production stage with NGINX
# FROM nginx:alpine

# # Copy built assets from builder stage
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Add custom nginx config
# RUN echo 'server { \
#     listen 80; \
#     root /usr/share/nginx/html; \
#     index index.html; \
#     location / { \
#     try_files $uri $uri/ /index.html; \
#     } \
#     location /api/ { \
#     proxy_pass http://backend:5000/; \
#     proxy_http_version 1.1; \
#     proxy_set_header Upgrade $http_upgrade; \
#     proxy_set_header Connection "upgrade"; \
#     proxy_set_header Host $host; \
#     } \
#     }' > /etc/nginx/conf.d/default.conf


# EXPOSE 80

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
# 👇 Inject Railway env var into Docker build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# Serve via nginx
FROM nginx:alpine

# Copy static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
