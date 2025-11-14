# frontend/Dockerfile
FROM nginx:1.27-alpine

# Copiamos sitio
COPY src/ /usr/share/nginx/html/

# Inyectar API_BASE en runtime: usamos un entrypoint que sustituye __API_BASE__ por env
COPY nginx-entrypoint.sh /docker-entrypoint.d/99-api-base.sh
RUN chmod +x /docker-entrypoint.d/99-api-base.sh

EXPOSE 80
