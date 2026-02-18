from django.core.validators import MinValueValidator
from django.db import models

from apps.comun.models import ModeloBaseClinico
from apps.pacientes.models import Paciente
from apps.consultas.models import Consulta


class Vacuna(ModeloBaseClinico):
    nombre = models.CharField(max_length=120)
    fabricante = models.CharField(max_length=120, blank=True)
    codigo = models.CharField(max_length=60, blank=True)

    def __str__(self):
        return self.nombre


class EsquemaVacuna(ModeloBaseClinico):
    vacuna = models.ForeignKey(Vacuna, on_delete=models.CASCADE, related_name='esquemas')
    numero_dosis = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    edad_min_dias = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    edad_max_dias = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f'{self.vacuna} dosis {self.numero_dosis}'


class VacunacionPaciente(ModeloBaseClinico):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='vacunaciones')
    vacuna = models.ForeignKey(Vacuna, on_delete=models.CASCADE, related_name='aplicaciones')
    numero_dosis = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    fecha_aplicacion = models.DateField()
    lote = models.CharField(max_length=80, blank=True)
    sitio = models.CharField(max_length=80, blank=True)
    notas = models.TextField(blank=True)
    consulta = models.ForeignKey(
        Consulta, on_delete=models.SET_NULL, null=True, blank=True, related_name='vacunaciones'
    )

    class Meta:
        ordering = ['-fecha_aplicacion']

    def __str__(self):
        return f'{self.vacuna} - {self.paciente}'
