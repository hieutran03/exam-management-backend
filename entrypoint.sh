#!/bin/bash

echo "Running migrations..."
npx knex migrate:latest

echo "Running seed files..."
npx knex seed:run

echo "Starting the backend service..."
npm run start
