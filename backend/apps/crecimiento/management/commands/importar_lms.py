import csv

from django.core.management.base import BaseCommand, CommandError

from apps.crecimiento.models import ReferenciaCrecimiento


class Command(BaseCommand):
    help = 'Importa referencias LMS desde CSV (sexo,metrica,edad_dias,l,m,s).'

    def add_arguments(self, parser):
        parser.add_argument('archivo_csv', type=str)

    def handle(self, *args, **options):
        ruta = options['archivo_csv']
        creados = 0
        actualizados = 0

        try:
            with open(ruta, newline='', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                required = {'sexo', 'metrica', 'edad_dias', 'l', 'm', 's'}
                if not required.issubset(reader.fieldnames or []):
                    raise CommandError(
                        'Columnas requeridas: sexo, metrica, edad_dias, l, m, s'
                    )

                for row in reader:
                    referencia, created = ReferenciaCrecimiento.objects.update_or_create(
                        sexo=row['sexo'].strip(),
                        metrica=row['metrica'].strip(),
                        edad_dias=int(row['edad_dias']),
                        defaults={
                            'l': row['l'],
                            'm': row['m'],
                            's': row['s'],
                        },
                    )
                    if created:
                        creados += 1
                    else:
                        actualizados += 1

        except FileNotFoundError as exc:
            raise CommandError(f'No se encontro el archivo: {ruta}') from exc
        except csv.Error as exc:
            raise CommandError(f'Error al leer CSV: {exc}') from exc

        self.stdout.write(
            self.style.SUCCESS(
                f'Importacion completada. Creados: {creados}. Actualizados: {actualizados}.'
            )
        )
