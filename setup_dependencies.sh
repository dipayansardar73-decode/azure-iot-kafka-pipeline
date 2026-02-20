#!/bin/bash
echo "Installing C++ dependencies via Homebrew..."

if ! command -v brew &> /dev/null; then
    echo "Homebrew not found. Please install Homebrew or manually install dependencies."
    exit 1
fi

brew update
brew install cmake librdkafka spdlog nlohmann-json

echo "Dependencies installed."
