import { Product, Order, User } from './index';

/**
 * Base API response interface
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

/**
 * Paginated API response interface
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * API error response interface
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

/**
 * API response types for different endpoints
 */
export interface ProductsResponse extends PaginatedResponse<Product> {}
export interface ProductResponse extends ApiResponse<Product> {}

export interface OrdersResponse extends PaginatedResponse<Order> {}
export interface OrderResponse extends ApiResponse<Order> {}

export interface UsersResponse extends PaginatedResponse<User> {}
export interface UserResponse extends ApiResponse<User> {}

/**
 * API request types
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export type ApiRequestParams = PaginationParams & FilterParams;

/**
 * API endpoints
 */
export type ApiEndpoint = 
  | '/api/admin/products'
  | '/api/admin/orders'
  | '/api/admin/users'
  | '/api/admin/dashboard/stats';

/**
 * API methods
 */
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; 