# Backend API (Django + DRF)

Este backend expone una API REST para el dominio clinico pediatrico.
Es la fuente unica de datos para frontend y pruebas funcionales.

## Tecnologias

- Django 4.2 + Django REST Framework.
- drf-spectacular para esquema OpenAPI y Swagger UI.

## Rutas base

- Base: `/api/v1/`
- Documentacion: `/api/docs/`
- Esquema OpenAPI: `/api/schema/`

## Recursos principales

CRUD completo via `ModelViewSet` en estas rutas:

- Pacientes: `/api/v1/pacientes/`
- Responsables: `/api/v1/pacientes/responsables/`
- Seguros: `/api/v1/pacientes/seguros/`
- Historia clinica: `/api/v1/pacientes/historias/`
- Consultas: `/api/v1/consultas/`
- Examen fisico: `/api/v1/consultas/examenes-fisicos/`
- Inmunizaciones: `/api/v1/inmunizaciones/`
- Vacunas: `/api/v1/inmunizaciones/vacunas/`
- Esquemas: `/api/v1/inmunizaciones/esquemas/`
- Examenes: `/api/v1/examenes/`
- Tipos de examen: `/api/v1/examenes/tipos/`
- Recetas: `/api/v1/recetas/`
- Detalles receta: `/api/v1/recetas/detalles/`
- Medicamentos: `/api/v1/recetas/medicamentos/`
- Crecimiento: `/api/v1/crecimiento/`
- Referencias crecimiento: `/api/v1/crecimiento/referencias/`
- Desarrollo: `/api/v1/desarrollo/`
- Hitos catalogo: `/api/v1/desarrollo/hitos/`

## Endpoints funcionales adicionales

- Historial de consultas por paciente:
  - `GET /api/v1/consultas/historial-paciente/?paciente=<id>`
- Datos de grafica de crecimiento:
  - `GET /api/v1/crecimiento/chart-data/?paciente=<id>&indicador=<IMC_EDAD|TALLA_EDAD|PESO_EDAD>`

## Filtros soportados actualmente

- Pacientes (`/api/v1/pacientes/`):
  - `q`, `sexo`, `activo`, `edad_min`, `edad_max`
- Consultas (`/api/v1/consultas/`):
  - `paciente`, `estatus`, `fecha_desde`, `fecha_hasta`
- Examenes fisicos (`/api/v1/consultas/examenes-fisicos/`):
  - `consulta`, `paciente`
- Crecimiento (`/api/v1/crecimiento/`):
  - `paciente`, `indicador`, `fecha_desde`, `fecha_hasta`
- Referencias crecimiento (`/api/v1/crecimiento/referencias/`):
  - `sexo`, `metrica`

## Convenciones de datos

- Todos los modelos clinicos heredan `ModeloBaseClinico`.
- Campos de tiempo: `creado_en`, `actualizado_en`.
- Borrado logico: `esta_borrado`, `borrado_en`, `borrado_por`.
- Relaciones se manejan por IDs (FK en payload).
- Fechas: `DateField` (AAAA-MM-DD). Fechas con hora: `DateTimeField`.

## Fixtures de prueba

Ubicacion:
- `backend/fixtures/catalogos_fixture.json`
- `backend/fixtures/pacientes_fixture.json`
- `backend/fixtures/consultas_fixture.json`
- `backend/fixtures/crecimiento_referencias_fixture.json`
- `backend/fixtures/crecimiento_mediciones_fixture.json`

Carga recomendada:

```bash
docker compose exec -T backend python manage.py loaddata fixtures/catalogos_fixture.json
docker compose exec -T backend python manage.py loaddata fixtures/pacientes_fixture.json
docker compose exec -T backend python manage.py loaddata fixtures/consultas_fixture.json
docker compose exec -T backend python manage.py loaddata fixtures/crecimiento_referencias_fixture.json
docker compose exec -T backend python manage.py loaddata fixtures/crecimiento_mediciones_fixture.json
```

## Autenticacion

Actualmente no hay autenticacion configurada. Si se agrega, el frontend
podra incorporar manejo de sesiones/tokens y permisos por rol.
