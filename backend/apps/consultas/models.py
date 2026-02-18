from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

from apps.comun.models import ModeloBaseClinico
from apps.pacientes.models import Paciente


class Consulta(ModeloBaseClinico):
    class Estatus(models.TextChoices):
        ABIERTA = 'ABIERTA', 'Abierta'
        CERRADA = 'CERRADA', 'Cerrada'

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='consultas')
    fecha_visita = models.DateTimeField(default=timezone.now)
    motivo_consulta = models.TextField(blank=True)
    subjetivo = models.TextField(blank=True)
    evaluacion = models.TextField(blank=True)
    plan = models.TextField(blank=True)
    diagnostico_texto = models.TextField(blank=True)
    diagnostico_codigos = models.CharField(max_length=255, blank=True)
    estatus = models.CharField(max_length=10, choices=Estatus.choices, default=Estatus.ABIERTA)

    class Meta:
        ordering = ['-fecha_visita']

    def __str__(self):
        return f'Consulta {self.paciente} - {self.fecha_visita:%Y-%m-%d}'


class ExamenFisico(ModeloBaseClinico):
    consulta = models.OneToOneField(Consulta, on_delete=models.CASCADE, related_name='examen_fisico')
    peso_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    talla_cm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    perimetro_cefalico_cm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    temperatura_c = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        null=True,
        blank=True,
        validators=[MinValueValidator(30), MaxValueValidator(45)],
    )
    frecuencia_cardiaca_lpm = models.PositiveSmallIntegerField(null=True, blank=True)
    frecuencia_respiratoria_rpm = models.PositiveSmallIntegerField(null=True, blank=True)
    presion_sistolica = models.PositiveSmallIntegerField(null=True, blank=True)
    presion_diastolica = models.PositiveSmallIntegerField(null=True, blank=True)
    saturacion_oxigeno_pct = models.PositiveSmallIntegerField(
        null=True, blank=True, validators=[MaxValueValidator(100)]
    )
    notas = models.TextField(blank=True)

    def clean(self):
        super().clean()
        if self.peso_kg is not None and self.peso_kg <= 0:
            raise ValidationError({'peso_kg': 'Debe ser mayor a 0.'})
        if self.talla_cm is not None and self.talla_cm <= 0:
            raise ValidationError({'talla_cm': 'Debe ser mayor a 0.'})

    def __str__(self):
        return f'Examen fisico - {self.consulta}'
