# 🎯 Objetivo

Desarrollar un módulo de Curvas de Crecimiento Pediátrico basado en estándares OMS/Ministerio de Salud que permita:

- Registrar peso, talla e IMC por consulta
- Calcular automáticamente Z-Score
- Clasificar estado nutricional
- Visualizar curvas dinámicas tipo OMS
- Comparar evolución longitudinal del paciente
- Exportar reporte PDF clínico

Stack:
- Backend: Django + Django Rest Framework
- Frontend: React + Material UI
- Base de datos: PostgreSQL
- Arquitectura preparada para multi-tenant

---

# 📊 Indicadores a Implementar

## 1️⃣ 0 a 24 meses
- Peso para la edad
- Talla para la edad
- Peso para la talla

## 2️⃣ 2 a 5 años
- Peso para la edad
- Talla para la edad
- IMC para la edad
- Peso para la talla

## 3️⃣ 5 a 19 años
- Talla para la edad
- IMC para la edad

---

# 🧮 Lógica de Cálculo

## IMC
IMC = peso (kg) / talla (m²)

## Z-Score
Implementar cálculo basado en método LMS (OMS):

Z = [(X/M)^L − 1] / (L × S)

Donde:
- X = valor medido
- L = coeficiente Box-Cox
- M = mediana
- S = coeficiente de variación

Se deben almacenar tablas LMS oficiales en base de datos.

---

# 🗂️ Backend – Modelado Django

## Modelos

### Patient
- id
- tenant
- nombre
- fecha_nacimiento
- sexo

### GrowthRecord
- id
- patient (FK)
- fecha
- edad_meses
- peso
- talla
- imc (auto calculado)
- indicador
- z_score
- clasificacion

### LMSReference
- sexo
- indicador
- edad_meses
- L
- M
- S

---

# 🔌 API Endpoints

GET /api/growth/{patient_id}/
POST /api/growth/
GET /api/growth/chart-data/{patient_id}/
GET /api/lms/{indicador}/{sexo}/

---

# 📈 Frontend – React + MUI

## Componentes

### GrowthForm
- Fecha
- Peso
- Talla
- Cálculo automático IMC
- Submit

### GrowthChart
Usar:
- Recharts o Nivo
- Líneas:
    - -3
    - -2
    - -1
    - 0
    - +1
    - +2
    - +3
- Punto resaltado del paciente
- Tooltip con:
    - Valor
    - Z-score
    - Clasificación

### GrowthTable
Tabla MUI:
- Fecha
- Edad
- Peso
- Talla
- IMC
- Z-score
- Clasificación

---

# 🎨 Clasificaciones Automáticas

## IMC 5–19 años
Z < -3 → Delgadez severa
Z -3 a -2 → Delgadez
Z -2 a +1 → Normal
Z +1 a +2 → Sobrepeso
Z > +2 → Obesidad

## Talla para edad
Z < -2 → Talla baja
Z ≥ -2 → Normal

---

# 🧠 Funcionalidades Avanzadas

- Histórico longitudinal
- Comparación entre consultas
- Alertas automáticas si:
    - Cruza percentil
    - Z-score cambia >1 punto
- Exportación PDF
- Impresión tipo carnet

---

# 🔐 Multi-tenant

- Aislar datos por tenant
- Permitir configuración:
    - País
    - Tabla LMS oficial utilizada
    - Colores de curva

---

# 📦 Extras Opcionales

- Modo offline
- Dashboard pediatra
- Semáforo nutricional
- Indicadores de riesgo

---

# 🧪 Testing

- Unit test cálculo LMS
- Test precisión IMC
- Test clasificación automática

---

# 📈 UX Requerida

- Diseño clínico limpio
- Responsive
- Colores suaves tipo OMS
- Sin saturación visual
- Gráfica clara y profesional

---

# 🎯 Resultado Esperado

Un módulo clínico profesional que permita:

- Visualización moderna de curvas oficiales
- Interpretación automática
- Reducción de errores manuales
- Escalable para SaaS pediátrico