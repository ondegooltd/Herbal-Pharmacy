import { ValidationErrors } from './utils';

/**
 * Validation rule types
 */
export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  min?: number;
  max?: number;
  custom?: (value: any) => string | undefined;
};

/**
 * Validation schema for forms
 */
export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule;
};

/**
 * Form field validation result
 */
export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * Form validation state
 */
export type FormValidationState<T> = {
  [K in keyof T]: ValidationResult;
};

/**
 * Form submission state
 */
export type FormSubmissionState = {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error?: string;
  success?: string;
};

/**
 * Form field types
 */
export type FormFieldType = 
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'file'
  | 'switch';

/**
 * Form field configuration
 */
export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: ValidationRule;
  options?: Array<{
    label: string;
    value: any;
    disabled?: boolean;
  }>;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

/**
 * Form configuration
 */
export interface FormConfig<T> {
  fields: FormFieldConfig[];
  validationSchema?: ValidationSchema<T>;
  onSubmit: (data: T) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

/**
 * Form state management
 */
export interface FormState<T> {
  values: T;
  errors: ValidationErrors<T>;
  touched: Record<keyof T, boolean>;
  dirty: Record<keyof T, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

/**
 * Form actions
 */
export interface FormActions<T> {
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  setErrors: (errors: ValidationErrors<T>) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  setTouchedAll: (touched: boolean) => void;
  reset: () => void;
  submit: () => void;
  validate: () => ValidationErrors<T>;
  validateField: (field: keyof T) => string | undefined;
}

/**
 * Form hook return type
 */
export interface UseFormReturn<T> {
  state: FormState<T>;
  actions: FormActions<T>;
  fieldProps: (field: keyof T) => {
    value: T[keyof T];
    onChange: (value: T[keyof T]) => void;
    onBlur: () => void;
    error: string | undefined;
    touched: boolean;
  };
} 