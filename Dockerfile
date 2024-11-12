# Dockerfile
# Use an official node image as the base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5173
EXPOSE 5173

# Update command to bind to all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]