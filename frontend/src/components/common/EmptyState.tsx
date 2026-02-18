import { Box, Button, Typography } from '@mui/material';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

const EmptyState = ({ title, description, actionLabel, onAction }: EmptyStateProps) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 6,
      px: 3,
      borderRadius: 4,
      border: '1px dashed #e0d6c9',
      backgroundColor: 'rgba(255, 255, 255, 0.7)'
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
      {title}
    </Typography>
    <Typography color="text.secondary" sx={{ mb: 2 }}>
      {description}
    </Typography>
    {actionLabel && onAction && (
      <Button variant="contained" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;
