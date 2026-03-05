import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EventNoteIcon from '@mui/icons-material/EventNote';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ScienceIcon from '@mui/icons-material/Science';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { listResource } from '../../services/api';

const actions = [
  { label: 'Nuevo paciente', path: '/pacientes', icon: <PeopleAltIcon /> },
  { label: 'Nueva consulta', path: '/consultas', icon: <EventNoteIcon /> },
  { label: 'Registrar vacuna', path: '/inmunizaciones', icon: <VaccinesIcon /> },
  { label: 'Agregar examen', path: '/examenes', icon: <ScienceIcon /> },
  { label: 'Crear receta', path: '/recetas', icon: <ReceiptLongIcon /> },
  { label: 'Medicion crecimiento', path: '/crecimiento', icon: <ShowChartIcon /> }
];

const parseRows = (response: unknown) => {
  if (Array.isArray(response)) {
    return response as Record<string, unknown>[];
  }
  if (response && typeof response === 'object' && 'results' in response) {
    return (response as { results: Record<string, unknown>[] }).results ?? [];
  }
  return [] as Record<string, unknown>[];
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [patientsCount, setPatientsCount] = useState(0);
  const [openConsultsCount, setOpenConsultsCount] = useState(0);
  const [vaccinationsCount, setVaccinationsCount] = useState(0);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [patientsResp, consultsResp, vaccinesResp] = await Promise.all([
          listResource('/pacientes/', { activo: true }),
          listResource('/consultas/', { estatus: 'ABIERTA' }),
          listResource('/inmunizaciones/')
        ]);
        setPatientsCount(parseRows(patientsResp).length);
        setOpenConsultsCount(parseRows(consultsResp).length);
        setVaccinationsCount(parseRows(vaccinesResp).length);
      } catch (_err) {
        setPatientsCount(0);
        setOpenConsultsCount(0);
        setVaccinationsCount(0);
      }
    };
    loadMetrics();
  }, []);

  const highlights = useMemo(
    () => [
      {
        title: 'Expedientes activos',
        value: String(patientsCount),
        description: 'Pacientes activos registrados.'
      },
      {
        title: 'Consultas abiertas',
        value: String(openConsultsCount),
        description: 'Pendientes de cierre o plan.'
      },
      {
        title: 'Vacunas aplicadas',
        value: String(vaccinationsCount),
        description: 'Aplicaciones registradas en el sistema.'
      }
    ],
    [patientsCount, openConsultsCount, vaccinationsCount]
  );

  return (
    <Box>
      <Box sx={{ mb: 5, pt: { xs: 2, md: 4 }, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
          Centro clinico pediatrico
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: 'text.secondary', maxWidth: 860, mx: 'auto', lineHeight: 1.35 }}
        >
          Gestiona pacientes, consultas y seguimiento integral con herramientas enfocadas en
          bienestar pediatrico.
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mt: 3, justifyContent: 'center' }}
        >
          <Button variant="contained" color="secondary" onClick={() => navigate('/pacientes')}>
            Registrar paciente
          </Button>
          <Button variant="contained" onClick={() => navigate('/consultas')}>
            Ver consultas
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {highlights.map((item) => (
          <Grid item xs={12} md={4} key={item.title}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.84)',
                border: '1px solid rgba(15, 76, 92, 0.10)',
                boxShadow: '0 8px 22px rgba(22, 53, 71, 0.08)',
                backdropFilter: 'blur(2px)'
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {item.title}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {item.value}
                </Typography>
                <Typography color="text.secondary">{item.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Acciones rapidas
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={4} key={action.label}>
            <Card
              onClick={() => navigate(action.path)}
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: 'rgba(255, 255, 255, 0.84)',
                border: '1px solid rgba(15, 76, 92, 0.10)',
                boxShadow: '0 8px 22px rgba(22, 53, 71, 0.08)',
                backdropFilter: 'blur(2px)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(22, 53, 71, 0.12)'
                }
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ color: 'primary.main' }}>{action.icon}</Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {action.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accede al modulo correspondiente.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
