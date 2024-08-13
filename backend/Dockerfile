# syntax=docker/dockerfile:1.4
# Use the official Python image from the Docker Hub
# syntax=docker/dockerfile:1.4
FROM ubuntu:latest

# Install Python and Node.js
RUN apt-get update && apt-get install -y python3 python3-pip nodejs npm


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

CMD [ "npm", "run", "dev" ]

# Create app directory
WORKDIR /usr/src/app

# Copy the requirements file into the container
COPY requirements.txt .
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
# Install the dependencies
RUN python -m ensurepip
RUN pip install --no-cache-dir -r requirements.txt
RUN npm ci

COPY . /usr/src/app

EXPOSE 50741

CMD [ "npm", "run", "dev" ]
