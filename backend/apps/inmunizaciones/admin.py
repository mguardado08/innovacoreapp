from django.contrib import admin

from .models import EsquemaVacuna, Vacuna, VacunacionPaciente

admin.site.register(Vacuna)
admin.site.register(EsquemaVacuna)
admin.site.register(VacunacionPaciente)
