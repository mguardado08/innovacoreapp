import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography
} from '@mui/material';

import CrudPage from '../../components/crud/CrudPage';
import FieldRenderer from '../../components/forms/FieldRenderer';
import { useLookup } from '../../hooks/useLookup';
import { createResource } from '../../services/api';
import { resources } from '../resources';
import { FieldConfig, ResourceConfig } from '../../types/resources';
import {
  pacienteLookup,
  persistPatientSelection,
  readStoredPatientSelection
} from '../patientSelection';

const wizardSteps = ['Datos de consulta', 'Examen fisico', 'Complementos'];
const WIZARD_DRAFT_KEY = 'innovacore:draft:consultas:integral-wizard';

type ConsultasWorkspaceProps = {
  mode: 'consultas' | 'examenesFisicos';
};

type WizardDraft = {
  wizardStep: number;
  consultaValues: Record<string, unknown>;
  examenValues: Record<string, unknown>;
  enableCrecimiento: boolean;
  enableDesarrollo: boolean;
  enableAplicaciones: boolean;
  crecimientoValues: Record<string, unknown>;
  desarrolloValues: Record<string, unknown>;
  aplicacionValues: Record<string, unknown>;
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

const formatApiError = (err: unknown) => {
  const message = err instanceof Error ? err.message : 'No fue posible guardar el wizard.';
  try {
    const parsed = JSON.parse(message) as Record<string, unknown>;
    const firstKey = Object.keys(parsed)[0];
    if (!firstKey) {
      return message;
    }
    const detail = parsed[firstKey];
    if (Array.isArray(detail)) {
      return `${firstKey}: ${detail.join(', ')}`;
    }
    return `${firstKey}: ${String(detail)}`;
  } catch (_error) {
    return message;
  }
};

const buildConsultaInitialValues = (selectedPatient: number | '') => ({
  ...(resources.consultas.defaultValues ?? {}),
  ...(selectedPatient ? { paciente: selectedPatient } : {})
});

const buildExamenPayload = (values: Record<string, unknown>) => {
  const payload: Record<string, unknown> = {};
  Object.entries(values).forEach(([key, value]) => {
    if (key === 'notas') {
      payload[key] = String(value ?? '');
      return;
    }
    if (value === '' || value === undefined || value === null) {
      return;
    }
    payload[key] = value;
  });
  return payload;
};

const buildOptionalPayload = (values: Record<string, unknown>) => {
  const payload: Record<string, unknown> = {};
  Object.entries(values).forEach(([key, value]) => {
    if (value === '' || value === undefined || value === null) {
      return;
    }
    payload[key] = value;
  });
  return payload;
};

const readWizardDraft = (): WizardDraft | null => {
  const raw = window.localStorage.getItem(WIZARD_DRAFT_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as WizardDraft;
    return parsed;
  } catch (_error) {
    window.localStorage.removeItem(WIZARD_DRAFT_KEY);
    return null;
  }
};

const ConsultasWorkspace = ({ mode }: ConsultasWorkspaceProps) => {
  const storedPatient = readStoredPatientSelection();
  const [initialDraft] = useState<WizardDraft | null>(readWizardDraft);
  const [selectedPatient, setSelectedPatient] = useState<number | ''>(storedPatient);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(initialDraft?.wizardStep ?? 0);
  const [wizardSaving, setWizardSaving] = useState(false);
  const [wizardError, setWizardError] = useState<string | null>(null);
  const [tableVersion, setTableVersion] = useState(0);
  const [consultaValues, setConsultaValues] = useState<Record<string, unknown>>(
    initialDraft?.consultaValues ?? buildConsultaInitialValues(storedPatient)
  );
  const [examenValues, setExamenValues] = useState<Record<string, unknown>>(initialDraft?.examenValues ?? {});
  const [enableCrecimiento, setEnableCrecimiento] = useState(initialDraft?.enableCrecimiento ?? false);
  const [enableDesarrollo, setEnableDesarrollo] = useState(initialDraft?.enableDesarrollo ?? false);
  const [enableAplicaciones, setEnableAplicaciones] = useState(initialDraft?.enableAplicaciones ?? false);
  const [crecimientoValues, setCrecimientoValues] = useState<Record<string, unknown>>(
    initialDraft?.crecimientoValues ?? {}
  );
  const [desarrolloValues, setDesarrolloValues] = useState<Record<string, unknown>>(
    initialDraft?.desarrolloValues ?? {}
  );
  const [aplicacionValues, setAplicacionValues] = useState<Record<string, unknown>>(
    initialDraft?.aplicacionValues ?? {}
  );
  const { options: patientOptions } = useLookup(pacienteLookup);

  const selectedPatientLabel = useMemo(
    () => patientOptions.find((option) => Number(option.value) === Number(selectedPatient))?.label ?? '',
    [patientOptions, selectedPatient]
  );

  const consultaWizardFields = useMemo(
    () =>
      resources.consultas.fields.map((field) =>
        withPacienteFieldFilter(field, selectedPatient, patientOptions)
      ),
    [patientOptions, selectedPatient]
  );

  const examenWizardFields = useMemo(
    () => resources.examenesFisicos.fields.filter((field) => field.name !== 'consulta'),
    []
  );

  const crecimientoWizardFields = useMemo(
    () =>
      resources.crecimiento.fields.filter(
        (field) => !['paciente', 'consulta', 'edad_dias', 'edad_corregida_dias'].includes(field.name)
      ),
    []
  );

  const desarrolloWizardFields = useMemo(
    () => resources.desarrollo.fields.filter((field) => field.name !== 'paciente'),
    []
  );

  const aplicacionesWizardFields = useMemo(
    () => resources.inmunizaciones.fields.filter((field) => !['paciente', 'consulta'].includes(field.name)),
    []
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

  useEffect(() => {
    if (mode !== 'consultas') {
      return;
    }
    const draft: WizardDraft = {
      wizardStep,
      consultaValues,
      examenValues,
      enableCrecimiento,
      enableDesarrollo,
      enableAplicaciones,
      crecimientoValues,
      desarrolloValues,
      aplicacionValues
    };
    window.localStorage.setItem(WIZARD_DRAFT_KEY, JSON.stringify(draft));
  }, [
    mode,
    wizardStep,
    consultaValues,
    examenValues,
    enableCrecimiento,
    enableDesarrollo,
    enableAplicaciones,
    crecimientoValues,
    desarrolloValues,
    aplicacionValues
  ]);

  const handleSelectPatient = (value: string) => {
    if (!value) {
      setSelectedPatient('');
      persistPatientSelection('');
      return;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return;
    }
    setSelectedPatient(parsed);
    persistPatientSelection(parsed);
  };

  const handleClearPatient = () => {
    setSelectedPatient('');
    persistPatientSelection('');
  };

  const openWizard = () => {
    setWizardError(null);
    setConsultaValues((prev) => {
      if (Object.keys(prev).length > 0) {
        return prev;
      }
      return buildConsultaInitialValues(selectedPatient);
    });
    setWizardOpen(true);
  };

  const closeWizard = () => {
    if (wizardSaving) {
      return;
    }
    setWizardOpen(false);
    setWizardError(null);
  };

  const handleWizardSubmit = async () => {
    const paciente = selectedPatient || consultaValues.paciente;
    if (!paciente) {
      setWizardError('Debes seleccionar un paciente para crear la consulta.');
      setWizardStep(0);
      return;
    }
    setWizardSaving(true);
    setWizardError(null);
    try {
      const consultaPayload = {
        ...consultaValues,
        paciente,
        estatus: consultaValues.estatus || 'ABIERTA'
      };
      const consultaResp = (await createResource('/consultas/', consultaPayload)) as Record<
        string,
        unknown
      >;
      const consultaId = consultaResp.id as string | number | undefined;
      if (!consultaId) {
        throw new Error('No se obtuvo el identificador de la consulta creada.');
      }
      await createResource('/consultas/examenes-fisicos/', {
        consulta: consultaId,
        ...buildExamenPayload(examenValues)
      });

      if (enableCrecimiento) {
        await createResource('/crecimiento/', {
          paciente,
          consulta: consultaId,
          ...buildOptionalPayload(crecimientoValues)
        });
      }

      if (enableDesarrollo) {
        await createResource('/desarrollo/', {
          paciente,
          ...buildOptionalPayload(desarrolloValues)
        });
      }

      if (enableAplicaciones) {
        await createResource('/inmunizaciones/', {
          paciente,
          consulta: consultaId,
          ...buildOptionalPayload(aplicacionValues)
        });
      }

      window.localStorage.removeItem(WIZARD_DRAFT_KEY);
      setConsultaValues(buildConsultaInitialValues(selectedPatient));
      setExamenValues({});
      setEnableCrecimiento(false);
      setEnableDesarrollo(false);
      setEnableAplicaciones(false);
      setCrecimientoValues({});
      setDesarrolloValues({});
      setAplicacionValues({});
      setWizardOpen(false);
      setWizardStep(0);
      setWizardError(null);
      setTableVersion((value) => value + 1);
    } catch (err) {
      setWizardError(formatApiError(err));
    } finally {
      setWizardSaving(false);
    }
  };

  const handleNext = async () => {
    if (wizardStep === 0) {
      const paciente = selectedPatient || consultaValues.paciente;
      if (!paciente) {
        setWizardError('Debes seleccionar un paciente para continuar.');
        return;
      }
      setWizardError(null);
      setWizardStep(1);
      return;
    }
    if (wizardStep === 1) {
      setWizardError(null);
      setWizardStep(2);
      return;
    }

    if (enableDesarrollo && !desarrolloValues.hito) {
      setWizardError('Para registrar hito por paciente debes seleccionar un hito.');
      return;
    }
    if (enableAplicaciones) {
      if (!aplicacionValues.vacuna || !aplicacionValues.numero_dosis || !aplicacionValues.fecha_aplicacion) {
        setWizardError(
          'Para registrar aplicacion debes completar vacuna, numero de dosis y fecha de aplicacion.'
        );
        return;
      }
    }
    if (enableCrecimiento && !crecimientoValues.fecha_medicion) {
      setWizardError('Para registrar medicion debes indicar fecha de medicion.');
      return;
    }

    await handleWizardSubmit();
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
        key={`${mode}-${selectedPatient === '' ? 'all' : selectedPatient}-${tableVersion}`}
        resource={currentResource}
        fixedFilters={fixedFilters}
        onCreateRequest={mode === 'consultas' ? openWizard : undefined}
      />

      <Dialog open={wizardOpen} onClose={closeWizard} maxWidth="md" fullWidth>
        <DialogTitle>Nueva consulta clinica integral</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
            El borrador se guarda automaticamente. Si cierras el modal o recargas la pagina, se conserva.
          </Alert>
          <Stepper activeStep={wizardStep} sx={{ mb: 3, mt: 1 }}>
            {wizardSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {wizardError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {wizardError}
            </Alert>
          )}

          {wizardStep === 0 && (
            <Grid container spacing={2}>
              {consultaWizardFields.map((field) => (
                <Grid item xs={12} md={field.grid?.md ?? 6} key={field.name}>
                  <FieldRenderer
                    field={field}
                    value={consultaValues[field.name]}
                    onChange={(name, value) =>
                      setConsultaValues((prev) => ({
                        ...prev,
                        [name]: value
                      }))
                    }
                    disabled={wizardSaving || (field.name === 'paciente' && selectedPatient !== '')}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {wizardStep === 1 && (
            <Grid container spacing={2}>
              {examenWizardFields.map((field) => (
                <Grid item xs={12} md={field.grid?.md ?? 6} key={field.name}>
                  <FieldRenderer
                    field={field}
                    value={examenValues[field.name]}
                    onChange={(name, value) =>
                      setExamenValues((prev) => ({
                        ...prev,
                        [name]: value
                      }))
                    }
                    disabled={wizardSaving}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {wizardStep === 2 && (
            <Stack spacing={2.5}>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enableCrecimiento}
                      onChange={(event) => setEnableCrecimiento(event.target.checked)}
                      disabled={wizardSaving}
                    />
                  }
                  label="Agregar medicion de crecimiento"
                />
                {enableCrecimiento && (
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    {crecimientoWizardFields.map((field) => (
                      <Grid item xs={12} md={field.grid?.md ?? 6} key={field.name}>
                        <FieldRenderer
                          field={field}
                          value={crecimientoValues[field.name]}
                          onChange={(name, value) =>
                            setCrecimientoValues((prev) => ({
                              ...prev,
                              [name]: value
                            }))
                          }
                          disabled={wizardSaving}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>

              <Divider />

              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enableDesarrollo}
                      onChange={(event) => setEnableDesarrollo(event.target.checked)}
                      disabled={wizardSaving}
                    />
                  }
                  label="Agregar hito por paciente (desarrollo)"
                />
                {enableDesarrollo && (
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    {desarrolloWizardFields.map((field) => (
                      <Grid item xs={12} md={field.grid?.md ?? 6} key={field.name}>
                        <FieldRenderer
                          field={field}
                          value={desarrolloValues[field.name]}
                          onChange={(name, value) =>
                            setDesarrolloValues((prev) => ({
                              ...prev,
                              [name]: value
                            }))
                          }
                          disabled={wizardSaving}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>

              <Divider />

              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enableAplicaciones}
                      onChange={(event) => setEnableAplicaciones(event.target.checked)}
                      disabled={wizardSaving}
                    />
                  }
                  label="Agregar aplicacion de vacuna"
                />
                {enableAplicaciones && (
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    {aplicacionesWizardFields.map((field) => (
                      <Grid item xs={12} md={field.grid?.md ?? 6} key={field.name}>
                        <FieldRenderer
                          field={field}
                          value={aplicacionValues[field.name]}
                          onChange={(name, value) =>
                            setAplicacionValues((prev) => ({
                              ...prev,
                              [name]: value
                            }))
                          }
                          disabled={wizardSaving}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWizard} disabled={wizardSaving}>
            Cancelar
          </Button>
          {wizardStep > 0 && (
            <Button onClick={() => setWizardStep((step) => step - 1)} disabled={wizardSaving}>
              Atras
            </Button>
          )}
          <Button variant="contained" onClick={handleNext} disabled={wizardSaving}>
            {wizardStep === wizardSteps.length - 1 ? 'Guardar registro integral' : 'Siguiente'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultasWorkspace;
