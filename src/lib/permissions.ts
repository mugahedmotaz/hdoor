// Advanced Permissions and Roles System
export type Permission =
   | 'lecture.create'
   | 'lecture.read'
   | 'lecture.update'
   | 'lecture.delete'
   | 'attendance.create'
   | 'attendance.read_own'
   | 'attendance.read_all'
   | 'attendance.export'
   | 'user.create'
   | 'user.read'
   | 'user.update'
   | 'user.delete'
   | 'analytics.read'
   | 'analytics.export'
   | 'backup.create'
   | 'backup.read'
   | 'system.admin'
   | 'notifications.manage';

export interface Role {
   name: string;
   permissions: Permission[];
   description: string;
}

export const ROLES: Record<string, Role> = {
   student: {
      name: 'student',
      permissions: [
         'lecture.read',
         'attendance.create',
         'attendance.read_own',
      ],
      description: 'طالب - يمكنه حضور المحاضرات وعرض سجله'
   },
   professor: {
      name: 'professor',
      permissions: [
         'lecture.create',
         'lecture.read',
         'lecture.update',
         'lecture.delete',
         'attendance.read_all',
         'attendance.export',
         'analytics.read',
         'notifications.manage',
      ],
      description: 'أستاذ - يمكنه إدارة المحاضرات والطلاب والتقارير'
   },
   admin: {
      name: 'admin',
      permissions: [
         // All permissions
         'lecture.create',
         'lecture.read',
         'lecture.update',
         'lecture.delete',
         'attendance.create',
         'attendance.read_own',
         'attendance.read_all',
         'attendance.export',
         'user.create',
         'user.read',
         'user.update',
         'user.delete',
         'analytics.read',
         'analytics.export',
         'backup.create',
         'backup.read',
         'system.admin',
         'notifications.manage',
      ],
      description: 'مدير النظام - صلاحيات كاملة'
   },
};

export class PermissionManager {
   private userRole: string;
   private userPermissions: Set<Permission>;

   constructor(role: string) {
      this.userRole = role;
      this.userPermissions = new Set(ROLES[role]?.permissions || []);
   }

   hasPermission(permission: Permission): boolean {
      return this.userPermissions.has(permission);
   }

   hasAnyPermission(permissions: Permission[]): boolean {
      return permissions.some(p => this.userPermissions.has(p));
   }

   hasAllPermissions(permissions: Permission[]): boolean {
      return permissions.every(p => this.userPermissions.has(p));
   }

   canCreateLectures(): boolean {
      return this.hasPermission('lecture.create');
   }

   canManageUsers(): boolean {
      return this.hasAnyPermission(['user.create', 'user.update', 'user.delete']);
   }

   canViewAnalytics(): boolean {
      return this.hasPermission('analytics.read');
   }

   canExportData(): boolean {
      return this.hasAnyPermission(['attendance.export', 'analytics.export']);
   }

   canManageSystem(): boolean {
      return this.hasPermission('system.admin');
   }

   getRole(): string {
      return this.userRole;
   }

   getPermissions(): Permission[] {
      return Array.from(this.userPermissions);
   }
}

// Hook for React components
export function usePermissions(role?: string) {
   if (!role) {
      throw new Error('Role is required for usePermissions hook');
   }

   return new PermissionManager(role);
}

// Middleware for API routes
export function requirePermission(permission: Permission) {
   return (req: any, res: any, next: any) => {
      const userRole = req.user?.role;
      if (!userRole) {
         return res.status(401).json({ error: 'Unauthorized' });
      }

      const permissionManager = new PermissionManager(userRole);
      if (!permissionManager.hasPermission(permission)) {
         return res.status(403).json({ error: 'Forbidden' });
      }

      next();
   };
}

// React Component for permission-based rendering
import React from 'react';

interface PermissionGateProps {
   permission: Permission;
   fallback?: React.ReactNode;
   children: React.ReactNode;
}

export function PermissionGate({ permission, fallback = null, children }: PermissionGateProps): React.ReactNode {
   // This would need to be connected to your auth context
   // For now, this is a placeholder implementation
   const userRole = 'student'; // This should come from your auth context

   const permissionManager = new PermissionManager(userRole);

   if (permissionManager.hasPermission(permission)) {
      return <>{ children } </>;
   }

   return <>{ fallback } </>;
}

// Higher-order component for protecting routes
export function withPermission<P extends object>(
   permission: Permission,
   Component: React.ComponentType<P>
): React.ComponentType<P> {
   return function ProtectedComponent(props: P): React.ReactNode {
      return (
         <PermissionGate permission= { permission } >
         <Component { ...props } />
         </PermissionGate>
      );
   };
}

// Utility functions for checking permissions in data access
export function canUserAccessLecture(userRole: string, lectureProfessorId: string, userId: string): boolean {
   const pm = new PermissionManager(userRole);

   // Students can only access active lectures
   if (userRole === 'student') {
      return pm.hasPermission('lecture.read');
   }

   // Professors can access their own lectures
   if (userRole === 'professor') {
      return lectureProfessorId === userId;
   }

   // Admins can access all lectures
   if (userRole === 'admin') {
      return pm.hasPermission('lecture.read');
   }

   return false;
}

export function canUserViewAttendance(userRole: string, targetUserId: string, currentUserId: string): boolean {
   const pm = new PermissionManager(userRole);

   // Students can only view their own attendance
   if (userRole === 'student') {
      return targetUserId === currentUserId && pm.hasPermission('attendance.read_own');
   }

   // Professors and admins can view all attendance
   return pm.hasPermission('attendance.read_all');
}

export function canUserManageUsers(userRole: string): boolean {
   const pm = new PermissionManager(userRole);
   return pm.hasAnyPermission(['user.create', 'user.update', 'user.delete']);
}

export function canUserExportData(userRole: string): boolean {
   const pm = new PermissionManager(userRole);
   return pm.hasAnyPermission(['attendance.export', 'analytics.export']);
}

export function canUserViewAnalytics(userRole: string): boolean {
   const pm = new PermissionManager(userRole);
   return pm.hasPermission('analytics.read');
}

export function canUserManageBackups(userRole: string): boolean {
   const pm = new PermissionManager(userRole);
   return pm.hasAnyPermission(['backup.create', 'backup.read']);
}

export function canUserManageSystem(userRole: string): boolean {
   const pm = new PermissionManager(userRole);
   return pm.hasPermission('system.admin');
}
