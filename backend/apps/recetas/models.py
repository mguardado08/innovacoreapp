from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone

from apps.comun.models import ModeloBaseClinico
from apps.consultas.models import Consulta
from apps.pacientes.models import Paciente


class Medicamento(ModeloBaseClinico):
    nombre = models.CharField(max_length=120)
    forma = models.CharField(max_length=60, blank=True)
    concentracion = models.CharField(max_length=60, blank=True)

    def __str__(self):
        return self.nombre


class Receta(ModeloBaseClinico):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='recetas')
    consulta = models.ForeignKey(
        Consulta, on_delete=models.SET_NULL, null=True, blank=True, related_name='recetas'
    )
    fecha_prescripcion = models.DateTimeField(default=timezone.now)
    notas = models.TextField(blank=True)

    class Meta:
        ordering = ['-fecha_prescripcion']

    def __str__(self):
        return f'Receta {self.paciente} - {self.fecha_prescripcion:%Y-%m-%d}'


class DetalleReceta(ModeloBaseClinico):
    receta = models.ForeignKey(Receta, on_delete=models.CASCADE, related_name='detalles')
    medicamento = models.ForeignKey(Medicamento, on_delete=models.PROTECT, related_name='recetas')
    dosis = models.CharField(max_length=120)
    frecuencia = models.CharField(max_length=120)
    duracion_dias = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    instrucciones = models.TextField(blank=True)

    def __str__(self):
        return f'{self.medicamento} - {self.receta}'
