from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    HistoriaClinicaViewSet,
    PacienteViewSet,
    ResponsablePacienteViewSet,
    SeguroPacienteViewSet,
)

responsables_router = DefaultRouter()
responsables_router.register(r'', ResponsablePacienteViewSet, basename='responsable')

seguros_router = DefaultRouter()
seguros_router.register(r'', SeguroPacienteViewSet, basename='seguro')

historias_router = DefaultRouter()
historias_router.register(r'', HistoriaClinicaViewSet, basename='historia')

router = DefaultRouter()
router.register(r'', PacienteViewSet, basename='paciente')

urlpatterns = [
    path('responsables/', include(responsables_router.urls)),
    path('seguros/', include(seguros_router.urls)),
    path('historias/', include(historias_router.urls)),
    path('', include(router.urls)),
]
