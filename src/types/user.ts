export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'CUSTOMER';
export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface UsersManagementProps {
  onLoadingChange?: (loading: boolean) => void;
  onNotification?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  onConfirm?: (title: string, message: string, onConfirm: () => void) => void;
}

export interface UserFilters {
  search: string;
  role: UserRole | 'ALL';
  status: UserStatus | 'ALL';
  sortBy: 'name' | 'email' | 'createdAt' | 'role';
  sortOrder: 'asc' | 'desc';
}

export interface UserFormData {
  email: string;
  name: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
} 