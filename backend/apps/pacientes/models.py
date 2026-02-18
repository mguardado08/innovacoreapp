from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

from apps.comun.models import ModeloBaseClinico


class Paciente(ModeloBaseClinico):
    class Sexo(models.TextChoices):
        MASCULINO = 'M', 'Masculino'
        FEMENINO = 'F', 'Femenino'
        OTRO = 'X', 'Otro/No especificado'

    class TipoParto(models.TextChoices):
        VAGINAL = 'VAGINAL', 'Vaginal'
        CESAREA = 'CESAREA', 'Cesarea'

    nombres = models.CharField(max_length=120)
    apellidos = models.CharField(max_length=120)
    sexo = models.CharField(max_length=1, choices=Sexo.choices)
    fecha_nacimiento = models.DateField()
    curp = models.CharField(max_length=18, blank=True)
    tipo_sangre = models.CharField(max_length=8, blank=True)

    semanas_gestacionales = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(22), MaxValueValidator(44)],
    )
    peso_nacimiento_g = models.PositiveIntegerField(null=True, blank=True)
    talla_nacimiento_cm = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    perimetro_cefalico_nacimiento_cm = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    tipo_parto = models.CharField(
        max_length=8,
        choices=TipoParto.choices,
        blank=True,
    )
    apgar_1 = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
    )
    apgar_5 = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
    )
    es_prematuro = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ['apellidos', 'nombres']

    @staticmethod
    def _calcular_edad_anios(fecha_nacimiento, hoy):
        years = hoy.year - fecha_nacimiento.year
        if (hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day):
            years -= 1
        return years

    def clean(self):
        super().clean()
        if self.fecha_nacimiento:
            hoy = timezone.localdate()
            if self.fecha_nacimiento > hoy:
                raise ValidationError({'fecha_nacimiento': 'La fecha no puede ser futura.'})
            edad = self._calcular_edad_anios(self.fecha_nacimiento, hoy)
            if edad > 18:
                raise ValidationError({'fecha_nacimiento': 'El paciente debe ser menor o igual a 18 anos.'})
        if self.peso_nacimiento_g is not None and self.peso_nacimiento_g <= 0:
            raise ValidationError({'peso_nacimiento_g': 'Debe ser mayor a 0.'})
        if self.talla_nacimiento_cm is not None and self.talla_nacimiento_cm <= 0:
            raise ValidationError({'talla_nacimiento_cm': 'Debe ser mayor a 0.'})

    def __str__(self):
        return f'{self.apellidos} {self.nombres}'


class ResponsablePaciente(ModeloBaseClinico):
    class Parentesco(models.TextChoices):
        MADRE = 'MADRE', 'Madre'
        PADRE = 'PADRE', 'Padre'
        TUTOR = 'TUTOR', 'Tutor'
        OTRO = 'OTRO', 'Otro'

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='responsables')
    nombre_completo = models.CharField(max_length=160)
    parentesco = models.CharField(max_length=12, choices=Parentesco.choices)
    telefono = models.CharField(max_length=20, blank=True)
    correo = models.EmailField(blank=True)
    direccion = models.TextField(blank=True)
    es_principal = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['paciente'],
                condition=models.Q(es_principal=True),
                name='unico_responsable_principal_por_paciente',
            )
        ]

    def __str__(self):
        return f'{self.nombre_completo} - {self.paciente}'


class SeguroPaciente(ModeloBaseClinico):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='seguros')
    proveedor = models.CharField(max_length=120)
    numero_poliza = models.CharField(max_length=120)
    vigente_hasta = models.DateField(null=True, blank=True)

    def __str__(self):
        return f'{self.proveedor} - {self.numero_poliza}'


class HistoriaClinica(ModeloBaseClinico):
    paciente = models.OneToOneField(Paciente, on_delete=models.CASCADE, related_name='historia_clinica')
    antecedentes_familiares = models.TextField(blank=True)
    antecedentes_personales = models.TextField(blank=True)
    antecedentes_perinatales = models.TextField(blank=True)
    alergias = models.TextField(blank=True)
    padecimientos_cronicos = models.TextField(blank=True)

    def __str__(self):
        return f'Historia clinica - {self.paciente}'
