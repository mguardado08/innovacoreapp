# Implementacion de curvas de crecimiento

Documento de diseno y estado real de implementacion del modulo de crecimiento.

## 1) Objetivo funcional

Implementar seguimiento pediatrico con:
- captura de mediciones,
- calculo IMC y Z-score por LMS,
- clasificacion automatica,
- visualizacion de curvas con bandas Z,
- historico longitudinal por paciente.

## 2) Estado actual implementado

### Backend

- `Implementado` Campos clinicos en medicion:
  - `imc`, `indicador`, `z_score`, `clasificacion`.
- `Implementado` Soporte LMS para metricas:
  - `IMC`, `TALLA`, `PESO`.
- `Implementado` Servicio de calculo en `apps/crecimiento/services.py`.
- `Implementado` Calculo automatico en create/update serializer.
- `Implementado` Endpoint de curvas:
  - `GET /api/v1/crecimiento/chart-data/`
- `Implementado` Filtros en crecimiento:
  - `paciente`, `indicador`, `fecha_desde`, `fecha_hasta`.

### Frontend

- `Implementado` Modulo dedicado:
  - `frontend/src/features/crecimiento/GrowthModule.tsx`
- `Implementado` Grafica con:
  - bandas Z (-3 a +3),
  - serie del paciente,
  - tooltip clinico,
  - leyenda y ejes auxiliares.
- `Implementado` Tabla longitudinal filtrada por indicador y rango de fecha.
- `Implementado` Integracion de ruta general y detalle de paciente.

## 3) Fixtures de crecimiento

- Referencias LMS:
  - `backend/fixtures/crecimiento_referencias_fixture.json`
- Mediciones:
  - `backend/fixtures/crecimiento_mediciones_fixture.json`

Cobertura de datos de prueba:
- 10 pacientes
- 3 indicadores por paciente (`IMC_EDAD`, `TALLA_EDAD`, `PESO_EDAD`)
- 4 mediciones por indicador (120 mediciones totales)

## 4) Validacion operativa recomendada

1. Abrir `http://localhost:5173/crecimiento`.
2. Cambiar paciente.
3. Cambiar indicador.
4. Aplicar filtros de fecha.
5. Verificar que cambien:
   - tabla historica,
   - resumen,
   - grafica.

## 5) Pendiente tecnico (siguiente fase)

- Curvas especificas prematuro vs cronologica normal.
- Reglas OMS completas por rangos etarios extendidos.
- Alertas automaticas (cruce de banda, delta Z).
- Exportacion PDF de curva clinica.
