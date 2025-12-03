import React, { createContext, useContext, useState, useCallback } from 'react';
import { Bell, Check, X, Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
 id: string;
 type: NotificationType;
 title: string;
 message?: string;
 timestamp: Date;
 read: boolean;
 autoClose?: boolean;
 duration?: number;
}

interface NotificationContextType {
 notifications: Notification[];
 addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
 removeNotification: (id: string) => void;
 markAsRead: (id: string) => void;
 clearAll: () => void;
 unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
 const [notifications, setNotifications] = useState<Notification[]>([]);

 const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  const newNotification: Notification = {
   ...notification,
   id: Date.now().toString(),
   timestamp: new Date(),
   read: false,
   autoClose: notification.autoClose ?? true,
   duration: notification.duration ?? 5000,
  };

  setNotifications(prev => [newNotification, ...prev]);

  if (newNotification.autoClose) {
   setTimeout(() => {
    removeNotification(newNotification.id);
   }, newNotification.duration);
  }
 }, []);

 const removeNotification = useCallback((id: string) => {
  setNotifications(prev => prev.filter(n => n.id !== id));
 }, []);

 const markAsRead = useCallback((id: string) => {
  setNotifications(prev => prev.map(n =>
   n.id === id ? { ...n, read: true } : n
  ));
 }, []);

 const clearAll = useCallback(() => {
  setNotifications([]);
 }, []);

 const unreadCount = notifications.filter(n => !n.read).length;

 return (
  <NotificationContext.Provider value={{
   notifications,
   addNotification,
   removeNotification,
   markAsRead,
   clearAll,
   unreadCount
  }}>
   {children}
   <NotificationContainer />
  </NotificationContext.Provider>
 );
}

function NotificationContainer() {
 const { notifications, removeNotification, markAsRead } = useNotifications();

 return (
  <div className="fixed top-4 left-4 z-50 space-y-2 max-w-sm">
   {notifications.slice(0, 5).map((notification) => (
    <NotificationItem
     key={notification.id}
     notification={notification}
     onClose={() => removeNotification(notification.id)}
     onRead={() => markAsRead(notification.id)}
    />
   ))}
  </div>
 );
}

function NotificationItem({ notification, onClose, onRead }: {
 notification: Notification;
 onClose: () => void;
 onRead: () => void;
}) {
 const getIcon = () => {
  switch (notification.type) {
   case 'success':
    return <CheckCircle className="w-5 h-5 text-green-500" />;
   case 'error':
    return <AlertCircle className="w-5 h-5 text-red-500" />;
   case 'warning':
    return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
   default:
    return <Info className="w-5 h-5 text-blue-500" />;
  }
 };

 const getBorderColor = () => {
  switch (notification.type) {
   case 'success':
    return 'border-green-200';
   case 'error':
    return 'border-red-200';
   case 'warning':
    return 'border-yellow-200';
   default:
    return 'border-blue-200';
  }
 };

 return (
  <Card className={cn('w-full shadow-lg animate-in slide-in-from-top-2', getBorderColor())}>
   <CardContent className="p-3">
    <div className="flex items-start gap-3">
     {getIcon()}
     <div className="flex-1 min-w-0">
      <p className="font-medium text-sm">{notification.title}</p>
      {notification.message && (
       <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
      )}
     </div>
     <div className="flex items-center gap-1">
      {!notification.read && (
       <Button
        variant="ghost"
        size="sm"
        onClick={onRead}
        className="h-6 w-6 p-0"
       >
        <Check className="w-3 h-3" />
       </Button>
      )}
      <Button
       variant="ghost"
       size="sm"
       onClick={onClose}
       className="h-6 w-6 p-0"
      >
       <X className="w-3 h-3" />
      </Button>
     </div>
    </div>
   </CardContent>
  </Card>
 );
}

export function useNotifications() {
 const context = useContext(NotificationContext);
 if (context === undefined) {
  throw new Error('useNotifications must be used within a NotificationProvider');
 }
 return context;
}

export function NotificationBell() {
 const { unreadCount } = useNotifications();

 return (
  <div className="relative">
   <Bell className="w-5 h-5" />
   {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
     {unreadCount > 9 ? '9+' : unreadCount}
    </span>
   )}
  </div>
 );
}
