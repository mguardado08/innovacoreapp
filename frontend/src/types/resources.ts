export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'textarea'
  | 'select'
  | 'boolean'
  | 'file';

export type LookupConfig = {
  endpoint: string;
  labelKey?: string;
  labelFn?: (item: Record<string, unknown>) => string;
  valueKey?: string;
};

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string | number }[];
  lookup?: LookupConfig;
  placeholder?: string;
  helperText?: string;
  grid?: {
    xs?: number;
    md?: number;
  };
};

export type ColumnConfig = {
  field: string;
  header: string;
  width?: number;
  format?: (value: unknown, row: Record<string, unknown>) => string;
};

export type ResourceConfig = {
  key: string;
  label: string;
  endpoint: string;
  description?: string;
  columns: ColumnConfig[];
  fields: FieldConfig[];
  filters?: FieldConfig[];
  defaultValues?: Record<string, unknown>;
  clientSearch?: boolean;
  rowLink?: (row: Record<string, unknown>) => string | undefined;
};
