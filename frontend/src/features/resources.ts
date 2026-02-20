import { ResourceConfig } from '../types/resources';
import { formatDate, formatDateTime } from '../utils/format';

const pacienteLookup = {
  endpoint: '/pacientes/',
  labelFn: (item: Record<string, unknown>) =>
    `${item.apellidos ?? ''} ${item.nombres ?? ''}`.trim()
};

const consultaLookup = {
  endpoint: '/consultas/',
  labelFn: (item: Record<string, unknown>) => {
    const fecha = item.fecha_visita ? formatDateTime(String(item.fecha_visita)) : 'Sin fecha';
    return `Consulta ${item.id ?? ''} - ${fecha}`;
  }
};

export const resources: Record<string, ResourceConfig> = {
  pacientes: {
    key: 'pacientes',
    label: 'Paciente',
    endpoint: '/pacientes/',
    description: 'Expediente clinico del paciente pediatrico.',
    columns: [
      { field: 'apellidos', header: 'Apellidos' },
      { field: 'nombres', header: 'Nombres' },
      { field: 'sexo', header: 'Sexo' },
      { field: 'fecha_nacimiento', header: 'Nacimiento', format: (value) => formatDate(String(value)) },
      { field: 'activo', header: 'Activo' }
    ],
    rowLink: (row) => (row.id ? `/pacientes/${row.id}` : undefined),
    filters: [
      { name: 'q', label: 'Nombre/CURP', type: 'text' },
      {
        name: 'sexo',
        label: 'Sexo',
        type: 'select',
        options: [
          { label: 'Masculino', value: 'M' },
          { label: 'Femenino', value: 'F' },
          { label: 'Otro', value: 'X' }
        ]
      },
      {
        name: 'activo',
        label: 'Estado',
        type: 'select',
        options: [
          { label: 'Activos', value: 'true' },
          { label: 'Inactivos', value: 'false' }
        ]
      },
      { name: 'edad_min', label: 'Edad minima', type: 'number' },
      { name: 'edad_max', label: 'Edad maxima', type: 'number' }
    ],
    fields: [
      { name: 'nombres', label: 'Nombres', type: 'text', required: true },
      { name: 'apellidos', label: 'Apellidos', type: 'text', required: true },
      {
        name: 'sexo',
        label: 'Sexo',
        type: 'select',
        options: [
          { label: 'Masculino', value: 'M' },
          { label: 'Femenino', value: 'F' },
          { label: 'Otro/No especificado', value: 'X' }
        ]
      },
      { name: 'fecha_nacimiento', label: 'Fecha de nacimiento', type: 'date' },
      { name: 'curp', label: 'CURP', type: 'text' },
      { name: 'tipo_sangre', label: 'Tipo de sangre', type: 'text' },
      { name: 'semanas_gestacionales', label: 'Semanas gestacionales', type: 'number' },
      { name: 'peso_nacimiento_g', label: 'Peso nacimiento (g)', type: 'number' },
      { name: 'talla_nacimiento_cm', label: 'Talla nacimiento (cm)', type: 'number' },
      {
        name: 'perimetro_cefalico_nacimiento_cm',
        label: 'Perimetro cefalico nacimiento (cm)',
        type: 'number'
      },
      {
        name: 'tipo_parto',
        label: 'Tipo de parto',
        type: 'select',
        options: [
          { label: 'Vaginal', value: 'VAGINAL' },
          { label: 'Cesarea', value: 'CESAREA' }
        ]
      },
      { name: 'apgar_1', label: 'APGAR 1', type: 'number' },
      { name: 'apgar_5', label: 'APGAR 5', type: 'number' },
      { name: 'es_prematuro', label: 'Prematuro', type: 'boolean' },
      { name: 'activo', label: 'Activo', type: 'boolean' }
    ]
  },
  responsables: {
    key: 'responsables',
    label: 'Responsable',
    endpoint: '/pacientes/responsables/',
    description: 'Responsables asociados a cada paciente.',
    columns: [
      { field: 'paciente', header: 'Paciente' },
      { field: 'nombre_completo', header: 'Nombre' },
      { field: 'parentesco', header: 'Parentesco' },
      { field: 'telefono', header: 'Telefono' }
    ],
    filters: [
      { name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup },
      { name: 'parentesco', label: 'Parentesco', type: 'select', options: [
        { label: 'Madre', value: 'MADRE' },
        { label: 'Padre', value: 'PADRE' },
        { label: 'Tutor', value: 'TUTOR' },
        { label: 'Otro', value: 'OTRO' }
      ] }
    ],
    fields: [
      { name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup },
      { name: 'nombre_completo', label: 'Nombre completo', type: 'text' },
      {
        name: 'parentesco',
        label: 'Parentesco',
        type: 'select',
        options: [
          { label: 'Madre', value: 'MADRE' },
          { label: 'Padre', value: 'PADRE' },
          { label: 'Tutor', value: 'TUTOR' },
          { label: 'Otro', value: 'OTRO' }
        ]
      },
      { name: 'telefono', label: 'Telefono', type: 'text' },
      { name: 'correo', label: 'Correo', type: 'text' },
      { name: 'direccion', label: 'Direccion', type: 'textarea' },
      { name: 'es_principal', label: 'Es principal', type: 'boolean' }
    ]
  },
  seguros: {
    key: 'seguros',
    label: 'Seguro',
    endpoint: '/pacientes/seguros/',
    description: 'Seguro medico asociado a pacientes.',
    columns: [
      { field: 'paciente', header: 'Paciente' },
      { field: 'proveedor', header: 'Proveedor' },
      { field: 'numero_poliza', header: 'Poliza' },
      { field: 'vigente_hasta', header: 'Vigente hasta', format: (value) => formatDate(String(value)) }
    ],
    filters: [{ name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup }],
    fields: [
      { name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup },
      { name: 'proveedor', label: 'Proveedor', type: 'text' },
      { name: 'numero_poliza', label: 'Numero de poliza', type: 'text' },
      { name: 'vigente_hasta', label: 'Vigente hasta', type: 'date' }
    ]
  },
  historias: {
    key: 'historias',
    label: 'Historia clinica',
    endpoint: '/pacientes/historias/',
    description: 'Antecedentes clinicos del paciente.',
    columns: [
      { field: 'paciente', header: 'Paciente' },
      { field: 'antecedentes_familiares', header: 'Familiares' },
      { field: 'alergias', header: 'Alergias' }
    ],
    filters: [{ name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup }],
    fields: [
      { name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup },
      { name: 'antecedentes_familiares', label: 'Antecedentes familiares', type: 'textarea' },
      { name: 'antecedentes_personales', label: 'Antecedentes personales', type: 'textarea' },
      { name: 'antecedentes_perinatales', label: 'Antecedentes perinatales', type: 'textarea' },
      { name: 'alergias', label: 'Alergias', type: 'textarea' },
      { name: 'padecimientos_cronicos', label: 'Padecimientos cronicos', type: 'textarea' }
    ]
  },
  consultas: {
    key: 'consultas',
    label: 'Consulta',
    endpoint: '/consultas/',
    description: 'Consultas medicas registradas.',
    columns: [
      {
        field: 'paciente_nombre',
        header: 'Paciente',
        format: (value, row) => String(value ?? row.paciente ?? '-')
      },
      { field: 'fecha_visita', header: 'Fecha', format: (value) => formatDateTime(String(value)) },
      { field: 'estatus', header: 'Estatus' },
      {
        field: 'peso_kg',
        header: 'Peso (kg)',
        format: (_value, row) =>
          String((row.examen_fisico_detalle as Record<string, unknown> | null)?.peso_kg ?? '-')
      },
      {
        field: 'talla_cm',
        header: 'Talla (cm)',
        format: (_value, row) =>
          String((row.examen_fisico_detalle as Record<string, unknown> | null)?.talla_cm ?? '-')
      },
      { field: 'diagnostico_texto', header: 'Diagnostico' }
    ],
    filters: [
      { name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup },
      {
        name: 'estatus',
        label: 'Estatus',
        type: 'select',
        options: [
          { label: 'Abierta', value: 'ABIERTA' },
          { label: 'Cerrada', value: 'CERRADA' }
        ]
      },
      { name: 'fecha_desde', label: 'Fecha desde', type: 'date' },
      { name: 'fecha_hasta', label: 'Fecha hasta', type: 'date' }
    ],
    fields: [
      { name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup },
      { name: 'fecha_visita', label: 'Fecha visita', type: 'datetime' },
      { name: 'motivo_consulta', label: 'Motivo consulta', type: 'textarea' },
      { name: 'subjetivo', label: 'Subjetivo', type: 'textarea' },
      { name: 'evaluacion', label: 'Evaluacion', type: 'textarea' },
      { name: 'plan', label: 'Plan', type: 'textarea' },
      { name: 'diagnostico_texto', label: 'Diagnostico texto', type: 'textarea' },
      { name: 'diagnostico_codigos', label: 'Codigos diagnostico', type: 'text' },
      {
        name: 'estatus',
        label: 'Estatus',
        type: 'select',
        options: [
          { label: 'Abierta', value: 'ABIERTA' },
          { label: 'Cerrada', value: 'CERRADA' }
        ]
      }
    ]
  },
  examenesFisicos: {
    key: 'examenesFisicos',
    label: 'Examen fisico',
    endpoint: '/consultas/examenes-fisicos/',
    description: 'Signos vitales y antropometria por consulta.',
    columns: [
      { field: 'consulta', header: 'Consulta' },
      { field: 'peso_kg', header: 'Peso (kg)' },
      { field: 'talla_cm', header: 'Talla (cm)' },
      { field: 'temperatura_c', header: 'Temperatura' }
    ],
    filters: [{ name: 'consulta', label: 'Consulta', type: 'select', lookup: consultaLookup }],
    fields: [
      { name: 'consulta', label: 'Consulta', type: 'select', lookup: consultaLookup },
      { name: 'peso_kg', label: 'Peso (kg)', type: 'number' },
      { name: 'talla_cm', label: 'Talla (cm)', type: 'number' },
      { name: 'perimetro_cefalico_cm', label: 'Perimetro cefalico (cm)', type: 'number' },
      { name: 'temperatura_c', label: 'Temperatura (C)', type: 'number' },
      { name: 'frecuencia_cardiaca_lpm', label: 'Frecuencia cardiaca', type: 'number' },
      { name: 'frecuencia_respiratoria_rpm', label: 'Frecuencia respiratoria', type: 'number' },
      { name: 'presion_sistolica', label: 'Presion sistolica', type: 'number' },
      { name: 'presion_diastolica', label: 'Presion diastolica', type: 'number' },
      { name: 'saturacion_oxigeno_pct', label: 'Saturacion O2 (%)', type: 'number' },
      { name: 'notas', label: 'Notas', type: 'textarea' }
    ]
  },
  inmunizaciones: {
    key: 'inmunizaciones',
    label: 'Aplicacion vacuna',
    endpoint: '/inmunizaciones/',
    description: 'Registro de vacunas aplicadas.',
    columns: [
      { field: 'paciente', header: 'Paciente' },
      { field: 'vacuna', header: 'Vacuna' },
      { field: 'numero_dosis', header: 'Dosis' },
      { field: 'fecha_aplicacion', header: 'Fecha', format: (value) => formatDate(String(value)) }
    ],
    filters: [{ name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup }],
    fields: [
      { name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup },
      { name: 'vacuna', label: 'Vacuna', type: 'select', lookup: { endpoint: '/inmunizaciones/vacunas/' } },
      { name: 'numero_dosis', label: 'Numero dosis', type: 'number' },
      { name: 'fecha_aplicacion', label: 'Fecha aplicacion', type: 'date' },
      { name: 'lote', label: 'Lote', type: 'text' },
      { name: 'sitio', label: 'Sitio', type: 'text' },
      { name: 'notas', label: 'Notas', type: 'textarea' },
      { name: 'consulta', label: 'Consulta', type: 'select', lookup: consultaLookup }
    ]
  },
  vacunas: {
    key: 'vacunas',
    label: 'Vacuna',
    endpoint: '/inmunizaciones/vacunas/',
    description: 'Catalogo de vacunas.',
    columns: [
      { field: 'nombre', header: 'Nombre' },
      { field: 'fabricante', header: 'Fabricante' },
      { field: 'codigo', header: 'Codigo' }
    ],
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text' },
      { name: 'fabricante', label: 'Fabricante', type: 'text' },
      { name: 'codigo', label: 'Codigo', type: 'text' }
    ]
  },
  esquemasVacuna: {
    key: 'esquemasVacuna',
    label: 'Esquema vacuna',
    endpoint: '/inmunizaciones/esquemas/',
    description: 'Esquemas y dosis sugeridas por vacuna.',
    columns: [
      { field: 'vacuna', header: 'Vacuna' },
      { field: 'numero_dosis', header: 'Dosis' },
      { field: 'edad_min_dias', header: 'Edad min (dias)' },
      { field: 'edad_max_dias', header: 'Edad max (dias)' }
    ],
    fields: [
      { name: 'vacuna', label: 'Vacuna', type: 'select', lookup: { endpoint: '/inmunizaciones/vacunas/' } },
      { name: 'numero_dosis', label: 'Numero dosis', type: 'number' },
      { name: 'edad_min_dias', label: 'Edad min (dias)', type: 'number' },
      { name: 'edad_max_dias', label: 'Edad max (dias)', type: 'number' }
    ]
  },
  examenes: {
    key: 'examenes',
    label: 'Examen',
    endpoint: '/examenes/',
    description: 'Examenes clinicos por paciente.',
    columns: [
      { field: 'paciente', header: 'Paciente' },
      { field: 'tipo_examen', header: 'Tipo' },
      { field: 'fecha_solicitud', header: 'Solicitud', format: (value) => formatDate(String(value)) },
      { field: 'fecha_resultado', header: 'Resultado', format: (value) => formatDate(String(value)) }
    ],
    fields: [
      { name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup },
      { name: 'consulta', label: 'Consulta', type: 'select', lookup: consultaLookup },
      { name: 'tipo_examen', label: 'Tipo examen', type: 'select', lookup: { endpoint: '/examenes/tipos/' } },
      { name: 'fecha_solicitud', label: 'Fecha solicitud', type: 'date' },
      { name: 'fecha_resultado', label: 'Fecha resultado', type: 'date' },
      { name: 'resultado_texto', label: 'Resultado', type: 'textarea' },
      { name: 'adjunto', label: 'Adjunto', type: 'file' }
    ]
  },
  tiposExamen: {
    key: 'tiposExamen',
    label: 'Tipo examen',
    endpoint: '/examenes/tipos/',
    description: 'Catalogo de tipos de examen.',
    columns: [
      { field: 'nombre', header: 'Nombre' },
      { field: 'categoria', header: 'Categoria' },
      { field: 'codigo', header: 'Codigo' }
    ],
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text' },
      {
        name: 'categoria',
        label: 'Categoria',
        type: 'select',
        options: [
          { label: 'Laboratorio', value: 'LAB' },
          { label: 'Gabinete', value: 'GAB' }
        ]
      },
      { name: 'codigo', label: 'Codigo', type: 'text' }
    ]
  },
  recetas: {
    key: 'recetas',
    label: 'Receta',
    endpoint: '/recetas/',
    description: 'Recetas medicas registradas.',
    columns: [
      { field: 'paciente', header: 'Paciente' },
      { field: 'consulta', header: 'Consulta' },
      { field: 'fecha_prescripcion', header: 'Fecha', format: (value) => formatDateTime(String(value)) }
    ],
    fields: [
      { name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup },
      { name: 'consulta', label: 'Consulta', type: 'select', lookup: consultaLookup },
      { name: 'fecha_prescripcion', label: 'Fecha prescripcion', type: 'datetime' },
      { name: 'notas', label: 'Notas', type: 'textarea' }
    ]
  },
  detallesReceta: {
    key: 'detallesReceta',
    label: 'Detalle receta',
    endpoint: '/recetas/detalles/',
    description: 'Detalle de medicamentos por receta.',
    columns: [
      { field: 'receta', header: 'Receta' },
      { field: 'medicamento', header: 'Medicamento' },
      { field: 'dosis', header: 'Dosis' },
      { field: 'frecuencia', header: 'Frecuencia' }
    ],
    fields: [
      { name: 'receta', label: 'Receta', type: 'select', lookup: { endpoint: '/recetas/' } },
      {
        name: 'medicamento',
        label: 'Medicamento',
        type: 'select',
        lookup: { endpoint: '/recetas/medicamentos/' }
      },
      { name: 'dosis', label: 'Dosis', type: 'text' },
      { name: 'frecuencia', label: 'Frecuencia', type: 'text' },
      { name: 'duracion_dias', label: 'Duracion (dias)', type: 'number' },
      { name: 'instrucciones', label: 'Instrucciones', type: 'textarea' }
    ]
  },
  medicamentos: {
    key: 'medicamentos',
    label: 'Medicamento',
    endpoint: '/recetas/medicamentos/',
    description: 'Catalogo de medicamentos.',
    columns: [
      { field: 'nombre', header: 'Nombre' },
      { field: 'forma', header: 'Forma' },
      { field: 'concentracion', header: 'Concentracion' }
    ],
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text' },
      { name: 'forma', label: 'Forma', type: 'text' },
      { name: 'concentracion', label: 'Concentracion', type: 'text' }
    ]
  },
  crecimiento: {
    key: 'crecimiento',
    label: 'Medicion crecimiento',
    endpoint: '/crecimiento/',
    description: 'Mediciones antropometricas por paciente.',
    columns: [
      { field: 'paciente', header: 'Paciente' },
      { field: 'fecha_medicion', header: 'Fecha', format: (value) => formatDate(String(value)) },
      { field: 'peso_kg', header: 'Peso' },
      { field: 'talla_cm', header: 'Talla' }
    ],
    fields: [
      { name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup },
      { name: 'consulta', label: 'Consulta', type: 'select', lookup: consultaLookup },
      { name: 'fecha_medicion', label: 'Fecha medicion', type: 'date' },
      { name: 'peso_kg', label: 'Peso (kg)', type: 'number' },
      { name: 'talla_cm', label: 'Talla (cm)', type: 'number' },
      { name: 'perimetro_cefalico_cm', label: 'Perimetro cefalico (cm)', type: 'number' },
      { name: 'edad_dias', label: 'Edad (dias)', type: 'number' },
      { name: 'edad_corregida_dias', label: 'Edad corregida (dias)', type: 'number' },
      {
        name: 'tipo_edad',
        label: 'Tipo edad',
        type: 'select',
        options: [
          { label: 'Cronologica', value: 'CRONO' },
          { label: 'Corregida', value: 'CORR' }
        ]
      },
      { name: 'percentil_peso', label: 'Percentil peso', type: 'number' },
      { name: 'percentil_talla', label: 'Percentil talla', type: 'number' },
      { name: 'percentil_imc', label: 'Percentil IMC', type: 'number' },
      { name: 'percentil_perimetro', label: 'Percentil perimetro', type: 'number' }
    ]
  },
  referenciasCrecimiento: {
    key: 'referenciasCrecimiento',
    label: 'Referencia crecimiento',
    endpoint: '/crecimiento/referencias/',
    description: 'Tabla base de referencias por edad y sexo.',
    columns: [
      { field: 'sexo', header: 'Sexo' },
      { field: 'edad_dias', header: 'Edad (dias)' },
      { field: 'metrica', header: 'Metrica' },
      { field: 'm', header: 'M' }
    ],
    fields: [
      {
        name: 'sexo',
        label: 'Sexo',
        type: 'select',
        options: [
          { label: 'Masculino', value: 'M' },
          { label: 'Femenino', value: 'F' },
          { label: 'Otro', value: 'X' }
        ]
      },
      { name: 'edad_dias', label: 'Edad (dias)', type: 'number' },
      {
        name: 'metrica',
        label: 'Metrica',
        type: 'select',
        options: [
          { label: 'Peso', value: 'PESO' },
          { label: 'Talla', value: 'TALLA' },
          { label: 'Perimetro', value: 'PC' }
        ]
      },
      { name: 'l', label: 'L', type: 'number' },
      { name: 'm', label: 'M', type: 'number' },
      { name: 's', label: 'S', type: 'number' }
    ]
  },
  desarrollo: {
    key: 'desarrollo',
    label: 'Hito paciente',
    endpoint: '/desarrollo/',
    description: 'Seguimiento de hitos por paciente.',
    columns: [
      { field: 'paciente', header: 'Paciente' },
      { field: 'hito', header: 'Hito' },
      { field: 'fecha_logro', header: 'Fecha logro', format: (value) => formatDate(String(value)) }
    ],
    fields: [
      { name: 'paciente', label: 'Paciente', type: 'select', lookup: pacienteLookup },
      { name: 'hito', label: 'Hito', type: 'select', lookup: { endpoint: '/desarrollo/hitos/' } },
      { name: 'fecha_logro', label: 'Fecha logro', type: 'date' },
      { name: 'notas', label: 'Notas', type: 'textarea' }
    ]
  },
  hitos: {
    key: 'hitos',
    label: 'Hito',
    endpoint: '/desarrollo/hitos/',
    description: 'Catalogo de hitos del desarrollo.',
    columns: [
      { field: 'nombre', header: 'Nombre' },
      { field: 'edad_min_dias', header: 'Edad min (dias)' },
      { field: 'edad_max_dias', header: 'Edad max (dias)' },
      { field: 'dominio', header: 'Dominio' }
    ],
    fields: [
      { name: 'nombre', label: 'Nombre', type: 'text' },
      { name: 'edad_min_dias', label: 'Edad min (dias)', type: 'number' },
      { name: 'edad_max_dias', label: 'Edad max (dias)', type: 'number' },
      {
        name: 'dominio',
        label: 'Dominio',
        type: 'select',
        options: [
          { label: 'Motor', value: 'MOTOR' },
          { label: 'Lenguaje', value: 'LENGUAJE' },
          { label: 'Social', value: 'SOCIAL' },
          { label: 'Cognitivo', value: 'COGNITIVO' }
        ]
      }
    ]
  }
};
