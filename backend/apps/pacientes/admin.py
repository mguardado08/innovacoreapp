from django.contrib import admin

from .models import HistoriaClinica, Paciente, ResponsablePaciente, SeguroPaciente

admin.site.register(Paciente)
admin.site.register(ResponsablePaciente)
admin.site.register(SeguroPaciente)
admin.site.register(HistoriaClinica)
