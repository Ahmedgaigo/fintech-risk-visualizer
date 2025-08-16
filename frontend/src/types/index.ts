// API Response Types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Portfolio Types
export interface PortfolioAsset {
  id: number;
  symbol: string;
  quantity: number;
  purchase_price?: number;
  purchase_date?: string;
  current_price?: number;
  market_value?: number;
  unrealized_pnl?: number;
}

export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  assets: PortfolioAsset[];
  total_value?: number;
  total_cost?: number;
  total_pnl?: number;
  risk_metrics?: RiskMetrics;
}

export interface CreatePortfolioRequest {
  name: string;
  description?: string;
  assets: CreateAssetRequest[];
}

export interface CreateAssetRequest {
  symbol: string;
  quantity: number;
  purchase_price?: number;
  purchase_date?: string;
}

// Risk Metrics Types
export interface RiskMetrics {
  portfolio_id: number;
  total_return: number;
  annualized_return: number;
  volatility: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  beta: number;
  var_95: number;
  cvar_95: number;
  max_drawdown: number;
  information_ratio: number;
  last_updated: string;
}

// Market Data Types
export interface PriceData {
  symbol: string;
  price: number;
  timestamp: string;
}

export interface HistoricalDataPoint {
  date: string;
  close: number;
}

export interface HistoricalData {
  symbol: string;
  data: HistoricalDataPoint[];
  period_days: number;
}

export interface MarketStatus {
  market_open: boolean;
  timestamp: string;
  next_open?: string;
  next_close?: string;
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'price_update' | 'subscription_confirmed' | 'unsubscription_confirmed';
  data?: Record<string, number>;
  symbols?: string[];
  timestamp?: string;
}

export interface SubscriptionMessage {
  type: 'subscribe' | 'unsubscribe';
  symbols: string[];
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

// Form Types
export interface PortfolioFormData {
  name: string;
  description: string;
  assets: AssetFormData[];
}

export interface AssetFormData {
  symbol: string;
  quantity: string;
  purchase_price: string;
  purchase_date: string;
}

// Search Types
export interface SymbolSuggestion {
  symbol: string;
  name: string;
  type: string;
}

export interface SearchResponse {
  query: string;
  suggestions: SymbolSuggestion[];
}

// Utility Types
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface FilterConfig {
  [key: string]: string | number | boolean;
}

// Error Types
export interface ApiError {
  detail: string;
  status_code?: number;
}

// Theme Types
export type Theme = 'light' | 'dark';

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  current?: boolean;
}

// Dashboard Types
export interface DashboardStats {
  total_portfolios: number;
  total_value: number;
  total_pnl: number;
  best_performer: string;
  worst_performer: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Export utility type helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
