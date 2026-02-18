from django.db import models

from apps.comun.models import ModeloBaseClinico
from apps.consultas.models import Consulta
from apps.pacientes.models import Paciente


class TipoExamen(ModeloBaseClinico):
    class Categoria(models.TextChoices):
        LABORATORIO = 'LAB', 'Laboratorio'
        GABINETE = 'GAB', 'Gabinete'

    nombre = models.CharField(max_length=120)
    categoria = models.CharField(max_length=3, choices=Categoria.choices)
    codigo = models.CharField(max_length=60, blank=True)

    def __str__(self):
        return self.nombre


class ExamenPaciente(ModeloBaseClinico):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='examenes')
    consulta = models.ForeignKey(
        Consulta, on_delete=models.SET_NULL, null=True, blank=True, related_name='examenes'
    )
    tipo_examen = models.ForeignKey(TipoExamen, on_delete=models.PROTECT, related_name='examenes')
    fecha_solicitud = models.DateField()
    fecha_resultado = models.DateField(null=True, blank=True)
    resultado_texto = models.TextField(blank=True)
    adjunto = models.FileField(upload_to='examenes/', null=True, blank=True)

    class Meta:
        ordering = ['-fecha_solicitud']

    def __str__(self):
        return f'{self.tipo_examen} - {self.paciente}'
