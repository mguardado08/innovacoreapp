import { useMemo, useState } from 'react';
import { Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from '@mui/material';

import CrudPage from '../components/crud/CrudPage';
import { useLookup } from '../hooks/useLookup';
import { FieldConfig, ResourceConfig } from '../types/resources';
import {
  pacienteLookup,
  persistPatientSelection,
  readStoredPatientSelection
} from './patientSelection';

type PatientScopedResourcePageProps = {
  resource: ResourceConfig;
  filterConsultaLookup?: boolean;
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

const withConsultaLookupFilter = (
  field: FieldConfig,
  selectedPatient: number | '',
  enabled?: boolean
): FieldConfig => {
  if (!enabled || field.name !== 'consulta' || !field.lookup) {
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

const PatientScopedResourcePage = ({
  resource,
  filterConsultaLookup = false
}: PatientScopedResourcePageProps) => {
  const [selectedPatient, setSelectedPatient] = useState<number | ''>(readStoredPatientSelection);
  const [tableVersion, setTableVersion] = useState(0);
  const { options: patientOptions } = useLookup(pacienteLookup);

  const selectedPatientLabel = useMemo(
    () => patientOptions.find((option) => Number(option.value) === Number(selectedPatient))?.label ?? '',
    [patientOptions, selectedPatient]
  );

  const preparedResource = useMemo<ResourceConfig>(
    () => ({
      ...resource,
      filters: resource.filters?.map((field) =>
        withConsultaLookupFilter(
          withPacienteFieldFilter(field, selectedPatient, patientOptions),
          selectedPatient,
          filterConsultaLookup
        )
      ),
      fields: resource.fields.map((field) =>
        withConsultaLookupFilter(
          withPacienteFieldFilter(field, selectedPatient, patientOptions),
          selectedPatient,
          filterConsultaLookup
        )
      )
    }),
    [filterConsultaLookup, patientOptions, resource, selectedPatient]
  );

  const fixedFilters = useMemo(() => {
    if (!selectedPatient) {
      return undefined;
    }
    return { paciente: selectedPatient };
  }, [selectedPatient]);

  const handleSelectPatient = (value: string) => {
    if (!value) {
      setSelectedPatient('');
      persistPatientSelection('');
      setTableVersion((value) => value + 1);
      return;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }
    setSelectedPatient(parsed);
    persistPatientSelection(parsed);
    setTableVersion((value) => value + 1);
  };

  const handleClearPatient = () => {
    setSelectedPatient('');
    persistPatientSelection('');
    setTableVersion((value) => value + 1);
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
                Esta seleccion se reutiliza en los modulos clinicos.
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
              Sin paciente preseleccionado. Se mostraran todos los registros.
            </Alert>
          )}
        </CardContent>
      </Card>

      <CrudPage
        key={`${resource.key}-${selectedPatient === '' ? 'all' : selectedPatient}-${tableVersion}`}
        resource={preparedResource}
        fixedFilters={fixedFilters}
      />
    </Box>
  );
};

export default PatientScopedResourcePage;
