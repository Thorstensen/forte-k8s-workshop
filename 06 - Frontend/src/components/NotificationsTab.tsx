import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Notifications as BellIcon,
  Warning as AlertTriangleIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNotifications, useImportantNotifications } from '../hooks/useApi';
import { formatDate } from '../utils';

const NotificationsTab: React.FC = () => {
  const { data: allNotifications = [], isLoading: allLoading } = useNotifications();
  const { data: importantNotifications = [], isLoading: importantLoading } = useImportantNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'match_start':
      case 'match_end':
        return CheckCircleIcon;
      case 'goal':
      case 'penalty':
        return AlertTriangleIcon;
      case 'red_card':
      case 'yellow_card':
        return AlertTriangleIcon;
      default:
        return InfoIcon;
    }
  };

  const getPriorityChipProps = (priority: string, isImportant: boolean) => {
    if (isImportant) {
      return { color: 'error' as const, variant: 'filled' as const };
    }
    switch (priority.toLowerCase()) {
      case 'high':
        return { color: 'warning' as const, variant: 'filled' as const };
      case 'medium':
        return { color: 'info' as const, variant: 'filled' as const };
      case 'low':
        return { color: 'success' as const, variant: 'outlined' as const };
      default:
        return { color: 'default' as const, variant: 'outlined' as const };
    }
  };

  const NotificationList = ({ 
    notifications, 
    isLoading, 
    title, 
    emptyMessage 
  }: {
    notifications: any[];
    isLoading: boolean;
    title: string;
    emptyMessage: string;
  }) => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (notifications.length === 0) {
      return (
        <Card sx={{ textAlign: 'center', py: 4 }}>
          <CardContent>
            <BellIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {emptyMessage}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Stack spacing={2}>
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          const chipProps = getPriorityChipProps(notification.priority, notification.isImportant);
          
          return (
            <Card
              key={notification.id}
              variant="outlined"
              sx={{
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      bgcolor: notification.isImportant ? 'error.light' : 'primary.light',
                      color: notification.isImportant ? 'error.contrastText' : 'primary.contrastText',
                    }}
                  >
                    <Icon />
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 2 }}>
                        {notification.title}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip 
                          label={notification.priority.toUpperCase()} 
                          size="small"
                          {...chipProps}
                        />
                        {notification.isImportant && (
                          <Chip 
                            label="IMPORTANT" 
                            size="small" 
                            color="error"
                            variant="filled"
                          />
                        )}
                      </Stack>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {notification.message}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={`Type: ${notification.type.replace('_', ' ').toUpperCase()}`}
                        size="small"
                        variant="outlined"
                        color="default"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(notification.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Notifications
        </Typography>
        <Chip 
          icon={<BellIcon />} 
          label="Live Updates" 
          color="primary" 
          variant="outlined"
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Important Notifications */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AlertTriangleIcon sx={{ color: 'error.main', mr: 1 }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  Important Notifications
                </Typography>
              </Box>
              
              <NotificationList
                notifications={importantNotifications}
                isLoading={importantLoading}
                title="No Important Notifications"
                emptyMessage="All clear! No critical alerts at the moment."
              />
            </CardContent>
          </Card>
        </Box>

        {/* All Notifications */}
        <Box sx={{ flex: 1 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BellIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  All Notifications
                </Typography>
              </Box>
              
              <NotificationList
                notifications={allNotifications}
                isLoading={allLoading}
                title="No Notifications"
                emptyMessage="No notifications available at the moment."
              />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Info Section */}
      <Alert severity="success" sx={{ mt: 4, borderRadius: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Notification System
        </Typography>
        <Typography variant="body2">
          When you start a match, the NotificationCenter service will automatically generate 
          notifications for match events including goals, cards, substitutions, and match status changes.
        </Typography>
      </Alert>
    </Box>
  );
};

export default NotificationsTab;