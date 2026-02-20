from django.utils import timezone
from rest_framework import serializers

from .models import HistoriaClinica, Paciente, ResponsablePaciente, SeguroPaciente


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'

    def validate(self, attrs):
        fecha_nacimiento = attrs.get('fecha_nacimiento')
        if self.instance and fecha_nacimiento is None:
            fecha_nacimiento = self.instance.fecha_nacimiento
        if fecha_nacimiento:
            hoy = timezone.localdate()
            edad = Paciente._calcular_edad_anios(fecha_nacimiento, hoy)
            if fecha_nacimiento > hoy:
                raise serializers.ValidationError(
                    {'fecha_nacimiento': 'La fecha no puede ser futura.'}
                )
            if edad > 18:
                raise serializers.ValidationError(
                    {'fecha_nacimiento': 'El paciente debe ser menor o igual a 18 anos.'}
                )
        return attrs


class ResponsablePacienteSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ResponsablePaciente
        fields = '__all__'

    def get_paciente_nombre(self, obj):
        return f'{obj.paciente.apellidos} {obj.paciente.nombres}'.strip()


class SeguroPacienteSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SeguroPaciente
        fields = '__all__'

    def get_paciente_nombre(self, obj):
        return f'{obj.paciente.apellidos} {obj.paciente.nombres}'.strip()


class HistoriaClinicaSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = HistoriaClinica
        fields = '__all__'

    def get_paciente_nombre(self, obj):
        return f'{obj.paciente.apellidos} {obj.paciente.nombres}'.strip()
