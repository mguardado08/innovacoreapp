# Requerimientos de cliente (estado de desarrollo)

Documento operativo de seguimiento por fases, actualizado con el estado real del sistema.

Convenciones:
- `Implementado`
- `En progreso`
- `Pendiente`

## 1) Estado consolidado actual

### Base clinica
- `Implementado` Modulos: pacientes, consultas, inmunizaciones, examenes, recetas, crecimiento, desarrollo.
- `Implementado` CRUD por modulo en API y frontend.
- `Implementado` Filtros avanzados en pacientes y consultas.

### Crecimiento
- `Implementado` Calculo IMC, Z-score y clasificacion.
- `Implementado` Curvas con bandas Z, serie paciente, tooltip, ejes y leyenda.
- `Implementado` Filtros por indicador y rango de fecha en API/UI.
- `Implementado` Fixtures con cobertura de 10 pacientes y 3 indicadores.

### Estabilidad de captura
- `Implementado` Autosave y recuperacion de borrador en formularios CRUD.
- `Implementado` Consulta enriquecida con detalle de examen fisico en listado.
- `Implementado` Historial de consultas por paciente via endpoint dedicado.

## 2) Fases activas

### Fase 1: Estabilidad clinica y correccion funcional

Estado:
- `Implementado` Autosave/recovery de formularios.
- `Implementado` Mejoras de detalle en consulta (peso/talla visibles).
- `En progreso` Vista guiada de consulta por secciones.
- `En progreso` Integracion embebida de consultas previas dentro de captura.

Pendiente de fase:
- UI de consulta por secciones (generales/fisicos/examenes) en una sola experiencia.
- Validaciones clinicas UI/UX especificas de captura.

### Fase 2: Vacunas, examenes y seguimiento longitudinal

Estado:
- `En progreso` Base de seguimiento longitudinal consolidada.
- `Pendiente` Cuadricula de vacunas por edad y cumplimiento.
- `Pendiente` Motor de recomendacion de vacunas por edad.
- `Pendiente` Flujo de examenes integrado dentro de consulta.
- `Pendiente` Historial longitudinal de recetas dedicado.

### Fase 3: Desarrollo, curvas y dashboard operativo

Estado:
- `En progreso` Curvas de crecimiento operativas (MVP+).
- `Pendiente` Curvas prematuro vs normal con reglas clinicas completas.
- `Pendiente` Escala de desarrollo con semaforizacion.
- `Pendiente` Agenda del dia e indicadores en dashboard.

### Fase 4: Operacion y automatizacion

Estado:
- `Pendiente` Impresion de consulta y formatos administrativos.
- `Pendiente` Correos automaticos.
- `Pendiente` Recordatorios de cumpleanios.
- `Pendiente` Integracion con agenda Gmail.

## 3) Pendiente de desarrollar (resumen ejecutivo)

Prioridad alta:
- Consulta guiada por secciones.
- Panel de consultas previas dentro de consulta actual.
- Cuadricula/esquema de vacunacion por edad.

Prioridad media:
- Historial longitudinal de recetas.
- Escala de desarrollo con cumplimiento por edad.
- Dashboard con agenda del dia.

Prioridad operativa:
- PDF/impresion de consulta y documentos.
- Automatizaciones por correo y recordatorios.
- Integracion Gmail Calendar.

## 4) Notas de alcance

- Fase 5 y frentes no clinicos se gestionan fuera del ciclo activo.
