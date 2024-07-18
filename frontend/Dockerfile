# frontend/Dockerfile

# Use the official Node.js image as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# RUN rm -rf node_modules package-lock.json


# Install dependencies
RUN npm install
RUN npm install vite

# Copy the rest of the frontend code
COPY . .

# Build the frontend code
RUN npm run build

# Install a simple HTTP server to serve static files
RUN npm install -g serve

# Expose the frontend port
EXPOSE 3000

# Define the command to run the frontend
CMD [ "serve", "-s", "dist" ]