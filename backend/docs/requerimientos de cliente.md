# Requerimientos de cliente (estado de desarrollo)

Documento operativo para ejecutar las fases del producto clinico, incorporando lo ya implementado en curvas de crecimiento y dejando claro lo pendiente.

Convenciones de estado:
- `Implementado`
- `En progreso`
- `Pendiente`

## 1) Estado actual consolidado

### Base clinica y arquitectura
- `Implementado` Backend Django/DRF modular con APIs de pacientes, consultas, inmunizaciones, examenes, recetas, crecimiento y desarrollo.
- `Implementado` Frontend React + Vite + MUI dockerizado.
- `Implementado` CRUD funcional por modulo.

### Mejoras ya aplicadas en crecimiento
- `Implementado` Calculo de IMC, Z-score y clasificacion en `crecimiento`.
- `Implementado` Endpoint de curvas por paciente: `/api/v1/crecimiento/chart-data/`.
- `Implementado` Vista de crecimiento con formulario, tabla longitudinal y grafica con bandas Z.
- `Implementado` Integracion en ruta general `/crecimiento` y en detalle de paciente.

### Mejoras adicionales aplicadas en este ciclo
- `Implementado` Autosave de borradores en formularios CRUD del frontend (recuperacion local).
- `Implementado` Filtros avanzados de pacientes (q, sexo, activo, edad minima, edad maxima).
- `Implementado` Filtros de consultas por paciente, estatus y rango de fechas.
- `Implementado` Endpoint de historial de consultas por paciente: `/api/v1/consultas/historial-paciente/`.
- `Implementado` Consulta enriquecida con datos de examen fisico para mejorar visibilidad de detalle clinico.

## 2) Fases de trabajo propuestas (activas)

### Fase 1: Estabilidad clinica y correccion funcional

Objetivo:
- Evitar perdida de datos y mejorar consistencia de captura clinica.

Estado:
- `Implementado` Autosave y recuperacion de borrador en formularios CRUD.
- `Implementado` Mejoras de detalle de consulta (peso/talla desde examen fisico en listado).
- `En progreso` Vista de consulta en secciones clinicas guiadas (generales/fisicos/examenes).
- `En progreso` Consulta previa contextual dentro de captura actual (API lista, falta integrar UX completa).

Pendiente de fase:
- Integrar historial previo directamente en la pantalla de captura/edicion de consulta.
- Agregar validaciones clinicas UI/UX especificas en consulta (no solo validaciones base).

### Fase 2: Vacunas, examenes y seguimiento longitudinal

Objetivo:
- Mejorar seguimiento clinico continuo por paciente.

Estado:
- `En progreso` Flujo longitudinal parcialmente cubierto por crecimiento avanzado.
- `Pendiente` Cuadricula de vacunas con esquema por edad y fechas aplicadas.
- `Pendiente` Motor de recomendacion de vacunas por edad.
- `Pendiente` Flujo integrado de examenes dentro de consulta en un solo paso.
- `Pendiente` Historial longitudinal de recetas con enfoque clinico.

### Fase 3: Desarrollo, curvas y dashboard operativo

Objetivo:
- Entregar seguimiento pediatrico visual y gestion diaria.

Estado:
- `En progreso` Curvas de crecimiento (MVP implementado).
- `Pendiente` Curvas diferenciadas para prematuro vs desarrollo normal con reglas clinicas cerradas.
- `Pendiente` Escala de desarrollo del nino con semaforizacion por hitos.
- `Pendiente` Agenda en inicio con pacientes del dia.
- `Pendiente` Graficas e indicadores operativos del dashboard.

### Fase 4: Operacion y automatizacion

Objetivo:
- Cerrar ciclo operativo documental y automatizaciones.

Estado:
- `Pendiente` Impresion de consulta y formatos (seguro, constancia).
- `Pendiente` Correos automaticos (recordatorios/notificaciones).
- `Pendiente` Recordatorios de cumpleanios (incluye 15 anios).
- `Pendiente` Integracion con agenda de Gmail.

## 3) Pendiente de desarrollar (resumen ejecutivo)

Prioridad alta inmediata:
- Pantalla de consulta guiada por secciones.
- Panel de consultas previas dentro de consulta actual.
- Cuadricula/esquema de vacunacion por edad con semaforo de cumplimiento.

Prioridad media:
- Historial longitudinal de recetas.
- Escala de desarrollo con visual de cumplimiento por edad.
- Dashboard con agenda del dia.

Prioridad operativa:
- Impresion PDF de consulta y documentos.
- Automatizaciones por correo y recordatorios.
- Integracion Gmail Calendar.

## 4) Notas de alcance

- Fase 5 y pendientes de definicion detallada se gestionan fuera de este documento por decision actual del proyecto.
- Los temas empresariales/no clinicos (facturacion, migraciones masivas, frentes legales) quedan fuera del ciclo de implementacion activo.
