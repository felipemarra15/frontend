#!/bin/sh
# Reemplaza marcador __API_BASE__ en los JS/HTML con $API_BASE (si está seteada)
if [ -n "$API_BASE" ]; then
  find /usr/share/nginx/html -type f \( -name "*.js" -o -name "*.html" \) -print0 \
    | xargs -0 sed -i "s|__API_BASE__|$API_BASE|g"
fi
