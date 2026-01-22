#!/bin/bash
# Setup script for demo project
# This ensures React is properly hoisted and the package is correctly linked

echo "Setting up demo project..."

# Remove existing installation
rm -rf node_modules/simplevoicerecorderreact
rm -rf node_modules/.cache

# Remove React from package's node_modules if it exists
cd ..
if [ -d "node_modules/react" ]; then
  echo "Removing React from package node_modules..."
  rm -rf node_modules/react node_modules/react-dom
fi
cd demo

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Setup complete! Run 'npm start' to start the demo."

