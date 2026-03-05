export const PATIENT_SELECTION_STORAGE_KEY = 'innovacore:consultas:selectedPatient';

export const pacienteLookup = {
  endpoint: '/pacientes/',
  labelFn: (item: Record<string, unknown>) =>
    `${item.apellidos ?? ''} ${item.nombres ?? ''}`.trim()
};

export const readStoredPatientSelection = () => {
  const raw = window.localStorage.getItem(PATIENT_SELECTION_STORAGE_KEY);
  if (!raw) {
    return '' as const;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : ('' as const);
};

export const persistPatientSelection = (patientId: number | '') => {
  if (!patientId) {
    window.localStorage.removeItem(PATIENT_SELECTION_STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(PATIENT_SELECTION_STORAGE_KEY, String(patientId));
};
