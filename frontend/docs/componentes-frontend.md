# Componentes del frontend (plan previo)

Este documento define la estructura y el alcance del frontend antes de crear el
proyecto React + Vite. Se basa en `docs/` y `README GENERAL.md`.

## Objetivo

Construir una SPA en React + Vite con Material UI que cubra los flujos clinicos
actuales del backend: expediente de paciente, consultas, examen fisico,
inmunizaciones, examenes, recetas, crecimiento y desarrollo.

## Alcance funcional

- Gestion de pacientes y expediente clinico.
- Consultas y examen fisico asociado.
- Registro de inmunizaciones y catalogos de vacunas/esquemas.
- Registro de examenes clinicos y catalogos de tipos de examen.
- Recetas, medicamentos y detalles de receta.
- Crecimiento (mediciones y referencias).
- Desarrollo (hitos y seguimiento).

## Estructura de pantallas

- Inicio / dashboard clinico.
- Pacientes
  - Listado de pacientes.
  - Alta/edicion de paciente.
  - Detalle de paciente con pestanas:
    - Historia clinica.
    - Responsables.
    - Seguros.
    - Consultas recientes.
    - Crecimiento.
    - Desarrollo.
    - Inmunizaciones.
    - Examenes.
    - Recetas.
- Consultas
  - Listado y filtros (por paciente, fecha, estatus).
  - Alta/edicion de consulta.
  - Examen fisico (1:1 con consulta).
- Inmunizaciones
  - Aplicaciones por paciente.
  - Catalogo de vacunas.
  - Esquemas por vacuna.
- Examenes
  - Examenes por paciente.
  - Catalogo de tipos de examen.
- Recetas
  - Recetas por paciente.
  - Medicamentos (catalogo).
  - Detalles por receta.
- Crecimiento
  - Mediciones por paciente.
  - Referencias (tabla base).
- Desarrollo
  - Hitos por paciente.
  - Catalogo de hitos.

## Componentes principales (MUI)

- Layout
  - AppShell (sidebar + topbar).
  - Breadcrumbs y titulo de vista.
- Navegacion
  - Sidebar con secciones clinicas.
  - Header con acciones globales.
- Listados
  - Tabla generica con filtros, paginacion y acciones.
  - SearchBar y filtros por fecha.
- Formularios
  - Formularios por modulo con validaciones basicas.
  - Dialogos para alta rapida.
- Detalles
  - Tarjetas de resumen por paciente.
  - Tabs para subrecursos.
- Feedback
  - Snackbar para operaciones.
  - Loading/Empty/Error states.

## Estructura tecnica (propuesta)

- `src/app`: rutas, layout, tema MUI.
- `src/features`: modulos por dominio (pacientes, consultas, etc.).
- `src/components`: componentes reutilizables.
- `src/services`: cliente API y endpoints.
- `src/hooks`: hooks comunes (useFetch, useDebounce).
- `src/utils`: helpers (formatos de fecha, validaciones).
- `src/types`: tipos de datos basados en API.

## Integracion API

- Base URL: `VITE_API_URL` con prefijo `/api/v1`.
- CRUD para todos los endpoints listados en `docs/readme.md`.
- Filtros por paciente y fecha donde aplique.
- Manejo de errores estandarizado.

## Datos y validaciones

- Fechas en formato `AAAA-MM-DD`.
- Campos numericos con rangos basicos (peso, talla, temperatura).
- Validaciones clinicas simples en cliente.

## Diseno

- UI limpia orientada a clinicas pediatras.
- Tablas densas para catalogos.
- Formularios agrupados por secciones.
- Uso de colores suaves y jerarquia tipografica clara.

## Entregables siguientes

1. Crear proyecto React + Vite dentro de `frontend/`.
2. Configurar MUI, router y estructura de carpetas.
3. Implementar layout y navegacion.
4. Implementar modulos por orden: pacientes -> consultas -> submodulos clinicos.
