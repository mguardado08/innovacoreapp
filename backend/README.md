# Backend InnovacoreApp

Backend en Django + DRF para el sistema clinico pediatrico.

## Arquitectura

Monolito modular: un solo despliegue y una sola base de datos, con separacion clara por dominio.

Detalles:
- Apps separadas por dominio clinico (pacientes, consultas, inmunizaciones, examenes, recetas, crecimiento, desarrollo).
- `comun` centraliza modelos base y utilidades transversales (por ejemplo borrado logico y timestamps).
- API versionada bajo `/api/v1/`.
- Sin microservicios; crecimiento controlado por modularidad interna.

## Principios del dominio clinico

- Separacion estricta entre expediente clinico y consulta medica.
- Validaciones clinicas claras y explicitas.
- Sin sobreingenieria ni abstracciones innecesarias.
- Borrado logico estandar en todos los modelos (cuando se implemente en `comun`).

## Convenciones de nombres

- Modelos y campos en espanol, sin abreviaturas ambiguas.
- Campos de fechas: `fecha_*` (por ejemplo `fecha_nacimiento`).
- Identificadores clinicos consistentes (por ejemplo `perimetro_cefalico_cm`).

## Dominios y responsabilidades

- `pacientes`: expediente clinico, responsables y antecedentes.
- `consultas`: consulta medica, notas, examen fisico, signos vitales.
- `inmunizaciones`: esquema de vacunacion y aplicaciones.
- `examenes`: estudios asociados al paciente y, opcionalmente, a una consulta.
- `recetas`: prescripciones y medicamentos.
- `crecimiento`: mediciones y curvas de referencia.
- `desarrollo`: hitos del desarrollo infantil.
- `comun`: modelos base y utilidades compartidas.

## Borrado logico (estandar)

Todos los modelos clinicos deben heredar de un modelo base con:
- `esta_borrado` (bool)
- `borrado_en` (datetime)
- `borrado_por` (usuario, opcional)

La eliminacion debe ser logica, no fisica.

## API

Endpoints base (v1):
- `/api/v1/pacientes/`
- `/api/v1/consultas/`
- `/api/v1/inmunizaciones/`
- `/api/v1/examenes/`
- `/api/v1/recetas/`
- `/api/v1/crecimiento/`
- `/api/v1/desarrollo/`

## Base de datos

PostgreSQL en el host. La conexion se configura via `backend/.env`.

## Ejecucion

- Desarrollo: `runserver` dentro del contenedor.
- Produccion: Gunicorn via `docker-compose.prod.yml`.

## Estructura

```
backend/
├─ apps/
│  ├─ comun/
│  ├─ pacientes/
│  ├─ consultas/
│  ├─ inmunizaciones/
│  ├─ examenes/
│  ├─ recetas/
│  ├─ crecimiento/
│  └─ desarrollo/
├─ config/
├─ docs/
└─ manage.py
```

## Documentacion

- `backend/docs/ejecucion.md`

## Ejecucion rapida

Desarrollo:

```bash
docker compose up -d
```

Produccion (Gunicorn):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```
