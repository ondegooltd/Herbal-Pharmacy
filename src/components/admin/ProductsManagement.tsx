import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileDownload as ExportIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import Modal from '../Modal';
import ProductForm from './ProductForm';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface ProductsManagementProps {
  onLoadingChange: (loading: boolean) => void;
  onNotification: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
  onConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const ProductsManagement: React.FC<ProductsManagementProps> = ({
  onLoadingChange,
  onNotification,
  onConfirm,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      onLoadingChange(true);
      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      onNotification('Error fetching products', 'error');
    } finally {
      onLoadingChange(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    onConfirm(
      'Delete Product',
      'Are you sure you want to delete this product?',
      async () => {
        try {
          onLoadingChange(true);
          const response = await fetch(`/api/admin/products/${productId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (response.ok) {
            setProducts(products.filter((p) => p.id !== productId));
            onNotification('Product deleted successfully', 'success');
          } else {
            onNotification('Error deleting product', 'error');
          }
        } catch (error) {
          onNotification('Error deleting product', 'error');
        } finally {
          onLoadingChange(false);
        }
      }
    );
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;

    onConfirm(
      'Delete Products',
      `Are you sure you want to delete ${selectedProducts.length} selected products?`,
      async () => {
        try {
          onLoadingChange(true);
          const response = await fetch('/api/admin/products/bulk-delete', {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productIds: selectedProducts }),
          });

          if (response.ok) {
            setProducts(products.filter((p) => !selectedProducts.includes(p.id)));
            setSelectedProducts([]);
            onNotification('Products deleted successfully', 'success');
          } else {
            onNotification('Error deleting products', 'error');
          }
        } catch (error) {
          onNotification('Error deleting products', 'error');
        } finally {
          onLoadingChange(false);
        }
      }
    );
  };

  const handleBulkStatusUpdate = (status: 'ACTIVE' | 'INACTIVE') => {
    if (selectedProducts.length === 0) return;

    onConfirm(
      'Update Product Status',
      `Are you sure you want to update the status of ${selectedProducts.length} selected products?`,
      async () => {
        try {
          onLoadingChange(true);
          const response = await fetch('/api/admin/products/bulk-update-status', {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productIds: selectedProducts, status }),
          });

          if (response.ok) {
            setProducts(
              products.map((p) =>
                selectedProducts.includes(p.id) ? { ...p, status } : p
              )
            );
            setSelectedProducts([]);
            onNotification('Product status updated successfully', 'success');
          } else {
            onNotification('Error updating product status', 'error');
          }
        } catch (error) {
          onNotification('Error updating product status', 'error');
        } finally {
          onLoadingChange(false);
        }
      }
    );
  };

  const handleExport = () => {
    const filteredProducts = getFilteredProducts();
    const worksheet = XLSX.utils.json_to_sheet(
      filteredProducts.map((p) => ({
        ID: p.id,
        Name: p.name,
        Description: p.description,
        Price: p.price,
        Stock: p.stock,
        Category: p.category,
        Status: p.status,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'products.xlsx');
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProducts(getFilteredProducts().map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesStatus = !filters.status || product.status === filters.status;
      const matchesMinPrice = !filters.minPrice || product.price >= Number(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || product.price <= Number(filters.maxPrice);
      const matchesMinStock = !filters.minStock || product.stock >= Number(filters.minStock);
      const matchesMaxStock = !filters.maxStock || product.stock <= Number(filters.maxStock);

      return matchesSearch && matchesCategory && matchesStatus &&
        matchesMinPrice && matchesMaxPrice && matchesMinStock && matchesMaxStock;
    });
  };

  const filteredProducts = getFilteredProducts();

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedProduct(null);
            setIsModalOpen(true);
          }}
        >
          Add Product
        </Button>

        <Box>
          <Tooltip title="Export to Excel">
            <IconButton onClick={handleExport} color="primary">
              <ExportIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Filters">
            <IconButton onClick={() => setShowFilters(!showFilters)} color="primary">
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="HERBS">Herbs</MenuItem>
                  <MenuItem value="SUPPLEMENTS">Supplements</MenuItem>
                  <MenuItem value="TEAS">Teas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="INACTIVE">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Min Stock"
                type="number"
                value={filters.minStock}
                onChange={(e) => setFilters({ ...filters, minStock: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Max Stock"
                type="number"
                value={filters.maxStock}
                onChange={(e) => setFilters({ ...filters, maxStock: e.target.value })}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {selectedProducts.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleBulkDelete}
            sx={{ mr: 1 }}
          >
            Delete Selected
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleBulkStatusUpdate('ACTIVE')}
            sx={{ mr: 1 }}
          >
            Activate Selected
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleBulkStatusUpdate('INACTIVE')}
          >
            Deactivate Selected
          </Button>
        </Box>
      )}

      <TextField
        fullWidth
        label="Search Products"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedProducts.length === filteredProducts.length}
                  indeterminate={
                    selectedProducts.length > 0 &&
                    selectedProducts.length < filteredProducts.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.status}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditProduct(product)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          product={selectedProduct}
          onSubmit={async (formData) => {
            try {
              onLoadingChange(true);
              const url = selectedProduct
                ? `/api/admin/products/${selectedProduct.id}`
                : '/api/admin/products';
              const method = selectedProduct ? 'PUT' : 'POST';

              const response = await fetch(url, {
                method,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
              });

              if (response.ok) {
                const updatedProduct = await response.json();
                if (selectedProduct) {
                  setProducts(
                    products.map((p) =>
                      p.id === selectedProduct.id ? updatedProduct : p
                    )
                  );
                  onNotification('Product updated successfully', 'success');
                } else {
                  setProducts([...products, updatedProduct]);
                  onNotification('Product added successfully', 'success');
                }
                setIsModalOpen(false);
              } else {
                onNotification('Error saving product', 'error');
              }
            } catch (error) {
              onNotification('Error saving product', 'error');
            } finally {
              onLoadingChange(false);
            }
          }}
        />
      </Modal>
    </Box>
  );
};

export default ProductsManagement; 