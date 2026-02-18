from django.conf import settings
from django.db import models
from django.utils import timezone


class BorradoLogicoManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(esta_borrado=False)


class ModeloConTiempos(models.Model):
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ModeloBorradoLogico(models.Model):
    esta_borrado = models.BooleanField(default=False)
    borrado_en = models.DateTimeField(null=True, blank=True)
    borrado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='%(app_label)s_%(class)s_borrados',
        related_query_name='%(app_label)s_%(class)s_borrado',
    )

    objects = BorradoLogicoManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False, usuario=None):
        if self.esta_borrado:
            return
        self.esta_borrado = True
        self.borrado_en = timezone.now()
        if usuario is not None:
            self.borrado_por = usuario
        self.save(update_fields=['esta_borrado', 'borrado_en', 'borrado_por'])

    def hard_delete(self, using=None, keep_parents=False):
        return super().delete(using=using, keep_parents=keep_parents)


class ModeloBaseClinico(ModeloConTiempos, ModeloBorradoLogico):
    class Meta:
        abstract = True
