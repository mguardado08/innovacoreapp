# InnovacoreApp

InnovacoreApp es la base para una plataforma modular compuesta por un backend en **Django**, un frontend en **React + Vite**, un proxy inverso con **NGINX** y una orquestación mediante **Docker Compose**. La base de datos se ejecutará en el host para simplificar el mantenimiento y permitir integraciones con herramientas externas.

## Arquitectura

- **Backend**: API REST en Django (posiblemente Django REST Framework) empaquetada en un contenedor. Se expone internamente y recibe el tráfico externo a través de NGINX.
- **Frontend**: SPA construida con React + Vite, publicada como artefacto estático servido por NGINX.
- **NGINX**: Proxy inverso / servidor estático que enruta `/api` hacia el backend y sirve el frontend en `/`. También maneja cabeceras de caché y compresión.
- **Docker Compose**: Define los servicios `frontend`, `backend` y `nginx`, además de las redes y volúmenes necesarios. El servicio de base de datos no está en contenedor; se asume que el host expone las credenciales vía variables de entorno o archivos `.env`.
- **Base de datos**: Servicio instalado en el host (por ejemplo PostgreSQL o MySQL). El backend se conecta a través de la red del host (`host.docker.internal` en macOS/Windows o la IP del host en Linux).

```
                   ┌───────────┐
          https →  │   NGINX   │  → static React build
                   └────┬──────┘
                        │/api
                        ▼
                   ┌───────────┐
                   │  Django   │  → conexión DB en host
                   └───────────┘
```

## Requisitos

- Docker y Docker Compose instalados.
- Python 3.12+ y Node.js 20+ (opcional si se trabaja fuera de contenedores).
- Acceso al motor de base de datos en el host (credenciales configuradas).

## Puesta en marcha local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/mguardado08/innovacoreapp.git
   cd innovacoreapp
   ```
2. Crear los archivos de entorno:
   - `backend/.env`: credenciales de Django, conexión a la base de datos del host, claves secretas.
   - `frontend/.env`: URLs del backend (`VITE_API_URL=https://dev.local/api`).
   - `nginx/nginx.conf`: reglas de proxy y headers (se proveerá un ejemplo por defecto).
3. Construir y levantar los contenedores:
   ```bash
   docker compose up --build
   ```
4. Acceder al sitio: `http://localhost` para el frontend y `http://localhost/api` para el backend (enrutado por NGINX).

## Flujo de desarrollo

- **Backend**: se recomienda usar `django-admin startproject` dentro de `backend/` y montar el código como volumen en `docker-compose.yml` para un ciclo de recarga rápida con `runserver`.
- **Frontend**: la carpeta `frontend/` contendrá el proyecto React + Vite. Durante desarrollo se puede ejecutar `npm run dev` (con `VITE_API_URL` apuntando al backend) o usar el contenedor.
- **Base de datos**: al residir en el host, la migraciones se ejecutan desde el contenedor backend usando `python manage.py migrate`. Se deben exponer las variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`.
- **NGINX**: el contenedor monta los artefactos del frontend y un archivo de configuración versionado. Ajustar el `server` block según dominios utilizados.

## Despliegue

1. Generar la compilación del frontend (`npm run build`) y almacenarla en un volumen compartido con NGINX.
2. Construir las imágenes versionadas (`docker compose build --no-cache`).
3. Ejecutar `docker compose -f docker-compose.prod.yml up -d` (archivo orientado a producción, con certificados TLS si aplica).
4. Configurar backups y monitoreo sobre la base de datos del host.

## Estructura sugerida

```
innovacoreapp/
├─ backend/
│  ├─ apps/…
│  ├─ manage.py
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  ├─ package.json
│  └─ vite.config.ts
├─ nginx/
│  └─ nginx.conf
├─ docker-compose.yml
└─ README.md
```

## Próximos pasos

1. Inicializar los proyectos de Django y React dentro de sus carpetas correspondientes.
2. Definir la configuración base de NGINX y Docker Compose.
3. Documentar variables de entorno específicas y scripts de desarrollo.
