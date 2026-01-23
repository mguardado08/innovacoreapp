# Modelo de dominio clínico (pediatría) - propuesta inicial

Objetivo: definir el núcleo del dominio clínico pediátrico con separación clara entre expediente y consulta, evitando sobreingeniería. Este documento sirve como base para crear aplicaciones y modelos de Django.

## Principios

- Expediente clínico (paciente + antecedentes) separado de consulta médica.
- Borrado lógico estándar en todos los modelos.
- Validaciones clínicas claras y simples (sin abstracciones innecesarias).
- Catálogos clínicos básicos para vacunas, exámenes y medicamentos.

## Aplicaciones sugeridas (por dominio)

- `pacientes`: datos del paciente, responsables y expediente.
- `consultas`: consultas médicas, notas, exámenes físicos y signos vitales.
- `inmunizaciones`: vacunas aplicadas y esquema por edad.
- `examenes`: estudios de laboratorio o gabinete.
- `recetas`: recetas y medicamentos.
- `crecimiento`: crecimiento (mediciones y referencias).
- `desarrollo`: hitos del desarrollo.
- `comun`: modelos base (borrado lógico, marcas de tiempo) y utilidades clínicas.

## Modelos base (comun)

- `ModeloConTiempos`: `creado_en`, `actualizado_en`.
- `ModeloBorradoLogico`: `esta_borrado`, `borrado_en`, `borrado_por` (opcional).
- `ModeloBaseClinico`: hereda de los anteriores para todos los modelos clínicos.

## Expediente clínico (pacientes)

### Paciente

- Datos personales: `nombres`, `apellidos`, `sexo`, `fecha_nacimiento`, `curp` (opcional), `tipo_sangre` (opcional).
- Datos perinatales: `semanas_gestacionales`, `peso_nacimiento_g`, `talla_nacimiento_cm`, `perimetro_cefalico_nacimiento_cm`, `tipo_parto` (vaginal/cesarea), `apgar_1`, `apgar_5`.
- Datos clínicos básicos: `es_prematuro` (derivable si < 37 semanas, pero se puede persistir).
- Estado: `activo` (para bloqueo administrativo, distinto de borrado lógico).

Validaciones clínicas sugeridas:
- `fecha_nacimiento` no puede ser futura.
- `semanas_gestacionales` en rango 22-44 (o nulo si desconocido).
- `peso_nacimiento_g` > 0, `talla_nacimiento_cm` > 0 si se captura.

### ResponsablePaciente

- Relación con paciente: `paciente`.
- Datos del responsable: `nombre_completo`, `parentesco` (madre/padre/tutor), `telefono`, `correo`, `direccion`.
- `es_principal` para marcar contacto principal.

### SeguroPaciente (opcional)

- `paciente`, `proveedor`, `numero_poliza`, `vigente_hasta`.

### HistoriaClinica

- `paciente`.
- Antecedentes estructurados: `antecedentes_familiares`, `antecedentes_personales`, `antecedentes_perinatales`, `alergias`, `padecimientos_cronicos`.
- Mantenerlo simple al inicio; se puede normalizar después si hace falta.

## Consulta médica (consultas)

### Consulta

- `paciente`.
- `fecha_visita`, `motivo_consulta`, `subjetivo`, `evaluacion`, `plan`.
- `diagnostico_texto` (texto libre) y `diagnostico_codigos` (futuro, si se integra CIE-10).
- `estatus` (abierta/cerrada) para control de flujo.

### ExamenFisico

- Relación 1:1 con `consulta`.
- Signos vitales y antropometría:
  - `peso_kg`, `talla_cm`, `perimetro_cefalico_cm`, `temperatura_c`, `frecuencia_cardiaca_lpm`, `frecuencia_respiratoria_rpm`, `presion_sistolica`, `presion_diastolica`, `saturacion_oxigeno_pct`.
- `notas` para hallazgos clínicos.

Validaciones clínicas sugeridas:
- `peso_kg` > 0, `talla_cm` > 0 cuando se registra.
- `temperatura_c` en 30-45 si se captura.

## Exámenes (examenes)

### TipoExamen

- Catálogo: `nombre`, `categoria` (laboratorio/gabinete), `codigo` (interno opcional).

### ExamenPaciente

- `paciente` (obligatorio).
- `consulta` (opcional; si aplica a la consulta actual).
- `tipo_examen`, `fecha_solicitud`, `fecha_resultado`, `resultado_texto`, `adjunto` (archivo).

## Vacunación (inmunizaciones)

### Vacuna

- Catálogo: `nombre`, `fabricante` (opcional), `codigo` (interno).

### EsquemaVacuna

- Define esquema por edad:
  - `vacuna`, `numero_dosis`, `edad_min_dias`, `edad_max_dias`.

### VacunacionPaciente

- `paciente`, `vacuna`, `numero_dosis`.
- `fecha_aplicacion`, `lote`, `sitio`, `notas`.
- `consulta` (opcional).

## Recetas (recetas)

### Medicamento

- Catálogo: `nombre`, `forma` (jarabe/tableta/etc), `concentracion`.

### Receta

- `paciente`, `consulta`, `fecha_prescripcion`.
- `notas`.

### DetalleReceta

- `receta`, `medicamento`.
- `dosis`, `frecuencia`, `duracion_dias`, `instrucciones`.

## Crecimiento (crecimiento)

### MedicionCrecimiento

- `paciente`, `consulta` (opcional), `fecha_medicion`.
- `peso_kg`, `talla_cm`, `perimetro_cefalico_cm`.
- `edad_dias` (cronológica), `edad_corregida_dias` (si prematuro).
- `tipo_edad` (cronológica/corregida) para gráficas.

### ReferenciaCrecimiento (opcional, para curvas)

- Catálogo para cargar tablas de referencia (OMS/CDC):
  - `sexo`, `edad_dias`, `metrica` (peso/talla/perimetro_cefalico), `l`, `m`, `s`.
- Puede poblarse por importación.

## Desarrollo infantil (desarrollo)

### Hito

- Catálogo: `nombre`, `edad_min_dias`, `edad_max_dias`, `dominio` (motor/lenguaje/social).

### HitoPaciente

- `paciente`, `hito`, `fecha_logro`, `notas`.

## Reglas de separación expediente vs consulta

- Todo antecedente y datos base vive en `pacientes`.
- Todo evento puntual y clínico va en `consultas` y sus submódulos.
- Los módulos `examenes`, `inmunizaciones`, `recetas`, `crecimiento`, `desarrollo` se vinculan a `paciente` y opcionalmente a `consulta`.

## Endpoints sugeridos (v1, nivel alto)

- `/api/v1/pacientes/`
- `/api/v1/consultas/`
- `/api/v1/examenes/`
- `/api/v1/inmunizaciones/`
- `/api/v1/recetas/`
- `/api/v1/crecimiento/`
- `/api/v1/desarrollo/`

## Siguiente paso recomendado

- Confirmar el alcance del MVP (qué módulos entran primero).
- Definir los modelos Django iniciales y migraciones para `pacientes` y `consultas`.
- Agregar borrado lógico estándar en `comun` y aplicar a todos los modelos.
