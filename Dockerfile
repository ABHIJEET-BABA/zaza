# Use Node 20
FROM node:20

# App directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build app (IMPORTANT)
RUN npm run build

# Expose port
EXPOSE 10000

# Start app (PRODUCTION)
CMD ["npm", "start"]
