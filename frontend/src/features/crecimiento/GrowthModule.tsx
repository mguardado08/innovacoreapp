import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import PageHeader from '../../components/common/PageHeader';
import { createResource, listResource } from '../../services/api';
import { formatDate } from '../../utils/format';
import GrowthChart from './GrowthChart';

type GrowthModuleProps = {
  embedded?: boolean;
  fixedPatientId?: number;
};

type Medicion = {
  id: number;
  fecha_medicion: string;
  edad_dias: number | null;
  peso_kg: string | null;
  talla_cm: string | null;
  imc: string | null;
  indicador: string;
  z_score: string | null;
  clasificacion: string;
};

type ChartPayload = {
  patient_series: {
    id: number;
    edad_dias: number;
    valor: number;
    z_score: number | null;
    clasificacion: string;
  }[];
  curves: { edad_dias: number; [key: string]: number | null }[];
};

const indicatorLabels: Record<string, string> = {
  IMC_EDAD: 'IMC para la edad',
  TALLA_EDAD: 'Talla para la edad',
  PESO_EDAD: 'Peso para la edad'
};

const unitByIndicator: Record<string, string> = {
  IMC_EDAD: 'kg/m2',
  TALLA_EDAD: 'cm',
  PESO_EDAD: 'kg'
};

const GrowthModule = ({ embedded = false, fixedPatientId }: GrowthModuleProps) => {
  const [pacientes, setPacientes] = useState<{ id: number; nombre: string }[]>([]);
  const [consultas, setConsultas] = useState<{ id: number; label: string }[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number | ''>(fixedPatientId ?? '');
  const [selectedIndicator, setSelectedIndicator] = useState('IMC_EDAD');
  const [rows, setRows] = useState<Medicion[]>([]);
  const [chartData, setChartData] = useState<ChartPayload>({ patient_series: [], curves: [] });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    fecha_medicion: new Date().toISOString().slice(0, 10),
    peso_kg: '',
    talla_cm: '',
    consulta: '',
    indicador: 'IMC_EDAD'
  });

  const canLoad = selectedPatient !== '';

  const loadLookups = async () => {
    try {
      const [pacientesResp, consultasResp] = await Promise.all([
        listResource('/pacientes/'),
        listResource('/consultas/')
      ]);
      const pacientesRows = Array.isArray(pacientesResp)
        ? pacientesResp
        : (pacientesResp as { results?: Record<string, unknown>[] }).results ?? [];
      const consultasRows = Array.isArray(consultasResp)
        ? consultasResp
        : (consultasResp as { results?: Record<string, unknown>[] }).results ?? [];

      setPacientes(
        pacientesRows.map((item) => ({
          id: Number(item.id),
          nombre: `${item.apellidos ?? ''} ${item.nombres ?? ''}`.trim()
        }))
      );
      setConsultas(
        consultasRows.map((item) => ({
          id: Number(item.id),
          label: `Consulta ${item.id} - ${String(item.fecha_visita ?? '').slice(0, 10)}`
        }))
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar catalogos');
    }
  };

  const loadGrowth = async () => {
    if (!canLoad) {
      return;
    }
    try {
      const [medicionesResp, chartResp] = await Promise.all([
        listResource('/crecimiento/', {
          paciente: Number(selectedPatient),
          indicador: selectedIndicator
        }),
        listResource('/crecimiento/chart-data/', {
          paciente: Number(selectedPatient),
          indicador: selectedIndicator
        })
      ]);
      const mediciones = Array.isArray(medicionesResp)
        ? medicionesResp
        : (medicionesResp as { results?: Medicion[] }).results ?? [];
      setRows(mediciones as Medicion[]);
      setChartData(chartResp as ChartPayload);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar crecimiento');
    }
  };

  useEffect(() => {
    loadLookups();
  }, []);

  useEffect(() => {
    if (fixedPatientId) {
      setSelectedPatient(fixedPatientId);
    }
  }, [fixedPatientId]);

  useEffect(() => {
    loadGrowth();
  }, [selectedPatient, selectedIndicator]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedPatient) {
      setError('Selecciona un paciente para registrar la medicion.');
      return;
    }
    try {
      await createResource('/crecimiento/', {
        paciente: selectedPatient,
        consulta: formValues.consulta || null,
        fecha_medicion: formValues.fecha_medicion,
        peso_kg: formValues.peso_kg || null,
        talla_cm: formValues.talla_cm || null,
        indicador: formValues.indicador
      });
      setSuccess('Medicion guardada correctamente.');
      setFormValues((prev) => ({ ...prev, peso_kg: '', talla_cm: '' }));
      await loadGrowth();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la medicion');
    }
  };

  const summary = useMemo(() => {
    if (!rows.length) {
      return 'Sin mediciones registradas.';
    }
    const last = rows[0];
    return `Ultima medicion ${formatDate(last.fecha_medicion)} | Z-score ${last.z_score ?? '-'} | ${last.clasificacion || 'Sin clasificacion'}`;
  }, [rows]);

  return (
    <Box>
      {!embedded && (
        <PageHeader
          title="Curvas de crecimiento"
          description="Seguimiento longitudinal con calculo de IMC, Z-score y clasificacion automatica."
        />
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Paciente"
            value={selectedPatient}
            onChange={(event) => setSelectedPatient(Number(event.target.value))}
            disabled={Boolean(fixedPatientId)}
          >
            {pacientes.map((paciente) => (
              <MenuItem key={paciente.id} value={paciente.id}>
                {paciente.nombre}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Indicador"
            value={selectedIndicator}
            onChange={(event) => {
              setSelectedIndicator(event.target.value);
              setFormValues((prev) => ({ ...prev, indicador: event.target.value }));
            }}
          >
            {Object.entries(indicatorLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Resumen
            </Typography>
            <Typography>{summary}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Nueva medicion
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              type="date"
              fullWidth
              label="Fecha"
              InputLabelProps={{ shrink: true }}
              value={formValues.fecha_medicion}
              onChange={(event) =>
                setFormValues((prev) => ({ ...prev, fecha_medicion: event.target.value }))
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              type="number"
              fullWidth
              label="Peso (kg)"
              value={formValues.peso_kg}
              onChange={(event) => setFormValues((prev) => ({ ...prev, peso_kg: event.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              type="number"
              fullWidth
              label="Talla (cm)"
              value={formValues.talla_cm}
              onChange={(event) => setFormValues((prev) => ({ ...prev, talla_cm: event.target.value }))}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Consulta (opcional)"
              value={formValues.consulta}
              onChange={(event) => setFormValues((prev) => ({ ...prev, consulta: event.target.value }))}
            >
              <MenuItem value="">Sin consulta</MenuItem>
              {consultas.map((consulta) => (
                <MenuItem key={consulta.id} value={consulta.id}>
                  {consulta.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Indicador"
              value={formValues.indicador}
              onChange={(event) => setFormValues((prev) => ({ ...prev, indicador: event.target.value }))}
            >
              {Object.entries(indicatorLabels).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained">
            Guardar medicion
          </Button>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadGrowth}>
            Actualizar
          </Button>
        </Stack>
      </Paper>

      <GrowthChart
        curves={chartData.curves}
        patientSeries={chartData.patient_series}
        unitLabel={unitByIndicator[selectedIndicator] ?? 'valor'}
      />

      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Historico longitudinal
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Edad (dias)</TableCell>
              <TableCell>Peso (kg)</TableCell>
              <TableCell>Talla (cm)</TableCell>
              <TableCell>IMC</TableCell>
              <TableCell>Indicador</TableCell>
              <TableCell>Z-score</TableCell>
              <TableCell>Clasificacion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{formatDate(row.fecha_medicion)}</TableCell>
                <TableCell>{row.edad_dias ?? '-'}</TableCell>
                <TableCell>{row.peso_kg ?? '-'}</TableCell>
                <TableCell>{row.talla_cm ?? '-'}</TableCell>
                <TableCell>{row.imc ?? '-'}</TableCell>
                <TableCell>{indicatorLabels[row.indicador] ?? row.indicador}</TableCell>
                <TableCell>{row.z_score ?? '-'}</TableCell>
                <TableCell>{row.clasificacion || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default GrowthModule;
