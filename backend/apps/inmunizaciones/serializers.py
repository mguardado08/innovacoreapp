from rest_framework import serializers

from .models import EsquemaVacuna, Vacuna, VacunacionPaciente


class VacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacuna
        fields = '__all__'


class EsquemaVacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EsquemaVacuna
        fields = '__all__'


class VacunacionPacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = VacunacionPaciente
        fields = '__all__'
