# Create image based on the official Node 8 image from the dockerhub
FROM node:9.11.2-jessie 

# Create a directory where the server will be placed
RUN mkdir -p /usr/src/server

# Change the directory to run the commands
WORKDIR /usr/src/server

# Copy dependency definitions
COPY package.json /usr/src/server

ENV NODE_ENV 'development'

# Install dependencies
RUN npm install

# Get all the server source code
COPY . /usr/src/server

# Expose the server port
EXPOSE 3000
EXPOSE 8080

# Start the server
CMD ["npm", "start"]



