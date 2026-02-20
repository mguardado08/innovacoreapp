# Test Log - Fixtures

Bitacora de fixtures cargados y validaciones rapidas realizadas.

## Fecha: 2026-02-20

### 1) Catalogos

Comando:
```bash
docker compose exec -T backend python manage.py loaddata fixtures/catalogos_fixture.json
```

Resultado:
- Carga correcta.
- Incluye vacunas, esquemas, tipos de examen, medicamentos, hitos y referencias base.

### 2) Pacientes

Comando:
```bash
docker compose exec -T backend python manage.py loaddata fixtures/pacientes_fixture.json
```

Resultado:
- 10 pacientes activos.
- 10 responsables (1 principal por paciente).
- 10 seguros.
- 10 historias clinicas.

Verificacion:
```bash
docker compose exec -T backend python manage.py shell -c "from apps.pacientes.models import Paciente, ResponsablePaciente; print(Paciente.objects.count(), ResponsablePaciente.objects.count())"
```

### 3) Consultas y examen fisico

Comando:
```bash
docker compose exec -T backend python manage.py loaddata fixtures/consultas_fixture.json
```

Resultado:
- 20 consultas (2 por paciente).
- 20 examenes fisicos.

Verificacion:
```bash
docker compose exec -T backend python manage.py shell -c "from apps.consultas.models import Consulta, ExamenFisico; print(Consulta.objects.count(), ExamenFisico.objects.count())"
```

### 4) Crecimiento - referencias LMS

Comando:
```bash
docker compose exec -T backend python manage.py loaddata fixtures/crecimiento_referencias_fixture.json
```

Resultado:
- 24 referencias LMS.
- Metricas: IMC, TALLA, PESO.
- Sexos: F y M.

### 5) Crecimiento - mediciones

Comando:
```bash
docker compose exec -T backend python manage.py loaddata fixtures/crecimiento_mediciones_fixture.json
```

Resultado:
- 120 mediciones.
- 10 pacientes.
- 3 indicadores por paciente (`IMC_EDAD`, `TALLA_EDAD`, `PESO_EDAD`).
- 4 puntos por indicador/paciente.

Verificacion:
```bash
docker compose exec -T backend python manage.py shell -c "from apps.crecimiento.models import MedicionCrecimiento as M; from django.db.models import Count; print(M.objects.count()); print(list(M.objects.values('indicador').annotate(c=Count('id')).order_by('indicador')))"
```

## Observaciones

- Los fixtures incluyen campos base clinicos (`creado_en`, `actualizado_en`, `esta_borrado`, `borrado_en`, `borrado_por`) para evitar errores de integridad.
- Si los datos no se ven en frontend, aplicar recarga dura del navegador y/o reiniciar servicio frontend.
