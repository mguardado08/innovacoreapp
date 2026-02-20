# Flujo de sistema

Guia paso a paso para preparar datos y ejecutar pruebas funcionales.

## 1) Preparacion

1. Levantar servicios:
   - `docker compose up -d --build`
2. Validar backend:
   - `http://localhost:8000/api/docs/`
3. Validar frontend:
   - `http://localhost:5173`

## 2) Carga de fixtures (orden recomendado)

```bash
docker compose exec -T backend python manage.py loaddata fixtures/catalogos_fixture.json
docker compose exec -T backend python manage.py loaddata fixtures/pacientes_fixture.json
docker compose exec -T backend python manage.py loaddata fixtures/consultas_fixture.json
docker compose exec -T backend python manage.py loaddata fixtures/crecimiento_referencias_fixture.json
docker compose exec -T backend python manage.py loaddata fixtures/crecimiento_mediciones_fixture.json
```

## 3) Flujo funcional para pruebas

### 3.1 Catalogos

1. Vacunas
2. Esquemas de vacuna
3. Tipos de examen
4. Medicamentos
5. Hitos de desarrollo
6. Referencias LMS

### 3.2 Paciente y expediente

1. Crear/ver paciente
2. Registrar historia clinica
3. Registrar responsable
4. Registrar seguro

### 3.3 Consulta clinica

1. Crear consulta
2. Registrar examen fisico
3. Revisar listado de consultas con peso/talla
4. Consultar historial por paciente

### 3.4 Modulos relacionados

1. Examenes
2. Recetas y detalle
3. Inmunizaciones
4. Desarrollo

### 3.5 Crecimiento (curvas)

1. Ir a `Crecimiento`
2. Seleccionar paciente
3. Seleccionar indicador (`IMC_EDAD`, `TALLA_EDAD`, `PESO_EDAD`)
4. Aplicar filtros de fecha (`fecha desde/hasta`)
5. Verificar sincronia entre:
   - resumen,
   - tabla historica,
   - grafica.

## 4) Verificaciones clave

- Persistencia de datos tras recarga.
- Autosave de formularios CRUD.
- Filtros de pacientes y consultas funcionando.
- Curvas y tabla cambiando al modificar indicador y fechas.

## 5) Alcance pendiente (no bloquea pruebas base)

- Consulta guiada por secciones clinicas completas.
- Cuadricula inteligente de vacunacion.
- Escala de desarrollo con semaforo.
- Dashboard con agenda del dia.
- Impresion PDF y automatizaciones (correo/Gmail).
