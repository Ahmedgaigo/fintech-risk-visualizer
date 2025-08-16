import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
from datetime import datetime, timedelta
from ..core.config import settings


class RiskCalculator:
    """Calculate portfolio risk metrics"""
    
    def __init__(self):
        self.risk_free_rate = settings.RISK_FREE_RATE
    
    def calculate_returns(self, prices: pd.Series) -> pd.Series:
        """Calculate daily returns from price series"""
        return prices.pct_change().dropna()
    
    def calculate_portfolio_returns(self, 
                                  asset_prices: Dict[str, pd.Series], 
                                  weights: Dict[str, float]) -> pd.Series:
        """Calculate portfolio returns given asset prices and weights"""
        # Ensure all price series have the same dates
        price_df = pd.DataFrame(asset_prices)
        price_df = price_df.dropna()
        
        # Calculate returns for each asset
        returns_df = price_df.pct_change().dropna()
        
        # Calculate weighted portfolio returns
        portfolio_returns = pd.Series(0.0, index=returns_df.index)
        for symbol, weight in weights.items():
            if symbol in returns_df.columns:
                portfolio_returns += returns_df[symbol] * weight
        
        return portfolio_returns
    
    def calculate_volatility(self, returns: pd.Series, annualize: bool = True) -> float:
        """Calculate volatility (standard deviation of returns)"""
        vol = returns.std()
        if annualize:
            vol *= np.sqrt(252)  # Annualize assuming 252 trading days
        return vol
    
    def calculate_sharpe_ratio(self, returns: pd.Series, annualize: bool = True) -> float:
        """Calculate Sharpe ratio"""
        excess_returns = returns - (self.risk_free_rate / 252)  # Daily risk-free rate
        
        if len(excess_returns) == 0:
            return 0.0
        
        mean_excess_return = excess_returns.mean()
        volatility = returns.std()
        
        if volatility == 0:
            return 0.0
        
        sharpe = mean_excess_return / volatility
        
        if annualize:
            sharpe *= np.sqrt(252)
        
        return sharpe
    
    def calculate_beta(self, 
                      asset_returns: pd.Series, 
                      market_returns: pd.Series) -> float:
        """Calculate beta (sensitivity to market movements)"""
        # Align the series
        aligned_data = pd.DataFrame({
            'asset': asset_returns,
            'market': market_returns
        }).dropna()
        
        if len(aligned_data) < 2:
            return 1.0  # Default beta
        
        covariance = aligned_data['asset'].cov(aligned_data['market'])
        market_variance = aligned_data['market'].var()
        
        if market_variance == 0:
            return 1.0
        
        return covariance / market_variance
    
    def calculate_var(self, 
                     returns: pd.Series, 
                     confidence_level: float = 0.95,
                     method: str = 'historical') -> float:
        """Calculate Value at Risk (VaR)"""
        if len(returns) == 0:
            return 0.0
        
        if method == 'historical':
            # Historical VaR
            return np.percentile(returns, (1 - confidence_level) * 100)
        
        elif method == 'parametric':
            # Parametric VaR (assumes normal distribution)
            mean = returns.mean()
            std = returns.std()
            z_score = -1.65 if confidence_level == 0.95 else -2.33  # 95% or 99%
            return mean + z_score * std
        
        else:
            raise ValueError("Method must be 'historical' or 'parametric'")
    
    def calculate_cvar(self, 
                      returns: pd.Series, 
                      confidence_level: float = 0.95) -> float:
        """Calculate Conditional Value at Risk (Expected Shortfall)"""
        var = self.calculate_var(returns, confidence_level)
        # CVaR is the mean of returns below VaR
        tail_returns = returns[returns <= var]
        
        if len(tail_returns) == 0:
            return var
        
        return tail_returns.mean()
    
    def calculate_maximum_drawdown(self, prices: pd.Series) -> Tuple[float, datetime, datetime]:
        """Calculate maximum drawdown and its duration"""
        # Calculate cumulative returns
        cumulative = (1 + prices.pct_change()).cumprod()
        
        # Calculate running maximum
        running_max = cumulative.expanding().max()
        
        # Calculate drawdown
        drawdown = (cumulative - running_max) / running_max
        
        # Find maximum drawdown
        max_dd = drawdown.min()
        max_dd_date = drawdown.idxmin()
        
        # Find the peak before the maximum drawdown
        peak_date = running_max.loc[:max_dd_date].idxmax()
        
        return max_dd, peak_date, max_dd_date
    
    def calculate_sortino_ratio(self, returns: pd.Series, annualize: bool = True) -> float:
        """Calculate Sortino ratio (downside deviation)"""
        excess_returns = returns - (self.risk_free_rate / 252)
        
        # Calculate downside deviation (only negative returns)
        downside_returns = excess_returns[excess_returns < 0]
        
        if len(downside_returns) == 0:
            return float('inf')  # No downside risk
        
        downside_deviation = downside_returns.std()
        
        if downside_deviation == 0:
            return float('inf')
        
        sortino = excess_returns.mean() / downside_deviation
        
        if annualize:
            sortino *= np.sqrt(252)
        
        return sortino
    
    def calculate_information_ratio(self, 
                                  portfolio_returns: pd.Series,
                                  benchmark_returns: pd.Series) -> float:
        """Calculate Information Ratio"""
        # Active returns (portfolio vs benchmark)
        active_returns = portfolio_returns - benchmark_returns
        
        if len(active_returns) == 0:
            return 0.0
        
        tracking_error = active_returns.std()
        
        if tracking_error == 0:
            return 0.0
        
        return active_returns.mean() / tracking_error
    
    def calculate_portfolio_metrics(self,
                                  asset_prices: Dict[str, pd.Series],
                                  weights: Dict[str, float],
                                  market_prices: Optional[pd.Series] = None) -> Dict[str, float]:
        """Calculate comprehensive portfolio risk metrics"""
        
        # Calculate portfolio returns
        portfolio_returns = self.calculate_portfolio_returns(asset_prices, weights)
        
        if len(portfolio_returns) == 0:
            return self._empty_metrics()
        
        # Basic metrics
        metrics = {
            'total_return': (portfolio_returns + 1).prod() - 1,
            'annualized_return': portfolio_returns.mean() * 252,
            'volatility': self.calculate_volatility(portfolio_returns),
            'sharpe_ratio': self.calculate_sharpe_ratio(portfolio_returns),
            'sortino_ratio': self.calculate_sortino_ratio(portfolio_returns),
            'var_95': self.calculate_var(portfolio_returns, 0.95),
            'cvar_95': self.calculate_cvar(portfolio_returns, 0.95),
        }
        
        # Calculate beta if market data is available
        if market_prices is not None:
            market_returns = self.calculate_returns(market_prices)
            metrics['beta'] = self.calculate_beta(portfolio_returns, market_returns)
            metrics['information_ratio'] = self.calculate_information_ratio(
                portfolio_returns, market_returns
            )
        else:
            metrics['beta'] = 1.0
            metrics['information_ratio'] = 0.0
        
        # Calculate maximum drawdown
        if len(portfolio_returns) > 1:
            cumulative_prices = (1 + portfolio_returns).cumprod()
            max_dd, peak_date, trough_date = self.calculate_maximum_drawdown(
                pd.Series(cumulative_prices.values, index=cumulative_prices.index)
            )
            metrics['max_drawdown'] = max_dd
        else:
            metrics['max_drawdown'] = 0.0
        
        return metrics
    
    def _empty_metrics(self) -> Dict[str, float]:
        """Return empty metrics when calculation is not possible"""
        return {
            'total_return': 0.0,
            'annualized_return': 0.0,
            'volatility': 0.0,
            'sharpe_ratio': 0.0,
            'sortino_ratio': 0.0,
            'beta': 1.0,
            'var_95': 0.0,
            'cvar_95': 0.0,
            'max_drawdown': 0.0,
            'information_ratio': 0.0,
        }
