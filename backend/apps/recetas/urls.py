from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import DetalleRecetaViewSet, MedicamentoViewSet, RecetaViewSet

detalles_router = DefaultRouter()
detalles_router.register(r'', DetalleRecetaViewSet, basename='detalle-receta')

medicamentos_router = DefaultRouter()
medicamentos_router.register(r'', MedicamentoViewSet, basename='medicamento')

router = DefaultRouter()
router.register(r'', RecetaViewSet, basename='receta')

urlpatterns = [
    path('detalles/', include(detalles_router.urls)),
    path('medicamentos/', include(medicamentos_router.urls)),
    path('', include(router.urls)),
]
