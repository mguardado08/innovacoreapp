# Frontend InnovacoreApp

Este frontend es una SPA en React + Vite con Material UI. Cubre los modulos
clinicos del backend y consume la API REST en /api/v1.

## Estructura

- `src/app`: rutas, tema, configuracion base.
- `src/components`: layout y componentes reutilizables.
- `src/features`: pantallas por modulo (pacientes, consultas, etc.).
- `src/services`: cliente API.
- `src/utils`: helpers y formatos.

## Desarrollo con Docker

1) Construir e iniciar el frontend:
   ```bash
   docker compose up -d frontend
   ```
2) Abrir en el navegador:
   - http://localhost:5173

## Variables de entorno

- `VITE_API_URL`: base de la API (ejemplo: http://localhost:8000/api/v1).

## Documentacion de diseno

- Ver `docs/componentes-frontend.md` para el plan y la estructura de pantallas.
