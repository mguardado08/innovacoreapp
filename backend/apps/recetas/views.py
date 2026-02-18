from rest_framework import viewsets

from .models import DetalleReceta, Medicamento, Receta
from .serializers import DetalleRecetaSerializer, MedicamentoSerializer, RecetaSerializer


class MedicamentoViewSet(viewsets.ModelViewSet):
    queryset = Medicamento.objects.all()
    serializer_class = MedicamentoSerializer


class RecetaViewSet(viewsets.ModelViewSet):
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer


class DetalleRecetaViewSet(viewsets.ModelViewSet):
    queryset = DetalleReceta.objects.all()
    serializer_class = DetalleRecetaSerializer
