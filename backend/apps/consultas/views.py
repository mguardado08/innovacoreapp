from rest_framework import viewsets

from .models import Consulta, ExamenFisico
from .serializers import ConsultaSerializer, ExamenFisicoSerializer


class ConsultaViewSet(viewsets.ModelViewSet):
    queryset = Consulta.objects.all()
    serializer_class = ConsultaSerializer


class ExamenFisicoViewSet(viewsets.ModelViewSet):
    queryset = ExamenFisico.objects.all()
    serializer_class = ExamenFisicoSerializer
