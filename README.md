# Frontend - Aplicación Web de Registro de Usuarios

Interfaz web moderna para registro y consulta de usuarios. Desarrollada con HTML5, CSS3 y JavaScript vanilla, desplegada en AWS EKS con Nginx.

## 📋 Descripción del Proyecto

Este proyecto implementa el **frontend** de la aplicación de Registro de Usuarios como parte del **Ejercicio 2 y 3** del trabajo práctico de Administración de Infraestructuras, utilizando una arquitectura de microservicios en AWS.

### Funcionalidades Principales

- ✅ **Formulario de registro**: Permite registrar nuevos usuarios (Nombre, Email, Teléfono)
- ✅ **Lista de usuarios**: Muestra todos los usuarios registrados en una tabla responsive
- ✅ **Consumo de API REST**: Se comunica con `users-api` para operaciones CRUD
- ✅ **Interfaz responsive**: Diseño adaptable a dispositivos móviles y desktop
- ✅ **Validación de formularios**: Validación de campos en el cliente
- ✅ **Manejo de errores**: Feedback visual para el usuario

## 🏗️ Arquitectura

```
Internet → ALB (HTTPS) → frontend-service (NodePort) → frontend-deployment (Nginx)
                                    ↓
                              users-api-service
```

### Flujo de Datos

1. Usuario accede a `https://sub.labinfrafinal2025.cloud-ip.cc`
2. ALB redirige tráfico HTTPS al Service NodePort del frontend
3. Nginx sirve archivos estáticos HTML/CSS/JS
4. JavaScript consume API REST de `users-api-service`
5. users-api se comunica con AWS RDS y notification-service

## 🔧 Tecnologías

### Stack Frontend

| Tecnología       | Descripción                                           |
| ---------------- | ----------------------------------------------------- |
| **HTML5**        | Estructura semántica de la aplicación                |
| **CSS3**         | Estilos modernos y responsive design                 |
| **JavaScript**   | Lógica del cliente (Vanilla JS, sin frameworks)      |
| **Nginx**        | Servidor web para servir archivos estáticos          |

### Infraestructura

| Componente       | Descripción                                           |
| ---------------- | ----------------------------------------------------- |
| **AWS EKS**      | Kubernetes gestionado para orquestación              |
| **AWS ALB**      | Application Load Balancer para HTTPS                 |
| **AWS ACM**      | Certificate Manager para certificados SSL            |
| **Docker**       | Containerización de la aplicación                     |
| **ECR**          | Registro de imágenes Docker                           |

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── index.html          # Página principal
│   ├── registrar.html      # Formulario de registro
│   ├── listar.html         # Lista de usuarios
│   ├── config.js           # Configuración (API_BASE_URL)
│   ├── css/
│   │   └── styles.css      # Estilos de la aplicación
│   └── js/
│       ├── api.js          # Cliente HTTP para la API
│       ├── main.js         # Lógica de index.html
│       ├── registrar.js    # Lógica de registrar.html
│       └── listar.js       # Lógica de listar.html
├── k8s/
│   ├── frontend-configmap.yaml    # ConfigMap con API_BASE
│   ├── frontend-deployment.yaml   # Deployment y Service
│   └── frontend-ingress.yaml      # Ingress con ALB
├── Dockerfile
├── nginx-entrypoint.sh     # Script para inyectar variables de entorno
└── README.md
```

## 🌐 Páginas de la Aplicación

### 1. Página Principal (`index.html`)
- Descripción del proyecto
- Enlaces a Registrar y Listar usuarios
- Información de arquitectura

### 2. Registrar Usuario (`registrar.html`)
Formulario con los siguientes campos:
- **Nombre**: Campo de texto (requerido)
- **Email**: Campo de email con validación (requerido)
- **Teléfono**: Campo de texto (requerido)

**Ejemplo de envío:**
```javascript
const usuario = {
  nombre: "Juan Pérez",
  email: "juan@example.com",
  telefono: "+59899123456"
};

fetch(`${API_BASE_URL}/api/usuarios/`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(usuario)
});
```

### 3. Listar Usuarios (`listar.html`)
- Tabla responsive con todos los usuarios
- Columnas: ID, Nombre, Email, Teléfono, Fecha de creación
- Actualización automática al cargar la página

## ⚙️ Configuración

### Variables de Entorno

La URL de la API se configura mediante un ConfigMap de Kubernetes:

**`k8s/frontend-configmap.yaml`:**
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: frontend-config
  namespace: app
data:
  API_BASE: "https://api.labinfrafinal2025.cloud-ip.cc"
```

### Inyección de Variables en Runtime

El archivo `nginx-entrypoint.sh` inyecta la variable `API_BASE` en `config.js` al iniciar el contenedor:

```bash
#!/bin/sh
# Reemplazar placeholder con variable de entorno
sed -i "s|API_BASE_URL_PLACEHOLDER|${API_BASE}|g" /usr/share/nginx/html/config.js
# Iniciar Nginx
nginx -g 'daemon off;'
```

**`src/config.js`:**
```javascript
const API_BASE_URL = 'API_BASE_URL_PLACEHOLDER';
```

## 🐳 Containerización

### Dockerfile

```dockerfile
FROM nginx:alpine

# Copiar archivos de la aplicación
COPY src/ /usr/share/nginx/html/

# Copiar script de entrypoint
COPY nginx-entrypoint.sh /
RUN chmod +x /nginx-entrypoint.sh

# Exponer puerto 80
EXPOSE 80

# Ejecutar script de entrypoint
ENTRYPOINT ["/nginx-entrypoint.sh"]
```

### Construcción y Push a ECR

```bash
# 1. Autenticarse en ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 757054385635.dkr.ecr.us-east-1.amazonaws.com

# 2. Construir imagen
docker build -t frontend .

# 3. Etiquetar
docker tag frontend:latest 757054385635.dkr.ecr.us-east-1.amazonaws.com/frontend:latest

# 4. Subir a ECR
docker push 757054385635.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
```

## ☸️ Despliegue en AWS EKS

### Arquitectura de Despliegue

- **Cluster**: cluster-eks (AWS EKS)
- **Namespace**: app
- **Replicas**: 2 pods
- **Service Type**: NodePort (puerto 30557)
- **Exposición pública**: Application Load Balancer (ALB)
- **Dominio**: https://sub.labinfrafinal2025.cloud-ip.cc
- **Certificado SSL**: AWS Certificate Manager
- **Redirección**: HTTP → HTTPS automática

### Deployment y Service

**`k8s/frontend-deployment.yaml`:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  namespace: app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: 757054385635.dkr.ecr.us-east-1.amazonaws.com/frontend:latest
        ports:
        - containerPort: 80
        env:
        - name: API_BASE
          valueFrom:
            configMapKeyRef:
              name: frontend-config
              key: API_BASE
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "200m"
            memory: "256Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: app
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
```

### Ingress con ALB

**`k8s/frontend-ingress.yaml`:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: frontend-ingress
  namespace: app
  annotations:
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
    alb.ingress.kubernetes.io/ssl-redirect: '443'
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-east-1:757054385635:certificate/xxx
spec:
  ingressClassName: alb
  rules:
  - host: sub.labinfrafinal2025.cloud-ip.cc
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

### Aplicar Manifiestos

```bash
# 1. Crear namespace
kubectl apply -f ../k8s/00-namespace.yaml

# 2. Aplicar ConfigMap
kubectl apply -f k8s/frontend-configmap.yaml

# 3. Desplegar aplicación
kubectl apply -f k8s/frontend-deployment.yaml

# 4. Crear Ingress (ALB)
kubectl apply -f k8s/frontend-ingress.yaml

# 5. Verificar estado
kubectl get pods -n app
kubectl get svc -n app
kubectl get ingress -n app
```

## 🔐 Seguridad

### HTTPS con AWS Certificate Manager

1. **Solicitar certificado en ACM**:
   - Dominio: `sub.labinfrafinal2025.cloud-ip.cc`
   - Validación DNS mediante ClouDNS
   - Certificado gratuito y auto-renovable

2. **Configurar redirección HTTP → HTTPS**:
   ```yaml
   alb.ingress.kubernetes.io/ssl-redirect: '443'
   ```

3. **Forzar HTTPS**:
   - Todas las conexiones HTTP se redirigen automáticamente a HTTPS
   - Certificado válido y confiable (navegadores lo aceptan)

### CORS y Seguridad del Cliente

- **CORS habilitado** en `users-api` para permitir peticiones desde el dominio del frontend
- **Validación de entrada** en formularios JavaScript
- **Escape de HTML** para prevenir XSS

## 📊 Monitoreo

### Ver Estado de Pods

```bash
kubectl get pods -n app -l app=frontend
kubectl logs -n app -l app=frontend
```

### Verificar Ingress y ALB

```bash
kubectl get ingress -n app
kubectl describe ingress frontend-ingress -n app
```

### Obtener URL del ALB

```bash
kubectl get ingress frontend-ingress -n app -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

## 🧪 Desarrollo Local

### Requisitos Previos

- Navegador web moderno
- Servidor web local (Python, Node.js, o similar)

### Ejecutar Localmente

**Opción 1: Python HTTP Server**
```bash
cd src
python3 -m http.server 8080
```

**Opción 2: Node.js HTTP Server**
```bash
cd src
npx http-server -p 8080
```

**Opción 3: Live Server (VSCode Extension)**
```
Instalar extensión "Live Server" y hacer clic derecho en index.html → "Open with Live Server"
```

### Configurar API Local

Modificar `src/config.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000';  // users-api local
```

## 🧩 Integración con Backend

### Comunicación con users-api

El frontend se comunica con el backend mediante fetch API:

**`src/js/api.js`:**
```javascript
class API {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getUsuarios() {
    const response = await fetch(`${this.baseURL}/api/usuarios/`);
    return response.json();
  }

  async createUsuario(usuario) {
    const response = await fetch(`${this.baseURL}/api/usuarios/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    return response.json();
  }
}

const api = new API(API_BASE_URL);
```

## 🔗 URLs de Acceso

- **Producción (HTTPS)**: https://sub.labinfrafinal2025.cloud-ip.cc
- **ALB DNS**: frontend-alb-667731510.us-east-1.elb.amazonaws.com
- **Repositorio Git**: https://github.com/felipemarra15/frontend
- **Imagen ECR**: `757054385635.dkr.ecr.us-east-1.amazonaws.com/frontend:latest`

## 🎨 Capturas de Pantalla

### Página Principal
![Página Principal](docs/screenshots/index.png)

### Formulario de Registro
![Formulario](docs/screenshots/registrar.png)

### Lista de Usuarios
![Lista](docs/screenshots/listar.png)


