from django.contrib import admin

from .models import ExamenPaciente, TipoExamen

admin.site.register(TipoExamen)
admin.site.register(ExamenPaciente)
