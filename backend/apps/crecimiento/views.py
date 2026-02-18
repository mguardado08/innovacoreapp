from rest_framework import viewsets

from .models import MedicionCrecimiento, ReferenciaCrecimiento
from .serializers import MedicionCrecimientoSerializer, ReferenciaCrecimientoSerializer


class MedicionCrecimientoViewSet(viewsets.ModelViewSet):
    queryset = MedicionCrecimiento.objects.all()
    serializer_class = MedicionCrecimientoSerializer


class ReferenciaCrecimientoViewSet(viewsets.ModelViewSet):
    queryset = ReferenciaCrecimiento.objects.all()
    serializer_class = ReferenciaCrecimientoSerializer
