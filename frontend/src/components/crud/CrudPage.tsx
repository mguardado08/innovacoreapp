import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

import { createResource, deleteResource, listResource, updateResource } from '../../services/api';
import { ResourceConfig } from '../../types/resources';
import DataTable from './DataTable';
import FieldRenderer from '../forms/FieldRenderer';
import PageHeader from '../common/PageHeader';
import EmptyState from '../common/EmptyState';
import ConfirmDialog from '../common/ConfirmDialog';

const parseRows = (response: unknown) => {
  if (Array.isArray(response)) {
    return response as Record<string, unknown>[];
  }
  if (response && typeof response === 'object' && 'results' in response) {
    return (response as { results: Record<string, unknown>[] }).results ?? [];
  }
  return [] as Record<string, unknown>[];
};

type CrudPageProps = {
  resource: ResourceConfig;
  embedded?: boolean;
  fixedFilters?: Record<string, string | number>;
  titleOverride?: string;
};

const CrudPage = ({ resource, embedded, fixedFilters, titleOverride }: CrudPageProps) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>(resource.defaultValues ?? {});
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState<string | null>(null);
  const [draftRecovered, setDraftRecovered] = useState(false);

  const draftKey = useMemo(() => {
    const fixedFiltersKey = JSON.stringify(fixedFilters ?? {});
    return `innovacore:draft:${resource.endpoint}:${fixedFiltersKey}`;
  }, [resource.endpoint, fixedFilters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await listResource(resource.endpoint, {
        ...(fixedFilters ?? {}),
        ...filters
      } as Record<string, string | number | boolean | undefined>);
      setRows(parseRows(response));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible cargar la informacion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [resource.endpoint]);

  useEffect(() => {
    if (!openForm) {
      return;
    }
    if (editing) {
      return;
    }
    const raw = window.localStorage.getItem(draftKey);
    if (!raw) {
      return;
    }
    try {
      const saved = JSON.parse(raw) as Record<string, unknown>;
      setFormValues((prev) => ({ ...prev, ...saved }));
      setDraftRecovered(true);
    } catch (_err) {
      window.localStorage.removeItem(draftKey);
    }
  }, [openForm, editing, draftKey]);

  useEffect(() => {
    if (!openForm || editing) {
      return;
    }
    window.localStorage.setItem(draftKey, JSON.stringify(formValues));
  }, [formValues, openForm, editing, draftKey]);

  const filteredRows = useMemo(() => {
    if (!search.trim() || resource.clientSearch === false) {
      return rows;
    }
    const value = search.toLowerCase();
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(value));
  }, [rows, search, resource.clientSearch]);

  const handleOpenCreate = () => {
    const defaultValues = { ...(resource.defaultValues ?? {}), ...(fixedFilters ?? {}) };
    setFormValues(defaultValues);
    setEditing(null);
    setDraftRecovered(false);
    setOpenForm(true);
  };

  const handleEdit = (row: Record<string, unknown>) => {
    setEditing(row);
    setFormValues({ ...row });
    setDraftRecovered(false);
    setOpenForm(true);
  };

  const handleDelete = (row: Record<string, unknown>) => {
    setDeleteTarget(row);
  };

  const handleSubmit = async () => {
    setAlert(null);
    try {
      if (editing && editing.id) {
        await updateResource(resource.endpoint, editing.id as string | number, formValues);
      } else {
        await createResource(resource.endpoint, { ...formValues, ...(fixedFilters ?? {}) });
        window.localStorage.removeItem(draftKey);
      }
      setOpenForm(false);
      await loadData();
    } catch (err) {
      setAlert(err instanceof Error ? err.message : 'No se pudo guardar');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget || !deleteTarget.id) {
      return;
    }
    setAlert(null);
    try {
      await deleteResource(resource.endpoint, deleteTarget.id as string | number);
      setDeleteTarget(null);
      await loadData();
    } catch (err) {
      setAlert(err instanceof Error ? err.message : 'No se pudo eliminar');
    }
  };

  const handleRowClick = (row: Record<string, unknown>) => {
    if (resource.rowLink) {
      const link = resource.rowLink(row);
      if (link) {
        navigate(link);
      }
    }
  };

  return (
    <Box>
      {!embedded && (
        <PageHeader
          title={titleOverride ?? resource.label}
          description={resource.description}
          actionLabel={`Nuevo ${resource.label}`}
          actionIcon={<AddIcon />}
          onAction={handleOpenCreate}
          extra={
            resource.filters && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {Object.entries(filters).map(([key, value]) =>
                  value ? <Chip key={key} label={`${key}: ${String(value)}`} size="small" /> : null
                )}
              </Stack>
            )
          }
        />
      )}

      {resource.filters && (
        <Box sx={{ mb: 2, display: 'grid', gap: 2 }}>
          <Grid container spacing={2}>
            {resource.filters.map((field) => (
              <Grid item xs={12} md={field.grid?.md ?? 4} key={field.name}>
                <FieldRenderer
                  field={field}
                  value={filters[field.name] ?? ''}
                  onChange={(name, value) => setFilters((prev) => ({ ...prev, [name]: value }))}
                />
              </Grid>
            ))}
          </Grid>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={loadData}>
              Aplicar filtros
            </Button>
            <Button
              onClick={() => {
                setFilters({});
                loadData();
              }}
            >
              Limpiar
            </Button>
          </Stack>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label="Buscar"
          placeholder="Buscar en el listado"
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ maxWidth: 320 }}
        />
        {embedded && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
            Nuevo
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {filteredRows.length === 0 && !loading ? (
        <EmptyState
          title={`Sin registros de ${resource.label.toLowerCase()}`}
          description="Cuando agregues datos apareceran aqui."
          actionLabel={`Crear ${resource.label}`}
          onAction={handleOpenCreate}
        />
      ) : (
        <DataTable
          columns={resource.columns}
          rows={filteredRows}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRowClick={resource.rowLink ? handleRowClick : undefined}
        />
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? `Editar ${resource.label}` : `Nuevo ${resource.label}`}</DialogTitle>
        <DialogContent>
          {draftRecovered && !editing && (
            <Alert severity="info" sx={{ mb: 2 }} onClose={() => setDraftRecovered(false)}>
              Se recupero un borrador local de este formulario.
            </Alert>
          )}
          {alert && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {alert}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {resource.fields.map((field) => (
              <Grid item xs={12} md={field.grid?.md ?? 6} key={field.name}>
                <FieldRenderer
                  field={field}
                  value={formValues[field.name]}
                  onChange={(name, value) => setFormValues((prev) => ({ ...prev, [name]: value }))}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenForm(false);
              setDraftRecovered(false);
            }}
          >
            Cancelar
          </Button>
          {!editing && (
            <Button
              color="inherit"
              onClick={() => {
                window.localStorage.removeItem(draftKey);
                setFormValues({ ...(resource.defaultValues ?? {}), ...(fixedFilters ?? {}) });
                setDraftRecovered(false);
              }}
            >
              Limpiar borrador
            </Button>
          )}
          <Button variant="contained" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar registro"
        description="Esta accion eliminara el registro de forma permanente."
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default CrudPage;
