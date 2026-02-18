import { ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';

type PageHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
  extra?: ReactNode;
};

const PageHeader = ({ title, description, actionLabel, onAction, actionIcon, extra }: PageHeaderProps) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'flex-start', md: 'center' },
      justifyContent: 'space-between',
      gap: 2,
      mb: 3
    }}
  >
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {extra}
      {actionLabel && onAction && (
        <Button variant="contained" startIcon={actionIcon} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  </Box>
);

export default PageHeader;
