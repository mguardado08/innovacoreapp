import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import EventNoteIcon from '@mui/icons-material/EventNote';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ScienceIcon from '@mui/icons-material/Science';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

export type NavItem = {
  label: string;
  path: string;
  icon: JSX.Element;
};

export type NavSection = {
  label: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    label: 'General',
    items: [{ label: 'Dashboard', path: '/', icon: <DashboardIcon /> }]
  },
  {
    label: 'Pacientes',
    items: [
      { label: 'Pacientes', path: '/pacientes', icon: <PeopleAltIcon /> },
      { label: 'Responsables', path: '/pacientes/responsables', icon: <FolderSharedIcon /> },
      { label: 'Seguros', path: '/pacientes/seguros', icon: <ManageSearchIcon /> },
      { label: 'Historias clinicas', path: '/pacientes/historias', icon: <EventNoteIcon /> }
    ]
  },
  {
    label: 'Consultas',
    items: [
      { label: 'Consultas', path: '/consultas', icon: <EventNoteIcon /> },
      { label: 'Examen fisico', path: '/consultas/examenes-fisicos', icon: <ManageSearchIcon /> }
    ]
  },
  {
    label: 'Inmunizaciones',
    items: [
      { label: 'Aplicaciones', path: '/inmunizaciones', icon: <VaccinesIcon /> },
      { label: 'Vacunas', path: '/inmunizaciones/vacunas', icon: <VaccinesIcon /> },
      { label: 'Esquemas', path: '/inmunizaciones/esquemas', icon: <ManageSearchIcon /> }
    ]
  },
  {
    label: 'Examenes',
    items: [
      { label: 'Examenes', path: '/examenes', icon: <ScienceIcon /> },
      { label: 'Tipos de examen', path: '/examenes/tipos', icon: <ManageSearchIcon /> }
    ]
  },
  {
    label: 'Recetas',
    items: [
      { label: 'Recetas', path: '/recetas', icon: <ReceiptLongIcon /> },
      { label: 'Detalles de receta', path: '/recetas/detalles', icon: <ManageSearchIcon /> },
      { label: 'Medicamentos', path: '/recetas/medicamentos', icon: <ManageSearchIcon /> }
    ]
  },
  {
    label: 'Crecimiento',
    items: [
      { label: 'Mediciones', path: '/crecimiento', icon: <ShowChartIcon /> },
      { label: 'Referencias', path: '/crecimiento/referencias', icon: <ManageSearchIcon /> }
    ]
  },
  {
    label: 'Desarrollo',
    items: [
      { label: 'Hitos por paciente', path: '/desarrollo', icon: <ChildCareIcon /> },
      { label: 'Catalogo de hitos', path: '/desarrollo/hitos', icon: <ManageSearchIcon /> }
    ]
  }
];
