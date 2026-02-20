# Implementacion de curvas de crecimiento (plan previo)

Este documento interpreta `backend/docs/Curvas de crecimiento.md` y define que vamos a construir antes de implementar codigo.

## 1) Interpretacion y ajuste al estado actual del proyecto

El proyecto ya tiene:
- Backend Django/DRF con app `crecimiento`.
- Modelo `MedicionCrecimiento` con peso, talla, perimetro y percentiles.
- Modelo `ReferenciaCrecimiento` con estructura LMS (`l`, `m`, `s`) por sexo/edad/metrica.
- Frontend React + MUI con modulo base de crecimiento.

Por eso no partimos de cero. La estrategia correcta es ampliar lo existente para soportar:
- calculo de IMC,
- calculo de Z-score por LMS,
- clasificacion automatica,
- datos de grafica OMS,
- vista longitudinal clinica.

## 2) Objetivo funcional en el nuevo software

Agregar un modulo de curvas pediatrico que permita:
- registrar peso y talla por consulta/paciente,
- calcular IMC y Z-score automaticamente,
- clasificar estado nutricional y talla,
- visualizar curva con bandas Z (-3 a +3) y evolucion del paciente,
- mostrar historico tabular,
- dejar preparada salida para PDF clinico.

## 3) Alcance de la primera implementacion (MVP realista)

Incluimos en MVP:
- Calculo IMC en backend y frontend.
- Calculo Z-score por formula LMS para indicadores soportados.
- Clasificacion automatica inicial para:
  - IMC para edad (5-19 anios).
  - Talla para edad.
- Endpoint de datos para grafica del paciente + curvas Z.
- Pantalla frontend con:
  - formulario de captura,
  - tabla historica,
  - grafica de curva.

Fuera del MVP (fase siguiente):
- Alertas avanzadas (cruce de percentil y delta Z > 1).
- Exportacion PDF e impresion tipo carnet.
- Configuracion multi-tenant completa (pais/tabla LMS/tema por tenant).

## 4) Cambios backend propuestos

### 4.1 Modelo y logica de negocio

En `apps/crecimiento`:
- Extender `MedicionCrecimiento` con campos calculados:
  - `imc`
  - `z_score`
  - `indicador` (ej. IMC_EDAD, TALLA_EDAD, PESO_EDAD, PESO_TALLA)
  - `clasificacion`
- Mantener `ReferenciaCrecimiento` como tabla LMS base.
- Agregar servicio de dominio (archivo utilitario) para:
  - calcular edad en meses,
  - calcular IMC,
  - resolver referencia LMS por sexo/edad/indicador,
  - calcular Z-score,
  - clasificar resultado.

### 4.2 API y endpoints

Sin romper API actual `/api/v1/crecimiento/`, agregar:
- endpoint para chart data por paciente (accion DRF):
  - `GET /api/v1/crecimiento/chart-data/?paciente=<id>&indicador=<...>`
- endpoint para referencias LMS filtradas:
  - `GET /api/v1/crecimiento/referencias/?sexo=<...>&metrica=<...>`

### 4.3 Datos maestros LMS

- Definir formato de carga de tablas OMS (CSV/fixture).
- Crear comando de gestion para importar LMS oficiales.
- Registrar version/fuente de tabla LMS en documentacion tecnica.

### 4.4 Testing

- Unit tests para formula LMS (casos normales y borde).
- Tests de IMC.
- Tests de clasificacion automatica.
- Tests API para chart-data.

## 5) Cambios frontend propuestos

En `frontend/src/features/crecimiento` (nueva seccion dedicada):
- `GrowthForm`:
  - fecha, peso, talla, tipo de edad,
  - preview de IMC y clasificacion,
  - guardado.
- `GrowthTable`:
  - fecha, edad, peso, talla, imc, z-score, clasificacion.
- `GrowthChart`:
  - lineas Z (-3 a +3),
  - serie del paciente,
  - tooltip clinico (valor, z-score, clasificacion).

Decisiones UI:
- Mantener Material UI para layout.
- Usar libreria de grafica (Recharts recomendado por rapidez de integracion).
- Colores clinicos suaves y legibles.

## 6) Reglas clinicas iniciales

### IMC para edad (5-19)
- Z < -3: Delgadez severa
- -3 <= Z < -2: Delgadez
- -2 <= Z <= +1: Normal
- +1 < Z <= +2: Sobrepeso
- Z > +2: Obesidad

### Talla para edad
- Z < -2: Talla baja
- Z >= -2: Normal

Nota: el detalle exacto de corte para 0-5 anios y peso/talla se habilita en fase 2 con tablas validadas y criterio clinico acordado.

## 7) Plan por fases (ejecucion)

### Fase 1 (base clinica operativa)
- Calculo IMC + Z-score en backend.
- Clasificacion inicial.
- Endpoint chart-data.
- UI de formulario y tabla historica.

### Fase 2 (curvas completas OMS)
- Grafica con bandas Z oficiales y punto paciente.
- Indicadores por rangos de edad (0-24m, 2-5a, 5-19a).
- Regla de indicador automatico por edad.

### Fase 3 (operacion y valor agregado)
- Alertas automaticas.
- PDF e impresion.
- Ajustes multi-tenant y configuraciones por institucion.

## 10) Estado de ejecucion actual

- `Completado` Fase 1:
  - Calculo IMC, Z-score y clasificacion en backend.
  - Endpoint `GET /api/v1/crecimiento/chart-data/`.
  - Filtro por paciente/indicador en crecimiento.
  - UI de crecimiento con formulario, tabla historica y grafica.
- `Completado parcial` Fase 2:
  - Visualizacion de bandas Z (-3 a +3) y serie del paciente.
  - Falta completar reglas avanzadas por todos los rangos etarios e indicadores OMS.
- `Pendiente` Fase 3:
  - Alertas automaticas, PDF/impresion, multi-tenant configurable.

## 8) Riesgos y dependencias

- Sin tabla LMS oficial cargada, el Z-score no puede ser clinicamente confiable.
- La calidad de grafica depende de una fuente consistente por sexo/edad/indicador.
- Multi-tenant real requiere modelo de tenant en el proyecto (hoy no esta completo en dominio clinico).

## 9) Criterios de aceptacion del MVP

- Al guardar medicion, se persisten IMC, Z-score y clasificacion cuando hay referencia LMS disponible.
- Se puede consultar historial de crecimiento por paciente con esos campos.
- Se visualiza curva con al menos un indicador funcional (IMC edad o talla edad).
- Los tests de formula y clasificacion pasan.
