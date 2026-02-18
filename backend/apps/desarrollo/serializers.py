from rest_framework import serializers

from .models import Hito, HitoPaciente


class HitoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hito
        fields = '__all__'


class HitoPacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = HitoPaciente
        fields = '__all__'
