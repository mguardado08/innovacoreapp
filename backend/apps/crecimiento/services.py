from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from math import exp

from .models import MedicionCrecimiento, ReferenciaCrecimiento


@dataclass
class GrowthCalculation:
    edad_dias: int | None
    imc: Decimal | None
    z_score: Decimal | None
    clasificacion: str


def calcular_edad_dias(fecha_nacimiento: date, fecha_medicion: date) -> int:
    return (fecha_medicion - fecha_nacimiento).days


def calcular_imc(peso_kg: Decimal | None, talla_cm: Decimal | None) -> Decimal | None:
    if not peso_kg or not talla_cm:
        return None
    if talla_cm <= 0:
        return None
    talla_m = talla_cm / Decimal('100')
    if talla_m <= 0:
        return None
    return (peso_kg / (talla_m * talla_m)).quantize(Decimal('0.01'))


def metrica_por_indicador(indicador: str) -> str:
    mapping = {
        MedicionCrecimiento.Indicador.PESO_EDAD: ReferenciaCrecimiento.Metrica.PESO,
        MedicionCrecimiento.Indicador.TALLA_EDAD: ReferenciaCrecimiento.Metrica.TALLA,
        MedicionCrecimiento.Indicador.IMC_EDAD: ReferenciaCrecimiento.Metrica.IMC,
    }
    return mapping.get(indicador, ReferenciaCrecimiento.Metrica.TALLA)


def indicador_sugerido(edad_dias: int | None) -> str:
    if edad_dias is None:
        return MedicionCrecimiento.Indicador.TALLA_EDAD
    edad_anios = edad_dias / 365.25
    if edad_anios >= 5:
        return MedicionCrecimiento.Indicador.IMC_EDAD
    return MedicionCrecimiento.Indicador.TALLA_EDAD


def valor_indicador(
    indicador: str,
    peso_kg: Decimal | None,
    talla_cm: Decimal | None,
    imc: Decimal | None,
) -> Decimal | None:
    if indicador == MedicionCrecimiento.Indicador.PESO_EDAD:
        return peso_kg
    if indicador == MedicionCrecimiento.Indicador.IMC_EDAD:
        return imc
    return talla_cm


def calcular_z_score(valor: Decimal, l: Decimal, m: Decimal, s: Decimal) -> Decimal | None:
    if valor <= 0 or m <= 0 or s <= 0:
        return None
    valor_f = float(valor)
    l_f = float(l)
    m_f = float(m)
    s_f = float(s)
    if l_f == 0:
        z_value = (float((valor / m).ln())) / s_f
    else:
        z_value = ((valor_f / m_f) ** l_f - 1) / (l_f * s_f)
    return Decimal(str(round(z_value, 3)))


def calcular_valor_z(m: Decimal, l: Decimal, s: Decimal, z: int) -> Decimal | None:
    if m <= 0 or s <= 0:
        return None
    m_f = float(m)
    l_f = float(l)
    s_f = float(s)
    if l_f == 0:
        value = m_f * exp(s_f * z)
    else:
        inner = 1 + (l_f * s_f * z)
        if inner <= 0:
            return None
        value = m_f * (inner ** (1 / l_f))
    return Decimal(str(round(value, 3)))


def clasificar(indicador: str, z_score: Decimal | None) -> str:
    if z_score is None:
        return ''

    z = float(z_score)
    if indicador == MedicionCrecimiento.Indicador.IMC_EDAD:
        if z < -3:
            return 'Delgadez severa'
        if -3 <= z < -2:
            return 'Delgadez'
        if -2 <= z <= 1:
            return 'Normal'
        if 1 < z <= 2:
            return 'Sobrepeso'
        return 'Obesidad'

    if indicador == MedicionCrecimiento.Indicador.TALLA_EDAD:
        if z < -2:
            return 'Talla baja'
        return 'Normal'

    if indicador == MedicionCrecimiento.Indicador.PESO_EDAD:
        if z < -2:
            return 'Bajo peso'
        if z > 2:
            return 'Peso elevado'
        return 'Normal'

    return ''


def calcular_metricas(medicion: MedicionCrecimiento) -> GrowthCalculation:
    edad_dias = medicion.edad_dias
    if edad_dias is None and medicion.paciente_id and medicion.fecha_medicion:
        edad_dias = calcular_edad_dias(medicion.paciente.fecha_nacimiento, medicion.fecha_medicion)

    imc = calcular_imc(medicion.peso_kg, medicion.talla_cm)

    indicador = medicion.indicador or indicador_sugerido(edad_dias)
    if not medicion.indicador:
        medicion.indicador = indicador

    valor = valor_indicador(indicador, medicion.peso_kg, medicion.talla_cm, imc)
    z_score = None
    if edad_dias is not None and valor is not None:
        queryset = ReferenciaCrecimiento.objects.filter(
            sexo=medicion.paciente.sexo,
            metrica=metrica_por_indicador(indicador),
        ).only('l', 'm', 's', 'edad_dias')
        referencia = queryset.filter(edad_dias=edad_dias).first()
        if referencia is None:
            lower = queryset.filter(edad_dias__lte=edad_dias).order_by('-edad_dias').first()
            upper = queryset.filter(edad_dias__gte=edad_dias).order_by('edad_dias').first()
            if lower and upper:
                lower_gap = abs(edad_dias - lower.edad_dias)
                upper_gap = abs(upper.edad_dias - edad_dias)
                referencia = lower if lower_gap <= upper_gap else upper
            else:
                referencia = lower or upper
        if referencia:
            z_score = calcular_z_score(valor, referencia.l, referencia.m, referencia.s)

    clasificacion_valor = clasificar(indicador, z_score)
    return GrowthCalculation(edad_dias=edad_dias, imc=imc, z_score=z_score, clasificacion=clasificacion_valor)
