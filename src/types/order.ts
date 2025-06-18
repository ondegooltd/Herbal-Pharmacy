export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrdersManagementProps {
  onLoadingChange?: (loading: boolean) => void;
  onNotification?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  onConfirm?: (title: string, message: string, onConfirm: () => void) => void;
}

export interface OrderFilters {
  search: string;
  status: OrderStatus | 'ALL';
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: 'createdAt' | 'total' | 'status';
  sortOrder: 'asc' | 'desc';
}

export interface OrderFormData {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: string;
  status: OrderStatus;
} 