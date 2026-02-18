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
