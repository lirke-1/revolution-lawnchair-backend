# Use the official Node.js image based on Alpine Linux (lightweight)
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /app

# Install build dependencies required for Argon2 and SQLite3
# These are removed automatically from the cache to keep the image small
RUN apk add --no-cache python3 make g++

# Copy package.json and package-lock.json first
# This allows Docker to cache the 'npm install' step if your dependencies haven't changed
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port defined in your .env (default 3000)
EXPOSE 3000

# Start the application using the script defined in package.json
CMD ["npm", "start"]