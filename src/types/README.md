# Type System Documentation

This directory contains all TypeScript type definitions for the Herbal Pharmacy application.

## Structure

```
src/types/
├── index.ts          # Main export file
├── dashboard.ts      # Dashboard-related types
├── product.ts        # Product-related types
├── order.ts          # Order-related types
├── user.ts           # User-related types
├── common.ts         # Common utility types
├── components.ts     # Component prop types
├── utils.ts          # Utility type helpers
├── api.ts            # API-related types
├── theme.ts          # Theme and styling types
├── validation.ts     # Form validation types
└── README.md         # This file
```

## Usage

### Basic Import
```typescript
import { Product, Order, User } from '@/types';
```

### Component Props
```typescript
import { ModalProps, DataTableProps } from '@/types';

const MyComponent: React.FC<ModalProps> = ({ open, title, onClose, children }) => {
  // Component implementation
};
```

### Utility Types
```typescript
import { Partial, Required, ValidationErrors } from '@/types';

type OptionalProduct = Partial<Product>;
type RequiredProduct = Required<Product>;
type ProductErrors = ValidationErrors<Product>;
```

## Type Categories

### 1. Entity Types
- `Product`: Product data structure
- `Order`: Order data structure
- `User`: User data structure
- `DashboardStats`: Dashboard statistics

### 2. Component Props
- `ModalProps`: Modal component props
- `DataTableProps<T>`: Generic data table props
- `FormFieldProps`: Form field props
- `StatusBadgeProps`: Status badge props

### 3. API Types
- `ApiResponse<T>`: Generic API response
- `PaginatedResponse<T>`: Paginated API response
- `ApiError`: API error structure
- `ApiRequestParams`: API request parameters

### 4. Utility Types
- `Partial<T>`: Makes all properties optional
- `Required<T>`: Makes all properties required
- `ValidationErrors<T>`: Form validation errors
- `LoadingState`: Loading state management

### 5. Form Types
- `ValidationRule`: Form validation rules
- `FormConfig<T>`: Form configuration
- `FormState<T>`: Form state management
- `UseFormReturn<T>`: Form hook return type

### 6. Theme Types
- `ColorPalette`: Color scheme
- `TypographyVariant`: Typography variants
- `ThemeConfig`: Theme configuration
- `CustomTheme`: Extended theme interface

## Best Practices

1. **Use Generic Types**: Leverage generic types for reusable components
2. **Document Types**: Add JSDoc comments to complex types
3. **Type Safety**: Use strict typing for all props and state
4. **Consistency**: Follow naming conventions across all types
5. **Modularity**: Keep related types in separate files

## Examples

### Creating a New Type
```typescript
// In src/types/product.ts
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}
```

### Using Types in Components
```typescript
import { Product, ProductsManagementProps } from '@/types';

const ProductsManagement: React.FC<ProductsManagementProps> = ({
  onLoadingChange,
  onNotification,
  onConfirm
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  // Component implementation
};
```

### Form Validation
```typescript
import { ValidationSchema, FormConfig } from '@/types';

const productValidationSchema: ValidationSchema<Product> = {
  name: { required: true, minLength: 2 },
  price: { required: true, min: 0 },
  stock: { required: true, min: 0 }
};
```

## Contributing

When adding new types:
1. Create appropriate file if it doesn't exist
2. Add JSDoc documentation
3. Export from index.ts
4. Update this README if needed
5. Follow existing naming conventions 