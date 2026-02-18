from rest_framework import viewsets

from .models import ExamenPaciente, TipoExamen
from .serializers import ExamenPacienteSerializer, TipoExamenSerializer


class ExamenPacienteViewSet(viewsets.ModelViewSet):
    queryset = ExamenPaciente.objects.all()
    serializer_class = ExamenPacienteSerializer


class TipoExamenViewSet(viewsets.ModelViewSet):
    queryset = TipoExamen.objects.all()
    serializer_class = TipoExamenSerializer
