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

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ProductsManagementProps {
  onLoadingChange?: (loading: boolean) => void;
  onNotification?: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  onConfirm?: (title: string, message: string, onConfirm: () => void) => void;
}

export interface ProductFilters {
  search: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ALL';
  minPrice: number | '';
  maxPrice: number | '';
  sortBy: 'name' | 'price' | 'stock' | 'createdAt';
  sortOrder: 'asc' | 'desc';
} 