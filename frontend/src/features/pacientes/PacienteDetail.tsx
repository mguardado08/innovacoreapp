import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';

import CrudPage from '../../components/crud/CrudPage';
import { listResource } from '../../services/api';
import { resources } from '../resources';
import { formatDate } from '../../utils/format';
import GrowthModule from '../crecimiento/GrowthModule';

const TabPanel = ({ children, value, index }: { children: JSX.Element; value: number; index: number }) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ mt: 3 }}>
    {value === index && children}
  </Box>
);

const PacienteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [patient, setPatient] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
    listResource(`/pacientes/${id}/`)
      .then((response) => {
        setPatient(response as Record<string, unknown>);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar el paciente'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !patient) {
    return (
      <Alert severity="error">{error ?? 'No se encontro el paciente solicitado.'}</Alert>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/pacientes')} sx={{ mb: 2 }}>
        Volver a pacientes
      </Button>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
                {patient.apellidos} {patient.nombres}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Sexo: {patient.sexo ?? '-'} | Nacimiento:{' '}
                {formatDate(patient.fecha_nacimiento as string)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CURP: {patient.curp ?? '-'} | Tipo de sangre: {patient.tipo_sangre ?? '-'}
              </Typography>
            </Box>
            <Stack spacing={1} sx={{ minWidth: 220 }}>
              <Typography variant="overline" color="text.secondary">
                Estado
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {patient.activo ? 'Activo' : 'Inactivo'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prematuro: {patient.es_prematuro ? 'Si' : 'No'}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: '1px solid #e9dfd2' }}
      >
        <Tab label="Historia" />
        <Tab label="Responsables" />
        <Tab label="Seguros" />
        <Tab label="Consultas" />
        <Tab label="Inmunizaciones" />
        <Tab label="Examenes" />
        <Tab label="Recetas" />
        <Tab label="Crecimiento" />
        <Tab label="Desarrollo" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <CrudPage
          embedded
          titleOverride="Historia clinica"
          resource={resources.historias}
          fixedFilters={{ paciente: Number(id) }}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <CrudPage
          embedded
          titleOverride="Responsables"
          resource={resources.responsables}
          fixedFilters={{ paciente: Number(id) }}
        />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <CrudPage
          embedded
          titleOverride="Seguros"
          resource={resources.seguros}
          fixedFilters={{ paciente: Number(id) }}
        />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <CrudPage
          embedded
          titleOverride="Consultas"
          resource={resources.consultas}
          fixedFilters={{ paciente: Number(id) }}
        />
      </TabPanel>
      <TabPanel value={tab} index={4}>
        <CrudPage
          embedded
          titleOverride="Inmunizaciones"
          resource={resources.inmunizaciones}
          fixedFilters={{ paciente: Number(id) }}
        />
      </TabPanel>
      <TabPanel value={tab} index={5}>
        <CrudPage
          embedded
          titleOverride="Examenes"
          resource={resources.examenes}
          fixedFilters={{ paciente: Number(id) }}
        />
      </TabPanel>
      <TabPanel value={tab} index={6}>
        <CrudPage
          embedded
          titleOverride="Recetas"
          resource={resources.recetas}
          fixedFilters={{ paciente: Number(id) }}
        />
      </TabPanel>
      <TabPanel value={tab} index={7}>
        <GrowthModule embedded fixedPatientId={Number(id)} />
      </TabPanel>
      <TabPanel value={tab} index={8}>
        <CrudPage
          embedded
          titleOverride="Desarrollo"
          resource={resources.desarrollo}
          fixedFilters={{ paciente: Number(id) }}
        />
      </TabPanel>
    </Box>
  );
};

export default PacienteDetail;
