export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface OrderTrend {
  date: string;
  orders: number;
  revenue: number;
}

export interface RecentOrder {
  id: string;
  user: {
    name: string;
    email: string;
  };
  total: number;
  createdAt: string;
}

export interface DashboardOverviewProps {
  stats: DashboardStats;
  orderTrends: OrderTrend[];
  recentOrders: RecentOrder[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface ProductsManagementProps {
  onLoadingChange?: (loading: boolean) => void;
  onNotification?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  onConfirm?: (title: string, message: string, onConfirm: () => void) => void;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
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

export interface OrdersManagementProps {
  onLoadingChange?: (loading: boolean) => void;
  onNotification?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  onConfirm?: (title: string, message: string, onConfirm: () => void) => void;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CUSTOMER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface UsersManagementProps {
  onLoadingChange?: (loading: boolean) => void;
  onNotification?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  onConfirm?: (title: string, message: string, onConfirm: () => void) => void;
} 