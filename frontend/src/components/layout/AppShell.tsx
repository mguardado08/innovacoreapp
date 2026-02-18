import { ReactNode } from 'react';
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useLocation } from 'react-router-dom';

import { navSections } from '../../app/nav';

const drawerWidth = 280;

type AppShellProps = {
  children: ReactNode;
};

const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', gap: 2 }}>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              InnovacoreApp
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Plataforma clinica pediatrica
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', px: 2, py: 2 }}>
          {navSections.map((section) => (
            <Box key={section.label} sx={{ mb: 2 }}>
              <Typography
                variant="overline"
                sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.08em' }}
              >
                {section.label}
              </Typography>
              <List dense disablePadding>
                {section.items.map((item) => {
                  const selected = location.pathname === item.path;
                  return (
                    <ListItemButton
                      key={item.path}
                      component={NavLink}
                      to={item.path}
                      selected={selected}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(15, 76, 92, 0.12)'
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: 'rgba(15, 76, 92, 0.18)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  );
                })}
              </List>
              <Divider sx={{ mt: 1.5 }} />
            </Box>
          ))}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ pb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default AppShell;
