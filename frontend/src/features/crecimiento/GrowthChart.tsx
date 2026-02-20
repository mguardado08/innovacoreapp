import { Box, Paper, Typography } from '@mui/material';

type CurvePoint = {
  edad_dias: number;
  [key: string]: number | null;
};

type PatientPoint = {
  id: number;
  edad_dias: number;
  valor: number;
  z_score: number | null;
  clasificacion: string;
};

type GrowthChartProps = {
  curves: CurvePoint[];
  patientSeries: PatientPoint[];
  unitLabel: string;
};

const pad = 28;
const width = 920;
const height = 380;

const lineColors: Record<string, string> = {
  'z_-3': '#d84315',
  'z_-2': '#f57c00',
  'z_-1': '#fbc02d',
  z_0: '#2e7d32',
  z_1: '#90a4ae',
  z_2: '#ef6c00',
  z_3: '#b71c1c'
};

const mapToPoints = (
  data: { x: number; y: number }[],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) =>
  data
    .map(({ x, y }) => {
      const px = pad + ((x - minX) / (maxX - minX || 1)) * (width - pad * 2);
      const py = height - pad - ((y - minY) / (maxY - minY || 1)) * (height - pad * 2);
      return `${px},${py}`;
    })
    .join(' ');

const GrowthChart = ({ curves, patientSeries, unitLabel }: GrowthChartProps) => {
  if (curves.length === 0 && patientSeries.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">No hay datos de curvas para mostrar.</Typography>
      </Paper>
    );
  }

  const xValues = [
    ...curves.map((item) => item.edad_dias),
    ...patientSeries.map((item) => item.edad_dias)
  ];
  const yValues: number[] = [];
  curves.forEach((item) => {
    ['z_-3', 'z_-2', 'z_-1', 'z_0', 'z_1', 'z_2', 'z_3'].forEach((key) => {
      const value = item[key];
      if (typeof value === 'number') {
        yValues.push(value);
      }
    });
  });
  patientSeries.forEach((item) => yValues.push(item.valor));

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Curva de crecimiento
      </Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: 760 }}>
          <rect x={0} y={0} width={width} height={height} fill="#fff" />
          <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#c8c8c8" />
          <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke="#c8c8c8" />

          {Object.keys(lineColors).map((key) => {
            const points = curves
              .map((item) => {
                const value = item[key];
                return typeof value === 'number' ? { x: item.edad_dias, y: value } : null;
              })
              .filter(Boolean) as { x: number; y: number }[];
            if (!points.length) {
              return null;
            }
            return (
              <polyline
                key={key}
                fill="none"
                stroke={lineColors[key]}
                strokeWidth={1.5}
                points={mapToPoints(points, minX, maxX, minY, maxY)}
              />
            );
          })}

          {patientSeries.length > 0 && (
            <polyline
              fill="none"
              stroke="#0d47a1"
              strokeWidth={3}
              points={mapToPoints(
                patientSeries.map((item) => ({ x: item.edad_dias, y: item.valor })),
                minX,
                maxX,
                minY,
                maxY
              )}
            />
          )}

          {patientSeries.map((item) => {
            const px = pad + ((item.edad_dias - minX) / (maxX - minX || 1)) * (width - pad * 2);
            const py = height - pad - ((item.valor - minY) / (maxY - minY || 1)) * (height - pad * 2);
            return (
              <g key={item.id}>
                <circle cx={px} cy={py} r={4} fill="#0d47a1">
                  <title>
                    {`Edad: ${item.edad_dias} dias | Valor: ${item.valor} ${unitLabel} | Z: ${item.z_score ?? '-'} | ${item.clasificacion}`}
                  </title>
                </circle>
              </g>
            );
          })}

          <text x={pad} y={16} fill="#616161" fontSize="12">
            Valor ({unitLabel})
          </text>
          <text x={width - 130} y={height - 8} fill="#616161" fontSize="12">
            Edad (dias)
          </text>
        </svg>
      </Box>
    </Paper>
  );
};

export default GrowthChart;
