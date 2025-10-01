FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client for Alpine Linux
RUN npx prisma generate

# Copy application code
COPY . .

# Expose port
EXPOSE 3102

# Start the application
CMD ["npm", "start"]