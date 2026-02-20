from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Consulta, ExamenFisico
from .serializers import ConsultaSerializer, ExamenFisicoSerializer


class ConsultaViewSet(viewsets.ModelViewSet):
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer

    def get_queryset(self):
        queryset = self.queryset.select_related('paciente', 'examen_fisico')
        paciente = self.request.query_params.get('paciente')
        estatus = self.request.query_params.get('estatus')
        fecha_desde = self.request.query_params.get('fecha_desde')
        fecha_hasta = self.request.query_params.get('fecha_hasta')

        if paciente:
            queryset = queryset.filter(paciente_id=paciente)
        if estatus:
            queryset = queryset.filter(estatus=estatus)
        if fecha_desde:
            queryset = queryset.filter(fecha_visita__date__gte=fecha_desde)
        if fecha_hasta:
            queryset = queryset.filter(fecha_visita__date__lte=fecha_hasta)
        return queryset

    @action(detail=False, methods=['get'], url_path='historial-paciente')
    def historial_paciente(self, request):
        paciente = request.query_params.get('paciente')
        if not paciente:
            return Response(
                {'detail': 'El parametro paciente es obligatorio.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        consultas = self.get_queryset().filter(paciente_id=paciente).order_by('-fecha_visita')[:20]
        serializer = self.get_serializer(consultas, many=True)
        return Response(serializer.data)


class ExamenFisicoViewSet(viewsets.ModelViewSet):
    queryset = ExamenFisico.objects.all()
    serializer_class = ExamenFisicoSerializer

    def get_queryset(self):
        queryset = self.queryset.select_related('consulta', 'consulta__paciente')
        consulta = self.request.query_params.get('consulta')
        paciente = self.request.query_params.get('paciente')
        if consulta:
            queryset = queryset.filter(consulta_id=consulta)
        if paciente:
            queryset = queryset.filter(consulta__paciente_id=paciente)
        return queryset
