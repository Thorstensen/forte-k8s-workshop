import React from 'react';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useNotifications, useImportantNotifications } from '../hooks/useApi';
import { formatDate, getPriorityColor, cn } from '../utils';

const NotificationsTab: React.FC = () => {
  const { data: allNotifications = [], isLoading: allLoading } = useNotifications();
  const { data: importantNotifications = [], isLoading: importantLoading } = useImportantNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'match_start':
      case 'match_end':
        return CheckCircle;
      case 'goal':
      case 'penalty':
        return AlertTriangle;
      case 'red_card':
      case 'yellow_card':
        return AlertTriangle;
      default:
        return Info;
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
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">{title}</h4>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          return (
            <div
              key={notification.id}
              className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-3">
                <div className={cn(
                  'p-2 rounded-full',
                  notification.isImportant ? 'bg-red-100' : 'bg-blue-100'
                )}>
                  <Icon className={cn(
                    'h-5 w-5',
                    notification.isImportant ? 'text-red-600' : 'text-blue-600'
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getPriorityColor(notification.priority)
                      )}>
                        {notification.priority.toUpperCase()}
                      </span>
                      {notification.isImportant && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                          IMPORTANT
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>
                      Type: {notification.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span>
                      {formatDate(notification.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Bell className="h-4 w-4 mr-1" />
          Live Updates
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Important Notifications */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            Important Notifications
          </h3>
          
          <NotificationList
            notifications={importantNotifications}
            isLoading={importantLoading}
            title="No Important Notifications"
            emptyMessage="All clear! No critical alerts at the moment."
          />
        </div>

        {/* All Notifications */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Bell className="h-5 w-5 text-blue-600 mr-2" />
            All Notifications
          </h3>
          
          <NotificationList
            notifications={allNotifications}
            isLoading={allLoading}
            title="No Notifications"
            emptyMessage="No notifications available at the moment."
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-green-900">Notification System</h4>
            <p className="text-sm text-green-700 mt-1">
              When you start a match, the NotificationCenter service will automatically generate 
              notifications for match events including goals, cards, substitutions, and match status changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;