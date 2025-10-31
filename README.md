# frontend
Frontend para alta y listado de usuarios. Consume users-api. Despliegue en EKS con HTTPS.

Este proyecto implementa el backend de una aplicación Full-Stack de Registro de Usuarios, desarrollada en Django + Django REST Framework.
La API permite crear y consultar usuarios almacenados en una base de datos PostgreSQL, y envía una notificación por correo electrónico (TurboSMTP) cada vez que se crea un nuevo usuario.


| Paquete                 | Descripción                                                     |
| -----------------------   --------------------------------------------------------------- |
| **Django**                Framework principal para desarrollo web en Python.              |
| **djangorestframework**   Extensión para crear APIs RESTful.                              |
| **psycopg2-binary**       Driver para conexión con PostgreSQL.                            |
| **django-cors-headers**   Permite solicitudes entre dominios (CORS) desde el frontend.    |
| **TurboSMTP**             Servicio externo utilizado para el envío de correos (vía SMTP). |
