#!/bin/bash

# Check if sample.env exists
if [ ! -f "sample.env" ]; then
  echo "Error: sample.env does not exist."
  exit 1
fi

# Check if .env exists
if [ -f ".env" ]; then
  echo ".env file already exists."
  read -p "Do you want to overwrite it with sample.env? (y/n): " choice
  case "$choice" in
    y|Y )
      cp sample.env .env
      echo ".env file has been updated with contents from sample.env."
      ;;
    n|N )
      echo "No changes made to the .env file."
      ;;
    * )
      echo "Invalid input. No changes made to the .env file."
      ;;
  esac
else
  echo ".env file does not exist. Creating .env file..."
  cp sample.env .env
  echo ".env file created and contents copied from sample.env."
fi
