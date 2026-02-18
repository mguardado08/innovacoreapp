# Modelo de dominio clinico (estado actual)

Este documento refleja el estado actual de los modelos implementados en `backend/apps`.
Sirve como referencia para el backend y para el diseno del frontend.

## Principios vigentes

- Expediente clinico (paciente + antecedentes) separado de consulta medica.
- Borrado logico estandar en todos los modelos clinicos.
- Validaciones clinicas simples en el modelo (sin sobreingenieria).
- Catalogos basicos para vacunas, examenes y medicamentos.
- Enfoque pediatrico: edad menor o igual a 18 anos.

## Apps del dominio

- `comun`: modelos base (tiempos y borrado logico).
- `pacientes`: expediente clinico.
- `consultas`: consulta medica y examen fisico.
- `inmunizaciones`: vacunas y aplicaciones.
- `examenes`: estudios de laboratorio/gabinete.
- `recetas`: recetas y medicamentos.
- `crecimiento`: mediciones y referencias.
- `desarrollo`: hitos del desarrollo.

## Modelos base (comun)

- `ModeloConTiempos`: `creado_en`, `actualizado_en`.
- `ModeloBorradoLogico`: `esta_borrado`, `borrado_en`, `borrado_por`.
- `ModeloBaseClinico`: hereda de los anteriores. Todos los modelos clinicos lo usan.

Nota: el manager por defecto filtra `esta_borrado=False`.

## Expediente clinico (pacientes)

### Paciente

Campos principales:
- Identidad: `nombres`, `apellidos`, `sexo`, `fecha_nacimiento`, `curp`, `tipo_sangre`.
- Perinatales: `semanas_gestacionales`, `peso_nacimiento_g`, `talla_nacimiento_cm`,
  `perimetro_cefalico_nacimiento_cm`, `tipo_parto`, `apgar_1`, `apgar_5`.
- Estado: `es_prematuro`, `activo`.

Validaciones en modelo:
- `fecha_nacimiento` no futura y edad <= 18.
- `semanas_gestacionales` en 22-44 si existe.
- `peso_nacimiento_g` y `talla_nacimiento_cm` > 0 si existen.

### ResponsablePaciente

- `paciente`, `nombre_completo`, `parentesco`, `telefono`, `correo`, `direccion`.
- `es_principal` (solo uno por paciente).

### SeguroPaciente

- `paciente`, `proveedor`, `numero_poliza`, `vigente_hasta`.

### HistoriaClinica

- `paciente`, `antecedentes_familiares`, `antecedentes_personales`,
  `antecedentes_perinatales`, `alergias`, `padecimientos_cronicos`.

## Consulta medica (consultas)

### Consulta

- `paciente`, `fecha_visita`.
- `motivo_consulta`, `subjetivo`, `evaluacion`, `plan`.
- `diagnostico_texto`, `diagnostico_codigos`.
- `estatus` (ABIERTA/CERRADA).

### ExamenFisico

Relacion 1:1 con `consulta`.

- Antropometria y signos vitales: `peso_kg`, `talla_cm`, `perimetro_cefalico_cm`,
  `temperatura_c`, `frecuencia_cardiaca_lpm`, `frecuencia_respiratoria_rpm`,
  `presion_sistolica`, `presion_diastolica`, `saturacion_oxigeno_pct`.
- `notas`.

Validaciones en modelo:
- `peso_kg` y `talla_cm` > 0 si existen.
- `temperatura_c` en 30-45 si existe.

## Inmunizaciones (inmunizaciones)

### Vacuna

- `nombre`, `fabricante`, `codigo`.

### EsquemaVacuna

- `vacuna`, `numero_dosis`, `edad_min_dias`, `edad_max_dias`.

### VacunacionPaciente

- `paciente`, `vacuna`, `numero_dosis`, `fecha_aplicacion`, `lote`, `sitio`, `notas`.
- `consulta` opcional.

## Examenes (examenes)

### TipoExamen

- `nombre`, `categoria` (LAB/GAB), `codigo`.

### ExamenPaciente

- `paciente`, `consulta` opcional, `tipo_examen`.
- `fecha_solicitud`, `fecha_resultado`, `resultado_texto`, `adjunto`.

## Recetas (recetas)

### Medicamento

- `nombre`, `forma`, `concentracion`.

### Receta

- `paciente`, `consulta` opcional, `fecha_prescripcion`, `notas`.

### DetalleReceta

- `receta`, `medicamento`, `dosis`, `frecuencia`, `duracion_dias`, `instrucciones`.

## Crecimiento (crecimiento)

### MedicionCrecimiento

- `paciente`, `consulta` opcional, `fecha_medicion`.
- `peso_kg`, `talla_cm`, `perimetro_cefalico_cm`.
- `edad_dias`, `edad_corregida_dias`, `tipo_edad` (CRONO/CORR).
- Percentiles: `percentil_peso`, `percentil_talla`, `percentil_imc`, `percentil_perimetro`.

### ReferenciaCrecimiento

- `sexo`, `edad_dias`, `metrica` (PESO/TALLA/PC), `l`, `m`, `s`.

## Desarrollo (desarrollo)

### Hito

- `nombre`, `edad_min_dias`, `edad_max_dias`, `dominio` (MOTOR/LENGUAJE/SOCIAL/COGNITIVO).

### HitoPaciente

- `paciente`, `hito`, `fecha_logro`, `notas`.

## Reglas de relacion

- Todo antecedente y expediente vive en `pacientes`.
- Todo evento clinico puntual vive en `consultas`.
- Modulos `examenes`, `inmunizaciones`, `recetas`, `crecimiento`, `desarrollo`
  se vinculan a `paciente` y opcionalmente a `consulta`.

## Endpoints actuales (v1)

- `/api/v1/pacientes/`
- `/api/v1/pacientes/responsables/`
- `/api/v1/pacientes/seguros/`
- `/api/v1/pacientes/historias/`
- `/api/v1/consultas/`
- `/api/v1/consultas/examenes-fisicos/`
- `/api/v1/inmunizaciones/`
- `/api/v1/inmunizaciones/vacunas/`
- `/api/v1/inmunizaciones/esquemas/`
- `/api/v1/examenes/`
- `/api/v1/examenes/tipos/`
- `/api/v1/recetas/`
- `/api/v1/recetas/detalles/`
- `/api/v1/recetas/medicamentos/`
- `/api/v1/crecimiento/`
- `/api/v1/crecimiento/referencias/`
- `/api/v1/desarrollo/`
- `/api/v1/desarrollo/hitos/`

## Siguiente paso recomendado

- Asegurar migraciones para todas las apps y versionarlas en el repo.
- Definir filtros/ordenamientos para el frontend (por paciente, fecha, estatus).
- Documentar flujos clinicos principales (alta paciente, consulta, receta).
