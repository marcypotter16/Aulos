FROM node:18-bullseye

# Install watchman & expo-cli for React Native / Expo development
RUN apt-get update && \
    apt-get install -y git watchman && \
    npm install -g expo-cli

# Set the working directory inside the container
WORKDIR /usr/src/Aulos

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose the standard Expo dev ports
EXPOSE 8081 19000 19001 19002

# Start the Expo dev server
CMD ["npx", "expo", "start"]
