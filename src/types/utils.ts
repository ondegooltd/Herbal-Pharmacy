/**
 * Makes all properties in T optional
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

/**
 * Makes all properties in T required
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Makes all properties in T readonly
 */
export type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

/**
 * Picks a set of properties K from T
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Omits a set of properties K from T
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Extracts the type of an array element
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Makes all properties in T nullable
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

/**
 * Makes all properties in T optional and nullable
 */
export type OptionalNullable<T> = {
  [P in keyof T]?: T[P] | null;
};

/**
 * Creates a type with only the specified properties K from T
 */
export type Subset<T, K extends keyof T> = {
  [P in K]: T[P];
};

/**
 * Creates a type with all properties from T except those in K
 */
export type ExcludeProps<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

/**
 * Creates a type with all properties from T that are not functions
 */
export type NonFunctionProps<T> = {
  [P in keyof T as T[P] extends Function ? never : P]: T[P];
};

/**
 * Creates a type with all function properties from T
 */
export type FunctionProps<T> = {
  [P in keyof T as T[P] extends Function ? P : never]: T[P];
};

/**
 * Creates a type with all properties from T that are not null or undefined
 */
export type NonNullableProps<T> = {
  [P in keyof T as T[P] extends null | undefined ? never : P]: NonNullable<T[P]>;
};

/**
 * Creates a type for form validation errors
 */
export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

/**
 * Creates a type for form field states
 */
export type FormFieldState<T> = {
  [K in keyof T]: {
    value: T[K];
    error?: string;
    touched: boolean;
    dirty: boolean;
  };
};

/**
 * Creates a type for API loading states
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Creates a type for pagination state
 */
export type PaginationState = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

/**
 * Creates a type for sorting state
 */
export type SortState = {
  field: string;
  direction: 'asc' | 'desc';
};

/**
 * Creates a type for filter state
 */
export type FilterState = {
  search: string;
  filters: Record<string, any>;
  dateRange?: {
    start: Date;
    end: Date;
  };
};

/**
 * Creates a type for table state
 */
export type TableState<T> = {
  data: T[];
  loading: LoadingState;
  pagination: PaginationState;
  sort: SortState;
  filters: FilterState;
  selectedIds: string[];
};

/**
 * Creates a type for modal state
 */
export type ModalState = {
  open: boolean;
  type: string;
  data?: any;
};

/**
 * Creates a type for notification state
 */
export type NotificationState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  autoHideDuration?: number;
}; 