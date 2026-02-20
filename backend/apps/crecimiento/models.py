from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.comun.models import ModeloBaseClinico
from apps.consultas.models import Consulta
from apps.pacientes.models import Paciente


class MedicionCrecimiento(ModeloBaseClinico):
    class TipoEdad(models.TextChoices):
        CRONOLOGICA = 'CRONO', 'Cronologica'
        CORREGIDA = 'CORR', 'Corregida'

    class Indicador(models.TextChoices):
        PESO_EDAD = 'PESO_EDAD', 'Peso para la edad'
        TALLA_EDAD = 'TALLA_EDAD', 'Talla para la edad'
        IMC_EDAD = 'IMC_EDAD', 'IMC para la edad'

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='mediciones')
    consulta = models.ForeignKey(
        Consulta, on_delete=models.SET_NULL, null=True, blank=True, related_name='mediciones'
    )
    fecha_medicion = models.DateField()
    peso_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    talla_cm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    perimetro_cefalico_cm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    edad_dias = models.PositiveIntegerField(null=True, blank=True)
    edad_corregida_dias = models.PositiveIntegerField(null=True, blank=True)
    tipo_edad = models.CharField(max_length=5, choices=TipoEdad.choices, default=TipoEdad.CRONOLOGICA)
    percentil_peso = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    percentil_talla = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    percentil_imc = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    percentil_perimetro = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    imc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    indicador = models.CharField(
        max_length=16,
        choices=Indicador.choices,
        default=Indicador.TALLA_EDAD,
    )
    z_score = models.DecimalField(max_digits=6, decimal_places=3, null=True, blank=True)
    clasificacion = models.CharField(max_length=60, blank=True)

    class Meta:
        ordering = ['-fecha_medicion']

    def __str__(self):
        return f'Medicion {self.paciente} - {self.fecha_medicion}'


class ReferenciaCrecimiento(ModeloBaseClinico):
    class Sexo(models.TextChoices):
        MASCULINO = 'M', 'Masculino'
        FEMENINO = 'F', 'Femenino'
        OTRO = 'X', 'Otro/No especificado'

    class Metrica(models.TextChoices):
        PESO = 'PESO', 'Peso'
        TALLA = 'TALLA', 'Talla'
        PERIMETRO = 'PC', 'Perimetro cefalico'
        IMC = 'IMC', 'Indice de masa corporal'

    sexo = models.CharField(max_length=1, choices=Sexo.choices)
    edad_dias = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    metrica = models.CharField(max_length=5, choices=Metrica.choices)
    l = models.DecimalField(max_digits=6, decimal_places=3)
    m = models.DecimalField(max_digits=6, decimal_places=3)
    s = models.DecimalField(max_digits=6, decimal_places=3)

    class Meta:
        ordering = ['sexo', 'edad_dias', 'metrica']

    def __str__(self):
        return f'Referencia {self.sexo} {self.edad_dias} {self.metrica}'
