from rest_framework import viewsets

from .models import Hito, HitoPaciente
from .serializers import HitoPacienteSerializer, HitoSerializer


class HitoViewSet(viewsets.ModelViewSet):
    queryset = Hito.objects.all()
    serializer_class = HitoSerializer


class HitoPacienteViewSet(viewsets.ModelViewSet):
    queryset = HitoPaciente.objects.all()
    serializer_class = HitoPacienteSerializer
