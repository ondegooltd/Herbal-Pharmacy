export type NotificationSeverity = 'success' | 'error' | 'info' | 'warning';

export interface NotificationProps {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
  onClose: () => void;
}

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface TableColumn<T> {
  field: keyof T;
  headerName: string;
  width?: number;
  renderCell?: (row: T) => React.ReactNode;
}

export interface FilterProps {
  onFilterChange: (filters: any) => void;
  onReset: () => void;
} 