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

export interface DashboardData {
  stats: DashboardStats;
  orderTrends: OrderTrend[];
  recentOrders: RecentOrder[];
} 