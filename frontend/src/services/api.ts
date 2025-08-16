import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Portfolio,
  CreatePortfolioRequest,
  CreateAssetRequest,
  RiskMetrics,
  PriceData,
  HistoricalData,
  MarketStatus,
  SearchResponse,
  ApiError
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response: AxiosResponse<AuthResponse> = await this.api.post(
      '/auth/login',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/me');
    return response.data;
  }

  async updateCurrentUser(userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put('/auth/me', userData);
    return response.data;
  }

  // Portfolio endpoints
  async getPortfolios(): Promise<Portfolio[]> {
    const response: AxiosResponse<Portfolio[]> = await this.api.get('/portfolios');
    return response.data;
  }

  async getPortfolio(id: number): Promise<Portfolio> {
    const response: AxiosResponse<Portfolio> = await this.api.get(`/portfolios/${id}`);
    return response.data;
  }

  async createPortfolio(portfolioData: CreatePortfolioRequest): Promise<Portfolio> {
    const response: AxiosResponse<Portfolio> = await this.api.post('/portfolios', portfolioData);
    return response.data;
  }

  async updatePortfolio(id: number, portfolioData: Partial<Portfolio>): Promise<Portfolio> {
    const response: AxiosResponse<Portfolio> = await this.api.put(`/portfolios/${id}`, portfolioData);
    return response.data;
  }

  async deletePortfolio(id: number): Promise<void> {
    await this.api.delete(`/portfolios/${id}`);
  }

  // Portfolio asset endpoints
  async addAssetToPortfolio(portfolioId: number, assetData: CreateAssetRequest): Promise<any> {
    const response = await this.api.post(`/portfolios/${portfolioId}/assets`, assetData);
    return response.data;
  }

  async updatePortfolioAsset(
    portfolioId: number,
    assetId: number,
    assetData: CreateAssetRequest
  ): Promise<any> {
    const response = await this.api.put(`/portfolios/${portfolioId}/assets/${assetId}`, assetData);
    return response.data;
  }

  async removeAssetFromPortfolio(portfolioId: number, assetId: number): Promise<void> {
    await this.api.delete(`/portfolios/${portfolioId}/assets/${assetId}`);
  }

  // Risk metrics endpoints
  async getPortfolioRiskMetrics(portfolioId: number): Promise<RiskMetrics> {
    const response: AxiosResponse<RiskMetrics> = await this.api.get(
      `/portfolios/${portfolioId}/risk-metrics`
    );
    return response.data;
  }

  // Market data endpoints
  async getCurrentPrice(symbol: string): Promise<PriceData> {
    const response: AxiosResponse<PriceData> = await this.api.get(`/market-data/price/${symbol}`);
    return response.data;
  }

  async getMultiplePrices(symbols: string[]): Promise<{ prices: Record<string, number>; timestamp: string }> {
    const response = await this.api.post('/market-data/prices', symbols);
    return response.data;
  }

  async getHistoricalData(symbol: string, days: number = 252): Promise<HistoricalData> {
    const response: AxiosResponse<HistoricalData> = await this.api.get(
      `/market-data/historical/${symbol}?days=${days}`
    );
    return response.data;
  }

  async searchSymbols(query: string): Promise<SearchResponse> {
    const response: AxiosResponse<SearchResponse> = await this.api.get(
      `/market-data/search/${query}`
    );
    return response.data;
  }

  async getMarketStatus(): Promise<MarketStatus> {
    const response: AxiosResponse<MarketStatus> = await this.api.get('/market-data/market-status');
    return response.data;
  }

  // Utility methods
  setAuthToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Error handling helper
  handleApiError(error: any): ApiError {
    if (error.response?.data?.detail) {
      return {
        detail: error.response.data.detail,
        status_code: error.response.status,
      };
    }
    
    if (error.message) {
      return {
        detail: error.message,
        status_code: error.response?.status,
      };
    }

    return {
      detail: 'An unexpected error occurred',
      status_code: 500,
    };
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
