from rest_framework import serializers

from .models import MedicionCrecimiento, ReferenciaCrecimiento


class MedicionCrecimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicionCrecimiento
        fields = '__all__'


class ReferenciaCrecimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferenciaCrecimiento
        fields = '__all__'
