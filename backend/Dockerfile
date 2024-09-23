# syntax=docker/dockerfile:1.4
# Use the official Python image from the Docker Hub
# syntax=docker/dockerfile:1.4
FROM ubuntu:latest

# Install Python and Node.js
#RUN apt-get update && apt-get install -y python3 python3-pip nodejs npm

# Update package list and install prerequisites
RUN apt-get update && apt-get install -y curl

# Add NodeSource official repository for Node.js 16.x
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -

# Install Node.js 16.x and other packages
RUN apt-get install -y nodejs python3 python3-pip

#
RUN node --version

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

EXPOSE 50741

CMD [ "python3", "parser.py", "tutorial" , "IDtutorial" ]

CMD [ "npm", "start" ]
