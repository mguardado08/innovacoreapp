from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ConsultaViewSet, ExamenFisicoViewSet

examenes_router = DefaultRouter()
examenes_router.register(r'', ExamenFisicoViewSet, basename='examen-fisico')

router = DefaultRouter()
router.register(r'', ConsultaViewSet, basename='consulta')

urlpatterns = [
    path('examenes-fisicos/', include(examenes_router.urls)),
    path('', include(router.urls)),
]
