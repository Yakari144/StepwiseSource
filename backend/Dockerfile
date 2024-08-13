# syntax=docker/dockerfile:1.4
# Use the official Python image from the Docker Hub
FROM python:3.9-slim
FROM node:lts-buster-slim AS development

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
