FROM node:20.16.0-alpine3.20

COPY . app
WORKDIR /app
# Install dependencies
RUN npm ci

# Start the application
CMD ["npm", "start"]