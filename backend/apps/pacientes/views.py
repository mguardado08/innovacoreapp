from rest_framework import viewsets

from .models import HistoriaClinica, Paciente, ResponsablePaciente, SeguroPaciente
from .serializers import (
    HistoriaClinicaSerializer,
    PacienteSerializer,
    ResponsablePacienteSerializer,
    SeguroPacienteSerializer,
)


class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer


class ResponsablePacienteViewSet(viewsets.ModelViewSet):
    queryset = ResponsablePaciente.objects.all()
    serializer_class = ResponsablePacienteSerializer


class SeguroPacienteViewSet(viewsets.ModelViewSet):
    queryset = SeguroPaciente.objects.all()
    serializer_class = SeguroPacienteSerializer


class HistoriaClinicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaClinica.objects.all()
    serializer_class = HistoriaClinicaSerializer
