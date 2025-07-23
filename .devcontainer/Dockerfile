# Expo Dev Container Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:20

# Install dependencies for Expo
RUN apt-get update && \
    apt-get install -y libgl1-mesa-glx

# Set working directory
WORKDIR /workspace

# Expose Expo ports
EXPOSE 19000 19001 19002
