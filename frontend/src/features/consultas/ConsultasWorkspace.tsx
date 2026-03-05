import { useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';

import CrudPage from '../../components/crud/CrudPage';
import { useLookup } from '../../hooks/useLookup';
import { resources } from '../resources';
import { FieldConfig, ResourceConfig } from '../../types/resources';

const STORAGE_KEY = 'innovacore:consultas:selectedPatient';

type ConsultasWorkspaceProps = {
  mode: 'consultas' | 'examenesFisicos';
};

const pacienteLookup = {
  endpoint: '/pacientes/',
  labelFn: (item: Record<string, unknown>) =>
    `${item.apellidos ?? ''} ${item.nombres ?? ''}`.trim()
};

const parseStoredPatient = () => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return '';
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : '';
};

const withConsultaLookupFilter = (
  field: FieldConfig,
  selectedPatient: number | ''
): FieldConfig => {
  if (field.name !== 'consulta' || !field.lookup) {
    return field;
  }
  return {
    ...field,
    lookup: {
      ...field.lookup,
      params: selectedPatient ? { paciente: selectedPatient } : undefined
    }
  };
};

const withPacienteFieldFilter = (
  field: FieldConfig,
  selectedPatient: number | '',
  patientOptions: { label: string; value: string | number }[]
): FieldConfig => {
  if (field.name !== 'paciente') {
    return field;
  }
  if (!selectedPatient) {
    return field;
  }
  const selectedOption = patientOptions.find(
    (option) => Number(option.value) === Number(selectedPatient)
  );
  if (!selectedOption) {
    return field;
  }
  return {
    ...field,
    options: [selectedOption]
  };
};

const ConsultasWorkspace = ({ mode }: ConsultasWorkspaceProps) => {
  const [selectedPatient, setSelectedPatient] = useState<number | ''>(parseStoredPatient);
  const { options: patientOptions } = useLookup(pacienteLookup);

  const selectedPatientLabel = useMemo(
    () => patientOptions.find((option) => Number(option.value) === Number(selectedPatient))?.label ?? '',
    [patientOptions, selectedPatient]
  );

  const currentResource: ResourceConfig = useMemo(() => {
    if (mode === 'consultas') {
      return {
        ...resources.consultas,
        filters: resources.consultas.filters?.map((field) =>
          withPacienteFieldFilter(field, selectedPatient, patientOptions)
        ),
        fields: resources.consultas.fields.map((field) =>
          withPacienteFieldFilter(field, selectedPatient, patientOptions)
        )
      };
    }
    return {
      ...resources.examenesFisicos,
      filters: resources.examenesFisicos.filters?.map((field) =>
        withConsultaLookupFilter(field, selectedPatient)
      ),
      fields: resources.examenesFisicos.fields.map((field) =>
        withConsultaLookupFilter(field, selectedPatient)
      )
    };
  }, [mode, patientOptions, selectedPatient]);

  const fixedFilters = useMemo(() => {
    if (!selectedPatient) {
      return undefined;
    }
    return { paciente: selectedPatient };
  }, [selectedPatient]);

  const handleSelectPatient = (value: string) => {
    if (!value) {
      setSelectedPatient('');
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }
    setSelectedPatient(parsed);
    window.localStorage.setItem(STORAGE_KEY, String(parsed));
  };

  const handleClearPatient = () => {
    setSelectedPatient('');
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <Box>
      <Card sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.88)' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                Selecciona paciente
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Esta seleccion se reutiliza en Nueva consulta y Nuevo examen fisico.
              </Typography>
            </Box>
            <TextField
              select
              size="small"
              label="Paciente preseleccionado"
              value={selectedPatient === '' ? '' : String(selectedPatient)}
              onChange={(event) => handleSelectPatient(event.target.value)}
              sx={{ minWidth: { xs: '100%', md: 360 } }}
            >
              <MenuItem value="">Sin preseleccion</MenuItem>
              {patientOptions.map((option) => (
                <MenuItem key={option.value} value={String(option.value)}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            {selectedPatient !== '' && (
              <Button variant="outlined" onClick={handleClearPatient}>
                Quitar preseleccion
              </Button>
            )}
          </Stack>
          {selectedPatient !== '' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Paciente seleccionado: {selectedPatientLabel || `ID ${selectedPatient}`}.
            </Alert>
          )}
          {selectedPatient === '' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Sin paciente preseleccionado. Los formularios mostraran todos los datos disponibles.
            </Alert>
          )}
        </CardContent>
      </Card>

      <CrudPage
        key={`${mode}-${selectedPatient === '' ? 'all' : selectedPatient}`}
        resource={currentResource}
        fixedFilters={fixedFilters}
      />
    </Box>
  );
};

export default ConsultasWorkspace;
