from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import MedicionCrecimientoViewSet, ReferenciaCrecimientoViewSet

referencias_router = DefaultRouter()
referencias_router.register(r'', ReferenciaCrecimientoViewSet, basename='referencia-crecimiento')

router = DefaultRouter()
router.register(r'', MedicionCrecimientoViewSet, basename='medicion')

urlpatterns = [
    path('referencias/', include(referencias_router.urls)),
    path('', include(router.urls)),
]
