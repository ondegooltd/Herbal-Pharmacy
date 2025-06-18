/**
 * Color palette types
 */
export type ColorPalette = {
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  error: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  warning: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  info: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  success: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  grey: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
};

/**
 * Typography types
 */
export type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle1' | 'subtitle2'
  | 'body1' | 'body2'
  | 'button' | 'caption' | 'overline';

export type TypographyStyle = {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
};

/**
 * Spacing types
 */
export type SpacingUnit = number;
export type Spacing = (factor: number) => string;

/**
 * Breakpoint types
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type BreakpointValues = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

/**
 * Z-index types
 */
export type ZIndex = {
  mobileStepper: number;
  fab: number;
  speedDial: number;
  appBar: number;
  drawer: number;
  modal: number;
  snackbar: number;
  tooltip: number;
};

/**
 * Theme configuration
 */
export interface ThemeConfig {
  palette: ColorPalette;
  typography: Record<TypographyVariant, TypographyStyle>;
  spacing: Spacing;
  breakpoints: BreakpointValues;
  zIndex: ZIndex;
  shape: {
    borderRadius: number;
  };
  shadows: string[];
}

/**
 * Component style overrides
 */
export interface ComponentStyleOverrides {
  MuiButton?: {
    styleOverrides?: {
      root?: React.CSSProperties;
      contained?: React.CSSProperties;
      outlined?: React.CSSProperties;
      text?: React.CSSProperties;
    };
  };
  MuiCard?: {
    styleOverrides?: {
      root?: React.CSSProperties;
    };
  };
  MuiTable?: {
    styleOverrides?: {
      root?: React.CSSProperties;
    };
  };
  MuiTableCell?: {
    styleOverrides?: {
      root?: React.CSSProperties;
      head?: React.CSSProperties;
      body?: React.CSSProperties;
    };
  };
}

/**
 * Custom theme interface
 */
export interface CustomTheme extends ThemeConfig {
  components?: ComponentStyleOverrides;
  custom?: {
    sidebarWidth: number;
    headerHeight: number;
    borderRadius: {
      small: number;
      medium: number;
      large: number;
    };
    shadows: {
      light: string;
      medium: string;
      heavy: string;
    };
  };
} 