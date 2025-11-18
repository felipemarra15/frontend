# Frontend

Aplicación web frontend para registro y listado de usuarios. Consume la API REST `users-api` para operaciones CRUD.

## Descripción

Este proyecto implementa la interfaz de usuario de una aplicación de Registro de Usuarios, desarrollada con HTML, CSS y JavaScript vanilla. Permite a los usuarios:

- Registrar nuevos usuarios mediante un formulario
- Ver el listado de todos los usuarios registrados
- Interfaz responsive y moderna

## Tecnologías

- **HTML5**: Estructura de la aplicación
- **CSS3**: Estilos y diseño responsive
- **JavaScript (Vanilla)**: Lógica del cliente y comunicación con la API
- **Nginx**: Servidor web para servir archivos estáticos

## Configuración

El frontend se conecta a la API backend mediante la variable de entorno `API_BASE_URL`, configurada a través de un ConfigMap en Kubernetes.

## Despliegue

La aplicación se despliega en AWS EKS con:
- **Servicio**: NodePort
- **Ingress**: AWS Application Load Balancer (ALB)
- **HTTPS**: Certificado SSL/TLS mediante AWS Certificate Manager
- **Dominio**: sub.labinfrafinal2025.cloud-ip.cc
