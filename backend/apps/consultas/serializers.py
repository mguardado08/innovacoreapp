from rest_framework import serializers

from .models import Consulta, ExamenFisico


class ConsultaSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.SerializerMethodField(read_only=True)
    examen_fisico_detalle = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Consulta
        fields = '__all__'

    def get_paciente_nombre(self, obj):
        return f'{obj.paciente.apellidos} {obj.paciente.nombres}'.strip()

    def get_examen_fisico_detalle(self, obj):
        examen = getattr(obj, 'examen_fisico', None)
        if not examen:
            return None
        return {
            'peso_kg': examen.peso_kg,
            'talla_cm': examen.talla_cm,
            'temperatura_c': examen.temperatura_c,
            'frecuencia_cardiaca_lpm': examen.frecuencia_cardiaca_lpm,
            'frecuencia_respiratoria_rpm': examen.frecuencia_respiratoria_rpm,
            'presion_sistolica': examen.presion_sistolica,
            'presion_diastolica': examen.presion_diastolica,
            'saturacion_oxigeno_pct': examen.saturacion_oxigeno_pct,
            'notas': examen.notas,
        }


class ExamenFisicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamenFisico
        fields = '__all__'
