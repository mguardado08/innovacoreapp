from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import EsquemaVacunaViewSet, VacunaViewSet, VacunacionPacienteViewSet

vacunas_router = DefaultRouter()
vacunas_router.register(r'', VacunaViewSet, basename='vacuna')

esquemas_router = DefaultRouter()
esquemas_router.register(r'', EsquemaVacunaViewSet, basename='esquema')

router = DefaultRouter()
router.register(r'', VacunacionPacienteViewSet, basename='vacunacion')

urlpatterns = [
    path('vacunas/', include(vacunas_router.urls)),
    path('esquemas/', include(esquemas_router.urls)),
    path('', include(router.urls)),
]
