from rest_framework import viewsets

from .models import EsquemaVacuna, Vacuna, VacunacionPaciente
from .serializers import EsquemaVacunaSerializer, VacunaSerializer, VacunacionPacienteSerializer


class VacunaViewSet(viewsets.ModelViewSet):
    queryset = Vacuna.objects.all()
    serializer_class = VacunaSerializer


class EsquemaVacunaViewSet(viewsets.ModelViewSet):
    queryset = EsquemaVacuna.objects.all()
    serializer_class = EsquemaVacunaSerializer


class VacunacionPacienteViewSet(viewsets.ModelViewSet):
    queryset = VacunacionPaciente.objects.all()
    serializer_class = VacunacionPacienteSerializer

    def get_queryset(self):
        queryset = self.queryset.select_related('paciente', 'vacuna', 'consulta')
        paciente = self.request.query_params.get('paciente')
        if paciente:
            queryset = queryset.filter(paciente_id=paciente)
        return queryset
