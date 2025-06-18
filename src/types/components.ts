import { ReactNode } from 'react';
import { Product, Order, User } from './index';
import { TableColumn } from './common';

/**
 * Props for the Modal component
 */
export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

/**
 * Props for the DataTable component
 */
export interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  selectedIds?: string[];
  pagination?: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

/**
 * Props for the SearchBar component
 */
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceTime?: number;
}

/**
 * Props for the FilterDrawer component
 */
export interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  onReset: () => void;
}

/**
 * Props for the StatusBadge component
 */
export interface StatusBadgeProps {
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  size?: 'small' | 'medium' | 'large';
}

/**
 * Props for the ActionButtons component
 */
export interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  disabled?: boolean;
}

/**
 * Props for the BulkActions component
 */
export interface BulkActionsProps {
  selectedIds: string[];
  onDelete?: () => void;
  onStatusChange?: (status: string) => void;
  disabled?: boolean;
}

/**
 * Props for the ExportButton component
 */
export interface ExportButtonProps {
  data: any[];
  filename: string;
  disabled?: boolean;
  onExport?: () => void;
}

/**
 * Props for the ChartCard component
 */
export interface ChartCardProps {
  title: string;
  data: any[];
  type: 'bar' | 'line' | 'pie';
  xAxisKey: string;
  yAxisKey: string;
  height?: number;
}

/**
 * Props for the StatCard component
 */
export interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

/**
 * Props for the FormField component
 */
export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'select' | 'multiselect' | 'date';
  value: any;
  onChange: (value: any) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  helperText?: string;
}

/**
 * Props for the FileUpload component
 */
export interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Props for the ImagePreview component
 */
export interface ImagePreviewProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  onDelete?: () => void;
  onEdit?: () => void;
}

/**
 * Props for the DateRangePicker component
 */
export interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
  disabled?: boolean;
}

/**
 * Props for the TabPanel component
 */
export interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

/**
 * Props for the Breadcrumbs component
 */
export interface BreadcrumbsProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  onItemClick?: (index: number) => void;
}

/**
 * Props for the Sidebar component
 */
export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  items: Array<{
    label: string;
    icon?: ReactNode;
    href?: string;
    children?: Array<{
      label: string;
      href: string;
    }>;
  }>;
  onItemClick?: (item: { label: string; href?: string }) => void;
}

/**
 * Props for the Header component
 */
export interface HeaderProps {
  title: string;
  actions?: ReactNode;
  onMenuClick?: () => void;
  user?: {
    name: string;
    avatar?: string;
  };
  onUserMenuClick?: () => void;
}

/**
 * Props for the Footer component
 */
export interface FooterProps {
  copyright?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon: ReactNode;
  }>;
}

/**
 * Props for the LoadingOverlay component
 */
export interface LoadingOverlayProps {
  open: boolean;
  message?: string;
  progress?: number;
}

/**
 * Props for the ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Props for the ConfirmationDialog component
 */
export interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  severity?: 'warning' | 'error' | 'info';
}

/**
 * Props for the NotificationSnackbar component
 */
export interface NotificationSnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  autoHideDuration?: number;
  action?: ReactNode;
}

/**
 * Props for the Tooltip component
 */
export interface TooltipProps {
  title: string;
  children: ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  arrow?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
}

/**
 * Props for the Badge component
 */
export interface BadgeProps {
  content: number | string;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'standard' | 'dot';
  max?: number;
  showZero?: boolean;
  children?: ReactNode;
} 