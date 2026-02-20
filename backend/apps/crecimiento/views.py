from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import MedicionCrecimiento, ReferenciaCrecimiento
from .serializers import MedicionCrecimientoSerializer, ReferenciaCrecimientoSerializer
from .services import calcular_valor_z, metrica_por_indicador


class MedicionCrecimientoViewSet(viewsets.ModelViewSet):
    queryset = MedicionCrecimiento.objects.all()
    serializer_class = MedicionCrecimientoSerializer

    def get_queryset(self):
        queryset = self.queryset
        paciente = self.request.query_params.get('paciente')
        indicador = self.request.query_params.get('indicador')
        if paciente:
            queryset = queryset.filter(paciente_id=paciente)
        if indicador:
            queryset = queryset.filter(indicador=indicador)
        return queryset.select_related('paciente')

    @action(detail=False, methods=['get'], url_path='chart-data')
    def chart_data(self, request):
        paciente_id = request.query_params.get('paciente')
        indicador = request.query_params.get('indicador')
        if not paciente_id:
            return Response(
                {'detail': 'El parametro paciente es obligatorio.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = self.get_queryset().filter(paciente_id=paciente_id)
        if indicador:
            queryset = queryset.filter(indicador=indicador)

        mediciones = list(queryset.order_by('edad_dias', 'fecha_medicion'))
        if not mediciones:
            return Response({'patient_series': [], 'curves': []})

        indicador_objetivo = indicador or mediciones[-1].indicador
        metrica = metrica_por_indicador(indicador_objetivo)
        sexo = mediciones[-1].paciente.sexo
        referencias = ReferenciaCrecimiento.objects.filter(sexo=sexo, metrica=metrica).order_by('edad_dias')

        patient_series = []
        for medicion in mediciones:
            valor = None
            if medicion.indicador == MedicionCrecimiento.Indicador.PESO_EDAD:
                valor = medicion.peso_kg
            elif medicion.indicador == MedicionCrecimiento.Indicador.IMC_EDAD:
                valor = medicion.imc
            else:
                valor = medicion.talla_cm
            if valor is None:
                continue
            patient_series.append(
                {
                    'id': medicion.id,
                    'fecha': medicion.fecha_medicion,
                    'edad_dias': medicion.edad_dias,
                    'valor': float(valor),
                    'z_score': float(medicion.z_score) if medicion.z_score is not None else None,
                    'clasificacion': medicion.clasificacion,
                }
            )

        curves = []
        for referencia in referencias:
            point = {'edad_dias': referencia.edad_dias}
            for z in range(-3, 4):
                valor_z = calcular_valor_z(referencia.m, referencia.l, referencia.s, z)
                point[f'z_{z}'] = float(valor_z) if valor_z is not None else None
            curves.append(point)

        return Response({'patient_series': patient_series, 'curves': curves})


class ReferenciaCrecimientoViewSet(viewsets.ModelViewSet):
    queryset = ReferenciaCrecimiento.objects.all()
    serializer_class = ReferenciaCrecimientoSerializer

    def get_queryset(self):
        queryset = self.queryset
        sexo = self.request.query_params.get('sexo')
        metrica = self.request.query_params.get('metrica')
        if sexo:
            queryset = queryset.filter(sexo=sexo)
        if metrica:
            queryset = queryset.filter(metrica=metrica)
        return queryset
