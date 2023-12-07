# Development Dockerfile used with docker-compose 
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json files first
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN chmod +x /app/local-run.sh

EXPOSE 8080