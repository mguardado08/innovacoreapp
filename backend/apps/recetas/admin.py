from django.contrib import admin

from .models import DetalleReceta, Medicamento, Receta

admin.site.register(Medicamento)
admin.site.register(Receta)
admin.site.register(DetalleReceta)
