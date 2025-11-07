# Sirve el frontend con Nginx y hace de reverse-proxy para /api
FROM nginx:1.27-alpine

# Config de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Archivos estáticos del frontend:
# - Si tu proyecto ya genera 'dist/' (Vite/React), dejá la salida en ./dist
# - Si es HTML/JS plano, dejá index.html y assets en ./static
# Copiamos ambas rutas si existen (las que no existan no rompen el build)
COPY dist/ /usr/share/nginx/html/
COPY static/ /usr/share/nginx/html/

# Exponer puerto HTTP
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
