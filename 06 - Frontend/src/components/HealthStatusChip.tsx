import React from 'react';
import {
  Chip,
  Tooltip,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Paper,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { useSystemHealth } from '../hooks/useApi';
import { SystemHealth, ServiceHealthStatus } from '../services/healthService';

const HealthStatusChip: React.FC = () => {
  const { data: health, isLoading, error } = useSystemHealth();

  const getStatusProps = (health?: SystemHealth) => {
    if (isLoading) {
      return {
        label: 'Checking...',
        color: 'default' as const,
        icon: <CircularProgress size={16} />,
      };
    }

    if (error || !health) {
      return {
        label: 'Connection Error',
        color: 'error' as const,
        icon: <ErrorIcon />,
      };
    }

    switch (health.overallStatus) {
      case 'healthy':
        return {
          label: `All Systems Online (${health.healthyCount}/${health.totalCount})`,
          color: 'success' as const,
          icon: <CheckCircleIcon />,
        };
      case 'degraded':
        return {
          label: `Systems Degraded (${health.healthyCount}/${health.totalCount})`,
          color: 'warning' as const,
          icon: <WarningIcon />,
        };
      case 'unhealthy':
        return {
          label: `Systems Offline (${health.healthyCount}/${health.totalCount})`,
          color: 'error' as const,
          icon: <ErrorIcon />,
        };
      default:
        return {
          label: 'Unknown Status',
          color: 'default' as const,
          icon: <CircleIcon />,
        };
    }
  };

  const ServiceStatusItem: React.FC<{ service: ServiceHealthStatus }> = ({ service }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {service.isHealthy ? (
          <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
        ) : (
          <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
        )}
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {service.displayName}
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {service.isHealthy ? 'Online' : 'Offline'}
      </Typography>
    </Box>
  );

  const TooltipContent: React.FC<{ health: SystemHealth }> = ({ health }) => (
    <Paper sx={{ p: 2, maxWidth: 300 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
        System Health Overview
      </Typography>
      
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
        Last checked: {new Date().toLocaleTimeString()}
      </Typography>

      <Stack spacing={1}>
        {health.services.map((service) => (
          <ServiceStatusItem key={service.name} service={service} />
        ))}
      </Stack>

      {health.overallStatus !== 'healthy' && (
        <Box sx={{ mt: 2, p: 1, bgcolor: 'warning.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Some services may be temporarily unavailable. Features connected to offline services may not work properly.
          </Typography>
        </Box>
      )}
    </Paper>
  );

  const statusProps = getStatusProps(health);

  return (
    <Tooltip
      title={
        health ? (
          <TooltipContent health={health} />
        ) : error ? (
          <Typography variant="body2">Unable to connect to health monitoring</Typography>
        ) : (
          <Typography variant="body2">Loading health status...</Typography>
        )
      }
      arrow
      placement="bottom-end"
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: 'transparent',
            boxShadow: 3,
            p: 0,
          },
        },
      }}
    >
      <Chip
        icon={statusProps.icon}
        label={statusProps.label}
        color={statusProps.color}
        size="small"
        sx={{ 
          fontWeight: 'medium',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: `${statusProps.color}.100`,
          },
        }}
      />
    </Tooltip>
  );
};

export default HealthStatusChip;