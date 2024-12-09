# syntax=docker/dockerfile:1.4
# Use the official Python image from the Docker Hub
# syntax=docker/dockerfile:1.4
FROM ubuntu:latest

# Update package list and install prerequisites
RUN apt-get update && apt-get install -y curl netcat

# Add NodeSource official repository for Node.js 16.x
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -

# Install Node.js 16.x, python and other packages
RUN apt-get install -y nodejs python3 python3-pip

# Create app directory
WORKDIR /usr/src/app

# Copy the requirements file into the container
COPY requirements.txt .
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

# Install the dependencies
# Install pip if not already installed
RUN python3 -m pip --version || apt-get update && apt-get install -y python3-pip
RUN pip3 install --no-cache-dir -r requirements.txt
RUN npm ci

COPY . /usr/src/app

# Copy the .env.production file into the container
COPY .env.production .env

EXPOSE 50741

# Add wait-for-mongo.sh script
COPY wait-for-mongo.sh /usr/src/app/wait-for-mongo.sh
RUN chmod +x /usr/src/app/wait-for-mongo.sh

# Command to wait for MongoDB, run the Python script, and start the Node server
CMD [ "sh", "-c", "./wait-for-mongo.sh && python3 parser.py tutorial 'How to create your presentation' IDtutorial && npm start" ]
