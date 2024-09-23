#!/bin/bash

# Wait for MongoDB to be available
until nc -z mongo 27017; do
  echo "Waiting for MongoDB..."
  sleep 2
done

echo "MongoDB is up - executing Python script and starting the backend."
