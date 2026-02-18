from django.core.validators import MinValueValidator
from django.db import models

from apps.comun.models import ModeloBaseClinico
from apps.pacientes.models import Paciente


class Hito(ModeloBaseClinico):
    class Dominio(models.TextChoices):
        MOTOR = 'MOTOR', 'Motor'
        LENGUAJE = 'LENGUAJE', 'Lenguaje'
        SOCIAL = 'SOCIAL', 'Social'
        COGNITIVO = 'COGNITIVO', 'Cognitivo'

    nombre = models.CharField(max_length=160)
    edad_min_dias = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    edad_max_dias = models.PositiveIntegerField(null=True, blank=True)
    dominio = models.CharField(max_length=10, choices=Dominio.choices)

    def __str__(self):
        return self.nombre


class HitoPaciente(ModeloBaseClinico):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='hitos')
    hito = models.ForeignKey(Hito, on_delete=models.CASCADE, related_name='pacientes')
    fecha_logro = models.DateField(null=True, blank=True)
    notas = models.TextField(blank=True)

    class Meta:
        ordering = ['-fecha_logro']

    def __str__(self):
        return f'{self.hito} - {self.paciente}'
