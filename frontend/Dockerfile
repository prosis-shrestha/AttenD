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
