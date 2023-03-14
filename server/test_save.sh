#!/usr/bin/env bash

curl -X POST --location "http://127.0.0.1:8080/document" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"test\", \"content\": 123}"
