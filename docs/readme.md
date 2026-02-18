# Backend API (Django + DRF)

Este backend expone una API REST para el dominio clinico pediatrico. Esta pensada
como base del frontend y como fuente unica de datos.

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
- Responsables: `/api/v1/pacientes/responsables/`
- Seguros: `/api/v1/pacientes/seguros/`
- Historia clinica: `/api/v1/pacientes/historias/`

## Convenciones de datos

- Todos los modelos clinicos heredan `ModeloBaseClinico`.
- Campos de tiempo: `creado_en`, `actualizado_en`.
- Borrado logico: `esta_borrado`, `borrado_en`, `borrado_por`.
- Relaciones se manejan por IDs (FK en payload).
- Fechas: `DateField` (AAAA-MM-DD). Fechas con hora: `DateTimeField`.

## Flujo sugerido para el frontend

1) Alta de paciente en `/api/v1/pacientes/`.
2) Crear consulta en `/api/v1/consultas/` apuntando al paciente.
3) Registrar examen fisico en `/api/v1/consultas/examenes-fisicos/`.
4) Asociar vacunas, examenes o recetas vinculadas a la consulta.
5) Registrar mediciones de crecimiento y/o hitos de desarrollo.

## Autenticacion

Actualmente no hay autenticacion configurada. Si se agrega, la capa de frontend
podra incorporar manejo de sesiones/tokens y permisos por rol.

## Notas para el frontend

- El backend no expone endpoints anidados por paciente; el filtrado por paciente
  se debe implementar con filtros o consultas del lado del backend.
- Para explorar el esquema y los campos exactos, usar `/api/docs/`.
