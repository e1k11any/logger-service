# ---------------------------------------
# Stage 1: Build the application
# ---------------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package definition first (for caching)
COPY package*.json ./

# Install ALL dependencies (including devDependencies for TypeScript)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# ---------------------------------------
# Stage 2: Create Production Image
# ---------------------------------------
FROM node:18-alpine

WORKDIR /app

# Copy package definition
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# Copy built assets from the 'builder' stage
COPY --from=builder /app/dist ./dist

# Create a non-root user for security (Best Practice)
USER node

# Expose port (Documentation only)
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]