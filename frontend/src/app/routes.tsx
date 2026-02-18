import { Routes, Route } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import Dashboard from '../features/dashboard/Dashboard';
import ResourcePage from '../features/ResourcePage';
import { resources } from '../features/resources';
import PacienteDetail from '../features/pacientes/PacienteDetail';

const NotFound = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      No encontrado
    </Typography>
    <Typography color="text.secondary">
      La ruta solicitada no existe. Usa el menu lateral para navegar.
    </Typography>
  </Box>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/pacientes" element={<ResourcePage resource={resources.pacientes} />} />
    <Route path="/pacientes/:id" element={<PacienteDetail />} />
    <Route path="/pacientes/responsables" element={<ResourcePage resource={resources.responsables} />} />
    <Route path="/pacientes/seguros" element={<ResourcePage resource={resources.seguros} />} />
    <Route path="/pacientes/historias" element={<ResourcePage resource={resources.historias} />} />
    <Route path="/consultas" element={<ResourcePage resource={resources.consultas} />} />
    <Route
      path="/consultas/examenes-fisicos"
      element={<ResourcePage resource={resources.examenesFisicos} />}
    />
    <Route path="/inmunizaciones" element={<ResourcePage resource={resources.inmunizaciones} />} />
    <Route
      path="/inmunizaciones/vacunas"
      element={<ResourcePage resource={resources.vacunas} />}
    />
    <Route
      path="/inmunizaciones/esquemas"
      element={<ResourcePage resource={resources.esquemasVacuna} />}
    />
    <Route path="/examenes" element={<ResourcePage resource={resources.examenes} />} />
    <Route path="/examenes/tipos" element={<ResourcePage resource={resources.tiposExamen} />} />
    <Route path="/recetas" element={<ResourcePage resource={resources.recetas} />} />
    <Route path="/recetas/detalles" element={<ResourcePage resource={resources.detallesReceta} />} />
    <Route
      path="/recetas/medicamentos"
      element={<ResourcePage resource={resources.medicamentos} />}
    />
    <Route path="/crecimiento" element={<ResourcePage resource={resources.crecimiento} />} />
    <Route
      path="/crecimiento/referencias"
      element={<ResourcePage resource={resources.referenciasCrecimiento} />}
    />
    <Route path="/desarrollo" element={<ResourcePage resource={resources.desarrollo} />} />
    <Route path="/desarrollo/hitos" element={<ResourcePage resource={resources.hitos} />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
