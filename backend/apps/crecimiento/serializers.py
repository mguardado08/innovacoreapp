from rest_framework import serializers

from .models import MedicionCrecimiento, ReferenciaCrecimiento
from .services import calcular_metricas


class MedicionCrecimientoSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MedicionCrecimiento
        fields = '__all__'

    def get_paciente_nombre(self, obj):
        return f'{obj.paciente.apellidos} {obj.paciente.nombres}'.strip()

    def _aplicar_calculos(self, instance: MedicionCrecimiento) -> MedicionCrecimiento:
        calculo = calcular_metricas(instance)
        instance.edad_dias = calculo.edad_dias
        instance.imc = calculo.imc
        instance.z_score = calculo.z_score
        instance.clasificacion = calculo.clasificacion
        return instance

    def create(self, validated_data):
        instance = MedicionCrecimiento(**validated_data)
        self._aplicar_calculos(instance)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        self._aplicar_calculos(instance)
        instance.save()
        return instance


class ReferenciaCrecimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferenciaCrecimiento
        fields = '__all__'
