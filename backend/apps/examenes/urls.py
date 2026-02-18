from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ExamenPacienteViewSet, TipoExamenViewSet

tipos_router = DefaultRouter()
tipos_router.register(r'', TipoExamenViewSet, basename='tipo-examen')

router = DefaultRouter()
router.register(r'', ExamenPacienteViewSet, basename='examen')

urlpatterns = [
    path('tipos/', include(tipos_router.urls)),
    path('', include(router.urls)),
]
