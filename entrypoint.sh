#!/bin/sh
# Rebuild bcrypt to ensure it's compatible with the current architecture
npm rebuild bcrypt --build-from-source
# Execute the CMD from the Dockerfile
exec "$@"