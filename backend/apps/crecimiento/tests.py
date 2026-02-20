from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.crecimiento.models import MedicionCrecimiento, ReferenciaCrecimiento
from apps.pacientes.models import Paciente


class CrecimientoCalculoAPITests(APITestCase):
    def setUp(self):
        self.paciente = Paciente.objects.create(
            nombres='Ana',
            apellidos='Lopez',
            sexo='F',
            fecha_nacimiento='2020-01-01',
        )
        ReferenciaCrecimiento.objects.create(
            sexo='F',
            edad_dias=2192,
            metrica='IMC',
            l=Decimal('1.0'),
            m=Decimal('15.0'),
            s=Decimal('0.10'),
        )
        ReferenciaCrecimiento.objects.create(
            sexo='F',
            edad_dias=2000,
            metrica='IMC',
            l=Decimal('1.0'),
            m=Decimal('14.8'),
            s=Decimal('0.10'),
        )

    def test_create_medicion_calcula_imc_y_zscore(self):
        url = reverse('medicion-list')
        payload = {
            'paciente': self.paciente.id,
            'fecha_medicion': '2026-01-01',
            'peso_kg': '20.00',
            'talla_cm': '110.00',
            'indicador': 'IMC_EDAD',
        }
        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        medicion = MedicionCrecimiento.objects.get(id=response.data['id'])
        self.assertEqual(medicion.imc, Decimal('16.53'))
        self.assertIsNotNone(medicion.z_score)
        self.assertEqual(medicion.clasificacion, 'Sobrepeso')

    def test_chart_data_devuelve_curvas_y_serie(self):
        medicion = MedicionCrecimiento.objects.create(
            paciente=self.paciente,
            fecha_medicion='2026-01-01',
            peso_kg=Decimal('20.00'),
            talla_cm=Decimal('110.00'),
            indicador='IMC_EDAD',
            edad_dias=2192,
            imc=Decimal('16.53'),
            z_score=Decimal('1.020'),
            clasificacion='Sobrepeso',
        )
        url = reverse('medicion-chart-data')
        response = self.client.get(url, {'paciente': self.paciente.id, 'indicador': 'IMC_EDAD'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['patient_series']) >= 1)
        self.assertTrue(len(response.data['curves']) >= 1)
        self.assertEqual(response.data['patient_series'][0]['id'], medicion.id)
