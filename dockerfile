FROM node:20-alpine

WORKDIR /app

# Copy dependency files 
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Compile TypeScript -> dist/
RUN npm run build

# Expose API port
EXPOSE 3000

# Run compiled JS
CMD ["node", "dist/server.js"]
