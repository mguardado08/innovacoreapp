from rest_framework import serializers

from .models import ExamenPaciente, TipoExamen


class TipoExamenSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoExamen
        fields = '__all__'


class ExamenPacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamenPaciente
        fields = '__all__'
