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
RUN pip install --no-cache-dir -r requirements.txt
RUN npm ci

COPY . /usr/src/app

EXPOSE 50741

CMD [ "npm", "run", "dev" ]

FROM development as dev-envs
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
EOF

RUN <<EOF
useradd -s /bin/bash -m vscode
groupadd docker
usermod -aG docker vscode
EOF
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
CMD [ "npm", "run", "dev" ]