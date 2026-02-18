from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import HitoPacienteViewSet, HitoViewSet

hitos_router = DefaultRouter()
hitos_router.register(r'', HitoViewSet, basename='hito')

router = DefaultRouter()
router.register(r'', HitoPacienteViewSet, basename='hito-paciente')

urlpatterns = [
    path('hitos/', include(hitos_router.urls)),
    path('', include(router.urls)),
]
