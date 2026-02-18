import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { ColumnConfig } from '../../types/resources';

type DataTableProps = {
  columns: ColumnConfig[];
  rows: Record<string, unknown>[];
  onEdit: (row: Record<string, unknown>) => void;
  onDelete: (row: Record<string, unknown>) => void;
  onRowClick?: (row: Record<string, unknown>) => void;
};

const DataTable = ({ columns, rows, onEdit, onDelete, onRowClick }: DataTableProps) => (
  <Box sx={{ overflowX: 'auto' }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.field} sx={{ minWidth: column.width ?? 120 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {column.header}
              </Typography>
            </TableCell>
          ))}
          <TableCell align="right">
            <Typography variant="subtitle2" color="text.secondary">
              Acciones
            </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={String(row.id ?? row.pk ?? Math.random())}
            hover
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {columns.map((column) => {
              const value = row[column.field];
              return (
                <TableCell key={`${row.id}-${column.field}`}>
                  {column.format ? column.format(value, row) : String(value ?? '-')}
                </TableCell>
              );
            })}
            <TableCell align="right">
              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(row);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  size="small"
                  color="error"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(row);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);

export default DataTable;
