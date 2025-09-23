import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  People as UsersIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as BellIcon,
} from '@mui/icons-material';
import HealthStatusChip from './HealthStatusChip';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'matches', label: 'Matches', icon: CalendarIcon },
    { id: 'teams', label: 'Teams', icon: UsersIcon },
    { id: 'betting', label: 'Betting', icon: TrendingUpIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                borderRadius: 2,
                p: 1,
                mr: 2,
              }}
            >
              <TrophyIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  background: 'linear-gradient(45deg, #1f2937 30%, #374151 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                }}
              >
                Crossbar Conspiracy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                by Nutmeg Labs
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <HealthStatusChip />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, zIndex: 40 }}>
        <Container maxWidth="xl">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                '&.Mui-selected': {
                  color: 'primary.main',
                  bgcolor: 'primary.50',
                },
              },
            }}
          >
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Tab
                  key={tab.id}
                  value={tab.id}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconComponent sx={{ fontSize: 20 }} />
                      {tab.label}
                    </Box>
                  }
                />
              );
            })}
          </Tabs>
        </Container>
      </Paper>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default Layout;