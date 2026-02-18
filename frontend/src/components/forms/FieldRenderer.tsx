import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField
} from '@mui/material';

import { useLookup } from '../../hooks/useLookup';
import { FieldConfig } from '../../types/resources';

type FieldRendererProps = {
  field: FieldConfig;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
  disabled?: boolean;
};

const FieldRenderer = ({ field, value, onChange, disabled }: FieldRendererProps) => {
  const { options } = useLookup(field.lookup);
  const selectOptions = field.options ?? options;

  if (field.type === 'boolean') {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={Boolean(value)}
            onChange={(event) => onChange(field.name, event.target.checked)}
            disabled={disabled}
          />
        }
        label={field.label}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <FormControl fullWidth>
        <InputLabel>{field.label}</InputLabel>
        <Select
          label={field.label}
          value={value ?? ''}
          onChange={(event) => onChange(field.name, event.target.value)}
          disabled={disabled}
        >
          {selectOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (field.type === 'file') {
    return (
      <TextField
        fullWidth
        type="file"
        label={field.label}
        InputLabelProps={{ shrink: true }}
        onChange={(event) => onChange(field.name, event.target.files?.[0] ?? null)}
        disabled={disabled}
      />
    );
  }

  const inputType = field.type === 'textarea' ? 'text' : field.type;

  return (
    <TextField
      fullWidth
      type={inputType === 'datetime' ? 'datetime-local' : inputType}
      label={field.label}
      value={value ?? ''}
      onChange={(event) => onChange(field.name, event.target.value)}
      placeholder={field.placeholder}
      helperText={field.helperText}
      InputLabelProps={{ shrink: true }}
      multiline={field.type === 'textarea'}
      minRows={field.type === 'textarea' ? 3 : undefined}
      disabled={disabled}
    />
  );
};

export default FieldRenderer;
