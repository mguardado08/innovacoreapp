from datetime import timedelta

from django.db.models import Q
from django.utils import timezone
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

    def get_queryset(self):
        queryset = self.queryset
        q = self.request.query_params.get('q')
        sexo = self.request.query_params.get('sexo')
        activo = self.request.query_params.get('activo')
        edad_min = self.request.query_params.get('edad_min')
        edad_max = self.request.query_params.get('edad_max')

        if q:
            queryset = queryset.filter(
                Q(nombres__icontains=q)
                | Q(apellidos__icontains=q)
                | Q(curp__icontains=q)
            )
        if sexo:
            queryset = queryset.filter(sexo=sexo)
        if activo in {'true', 'false'}:
            queryset = queryset.filter(activo=(activo == 'true'))
        if edad_min:
            try:
                days = int(float(edad_min) * 365.25)
                fecha_limite = timezone.localdate() - timedelta(days=days)
                queryset = queryset.filter(fecha_nacimiento__lte=fecha_limite)
            except ValueError:
                pass
        if edad_max:
            try:
                days = int(float(edad_max) * 365.25)
                fecha_limite = timezone.localdate() - timedelta(days=days)
                queryset = queryset.filter(fecha_nacimiento__gte=fecha_limite)
            except ValueError:
                pass
        return queryset


class ResponsablePacienteViewSet(viewsets.ModelViewSet):
    queryset = ResponsablePaciente.objects.all()
    serializer_class = ResponsablePacienteSerializer

    def get_queryset(self):
        queryset = self.queryset.select_related('paciente')
        paciente = self.request.query_params.get('paciente')
        parentesco = self.request.query_params.get('parentesco')
        if paciente:
            queryset = queryset.filter(paciente_id=paciente)
        if parentesco:
            queryset = queryset.filter(parentesco=parentesco)
        return queryset


class SeguroPacienteViewSet(viewsets.ModelViewSet):
    queryset = SeguroPaciente.objects.all()
    serializer_class = SeguroPacienteSerializer

    def get_queryset(self):
        queryset = self.queryset.select_related('paciente')
        paciente = self.request.query_params.get('paciente')
        if paciente:
            queryset = queryset.filter(paciente_id=paciente)
        return queryset


class HistoriaClinicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaClinica.objects.all()
    serializer_class = HistoriaClinicaSerializer

    def get_queryset(self):
        queryset = self.queryset.select_related('paciente')
        paciente = self.request.query_params.get('paciente')
        if paciente:
            queryset = queryset.filter(paciente_id=paciente)
        return queryset
