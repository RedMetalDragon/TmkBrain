# Use node base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Install Python and build dependencies for node-gyp
RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

# Install npm packages, including bcrypt
COPY package*.json ./
RUN npm install && npm rebuild bcrypt --build-from-source

# Copy the rest of the application source code
COPY . .

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
# Expose the application port
EXPOSE 3001

# Run the application without nodemon, directly with node
CMD ["node", "-r", "ts-node/register", "./src/index.ts"]
