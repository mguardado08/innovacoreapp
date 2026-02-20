# Changelog

Registro de avances del nuevo software y pendientes de ejecucion.

## 2026-02-20

### Implementado

- Curvas de crecimiento:
  - calculo de IMC, Z-score y clasificacion automatica,
  - endpoint de curvas por paciente,
  - pantalla dedicada con grafica, tabla longitudinal y captura.
- Consultas:
  - filtros por paciente, estatus y rango de fechas,
  - endpoint de historial por paciente (`/api/v1/consultas/historial-paciente/`),
  - enriquecimiento de respuesta con detalle de examen fisico.
- Pacientes:
  - filtros avanzados (`q`, `sexo`, `activo`, `edad_min`, `edad_max`).
- Frontend transversal:
  - autosave de borradores en formularios CRUD,
  - recuperacion de borrador y limpieza manual.

### En progreso

- Fase 1:
  - consulta guiada por secciones clinicas,
  - integracion visual del historial de consultas previas dentro de la consulta actual.
- Fase 2:
  - cuadricula de vacunas y motor de recomendacion por edad.
- Fase 3:
  - curvas prematuro vs normal con reglas clinicas cerradas,
  - dashboard operativo (agenda del dia + indicadores).

### Pendiente

- Historial longitudinal de recetas orientado a seguimiento.
- Escala de desarrollo del nino con cumplimiento por edad.
- Impresion/PDF de consulta y formatos administrativos.
- Correos automaticos, recordatorios de cumpleanios y sincronizacion Gmail.

## Observaciones de calidad de requerimientos

### Ambiguo

- "Consultar..." no define modulo, actor ni resultado esperado.
- "Poner imagenes bonitas por todos lados" no es criterio funcional medible.
- "Correos automaticos" no especifica eventos, plantillas, frecuencia ni destinatarios.

### Repetido o solapado

- "Agenda en el inicio" y "Agenda en gmail" se solapan parcialmente; se separo en dashboard interno vs sincronizacion externa.
- "Ingresar examenes a pacientes" y "CONSULTA -> Examenes" apuntan al mismo flujo; se consolidaron como integracion de examenes dentro de consulta.
- "Consultas no guarda peso y talla" y "CONSULTA -> Datos fisicos" se consolidaron en un solo frente de mejora de captura/visualizacion.

## Proxima iteracion sugerida

1. Cerrar Fase 1 con pantalla de consulta guiada y panel de historial previo en la misma vista.
2. Iniciar Fase 2 con cuadricula de vacunas + estado por edad.
3. Definir criterios de impresion/PDF (Fase 4) con plantillas aprobadas por cliente.
