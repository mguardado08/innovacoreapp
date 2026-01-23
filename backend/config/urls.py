from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/pacientes/', include('apps.pacientes.urls')),
    path('api/v1/consultas/', include('apps.consultas.urls')),
    path('api/v1/inmunizaciones/', include('apps.inmunizaciones.urls')),
    path('api/v1/examenes/', include('apps.examenes.urls')),
    path('api/v1/recetas/', include('apps.recetas.urls')),
    path('api/v1/crecimiento/', include('apps.crecimiento.urls')),
    path('api/v1/desarrollo/', include('apps.desarrollo.urls')),
]
