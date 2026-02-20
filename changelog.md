# Changelog

Registro de avances funcionales y tecnicos del proyecto.

## 2026-02-20

### Implementado

- Curvas de crecimiento:
  - calculo IMC/Z-score/clasificacion,
  - endpoint de curvas por paciente,
  - grafica con bandas Z y serie de paciente,
  - filtros por indicador y por rango de fechas.
- Consultas:
  - filtros por paciente/estatus/fecha,
  - endpoint de historial por paciente,
  - respuesta con detalle de examen fisico.
- Pacientes:
  - filtros avanzados (`q`, `sexo`, `activo`, `edad_min`, `edad_max`).
- Frontend transversal:
  - autosave de borradores en formularios CRUD.
- Dashboard:
  - metricas reales desde API (sin valores hardcodeados).
- Fixtures:
  - catalogos,
  - pacientes (10 con expediente),
  - consultas + examen fisico (2 por paciente),
  - crecimiento referencias LMS,
  - crecimiento mediciones para 3 indicadores.

### En progreso

- Consulta guiada por secciones clinicas.
- Cuadricula de vacunacion y recomendacion por edad.
- Dashboard operativo con agenda del dia.

### Pendiente

- Historial longitudinal de recetas dedicado.
- Escala de desarrollo con semaforo de cumplimiento.
- Impresion/PDF clinico y formatos administrativos.
- Correos automaticos y sincronizacion Gmail.

## Observaciones de requerimientos

### Ambiguo

- "Consultar..." no define modulo, actor ni salida.
- "Poner imagenes bonitas" no es criterio funcional medible.
- "Correos automaticos" requiere definir eventos, destinatarios y frecuencia.

### Repetido o solapado

- Agenda en inicio vs agenda en Gmail: se divide en agenda interna y sincronizacion externa.
- Examenes en paciente vs examenes en consulta: se consolidara en un flujo integrado.

## Proxima iteracion sugerida

1. Cerrar Fase 1 con consulta guiada + historial previo embebido.
2. Cerrar Fase 2 con cuadricula de vacunas y estado por edad.
3. Definir plantillas oficiales para impresion/PDF de Fase 4.
