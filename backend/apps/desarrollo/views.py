from rest_framework import viewsets

from .models import Hito, HitoPaciente
from .serializers import HitoPacienteSerializer, HitoSerializer


class HitoViewSet(viewsets.ModelViewSet):
    queryset = Hito.objects.all()
    serializer_class = HitoSerializer


class HitoPacienteViewSet(viewsets.ModelViewSet):
    queryset = HitoPaciente.objects.all()
    serializer_class = HitoPacienteSerializer

    def get_queryset(self):
        queryset = self.queryset.select_related('paciente', 'hito')
        paciente = self.request.query_params.get('paciente')
        if paciente:
            queryset = queryset.filter(paciente_id=paciente)
        return queryset
