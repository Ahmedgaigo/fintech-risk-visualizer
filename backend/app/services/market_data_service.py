import asyncio
import httpx
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from ..core.config import settings


class MarketDataService:
    """Service for fetching real-time and historical market data"""
    
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.cache = {}  # Simple in-memory cache
        self.cache_ttl = 60  # Cache for 60 seconds
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
    
    async def get_current_price(self, symbol: str) -> Optional[float]:
        """Get current price for a symbol"""
        # Check cache first
        cache_key = f"price_{symbol}"
        if cache_key in self.cache:
            cached_data, timestamp = self.cache[cache_key]
            if datetime.now().timestamp() - timestamp < self.cache_ttl:
                return cached_data
        
        try:
            # Try Polygon.io first if API key is available
            if settings.POLYGON_API_KEY:
                price = await self._get_polygon_price(symbol)
                if price:
                    self.cache[cache_key] = (price, datetime.now().timestamp())
                    return price
            
            # Fallback to Alpha Vantage
            if settings.ALPHA_VANTAGE_API_KEY:
                price = await self._get_alpha_vantage_price(symbol)
                if price:
                    self.cache[cache_key] = (price, datetime.now().timestamp())
                    return price
            
            # Fallback to mock data for demo purposes
            return await self._get_mock_price(symbol)
            
        except Exception as e:
            print(f"Error fetching price for {symbol}: {e}")
            return await self._get_mock_price(symbol)
    
    async def get_multiple_prices(self, symbols: List[str]) -> Dict[str, float]:
        """Get current prices for multiple symbols"""
        tasks = [self.get_current_price(symbol) for symbol in symbols]
        prices = await asyncio.gather(*tasks, return_exceptions=True)
        
        result = {}
        for symbol, price in zip(symbols, prices):
            if isinstance(price, Exception):
                print(f"Error getting price for {symbol}: {price}")
                result[symbol] = await self._get_mock_price(symbol)
            else:
                result[symbol] = price
        
        return result
    
    async def get_historical_data(self, symbol: str, days: int = 252) -> pd.DataFrame:
        """Get historical price data for risk calculations"""
        try:
            if settings.POLYGON_API_KEY:
                return await self._get_polygon_historical(symbol, days)
            elif settings.ALPHA_VANTAGE_API_KEY:
                return await self._get_alpha_vantage_historical(symbol, days)
            else:
                return self._generate_mock_historical_data(symbol, days)
        except Exception as e:
            print(f"Error fetching historical data for {symbol}: {e}")
            return self._generate_mock_historical_data(symbol, days)
    
    async def _get_polygon_price(self, symbol: str) -> Optional[float]:
        """Fetch price from Polygon.io"""
        url = f"https://api.polygon.io/v2/last/trade/{symbol}"
        params = {"apikey": settings.POLYGON_API_KEY}
        
        response = await self.client.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "OK" and "results" in data:
                return data["results"]["p"]  # price
        return None
    
    async def _get_alpha_vantage_price(self, symbol: str) -> Optional[float]:
        """Fetch price from Alpha Vantage"""
        url = "https://www.alphavantage.co/query"
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": settings.ALPHA_VANTAGE_API_KEY
        }
        
        response = await self.client.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if "Global Quote" in data:
                return float(data["Global Quote"]["05. price"])
        return None
    
    async def _get_polygon_historical(self, symbol: str, days: int) -> pd.DataFrame:
        """Fetch historical data from Polygon.io"""
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days + 50)  # Extra buffer for weekends
        
        url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{start_date.strftime('%Y-%m-%d')}/{end_date.strftime('%Y-%m-%d')}"
        params = {"apikey": settings.POLYGON_API_KEY}
        
        response = await self.client.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "OK" and "results" in data:
                df = pd.DataFrame(data["results"])
                df['date'] = pd.to_datetime(df['t'], unit='ms')
                df = df.rename(columns={'c': 'close', 'o': 'open', 'h': 'high', 'l': 'low', 'v': 'volume'})
                return df[['date', 'close']].tail(days)
        
        return self._generate_mock_historical_data(symbol, days)
    
    async def _get_alpha_vantage_historical(self, symbol: str, days: int) -> pd.DataFrame:
        """Fetch historical data from Alpha Vantage"""
        url = "https://www.alphavantage.co/query"
        params = {
            "function": "TIME_SERIES_DAILY",
            "symbol": symbol,
            "apikey": settings.ALPHA_VANTAGE_API_KEY,
            "outputsize": "full"
        }
        
        response = await self.client.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            if "Time Series (Daily)" in data:
                time_series = data["Time Series (Daily)"]
                df_data = []
                for date_str, values in time_series.items():
                    df_data.append({
                        'date': pd.to_datetime(date_str),
                        'close': float(values['4. close'])
                    })
                df = pd.DataFrame(df_data)
                return df.sort_values('date').tail(days)
        
        return self._generate_mock_historical_data(symbol, days)
    
    async def _get_mock_price(self, symbol: str) -> float:
        """Generate mock price data for demo purposes"""
        # Simple hash-based price generation for consistency
        base_prices = {
            'AAPL': 175.0, 'GOOGL': 140.0, 'MSFT': 380.0, 'TSLA': 250.0,
            'AMZN': 145.0, 'NVDA': 480.0, 'META': 320.0, 'NFLX': 450.0,
            'SPY': 450.0, 'QQQ': 380.0, 'VTI': 240.0, 'BTC': 45000.0,
            'ETH': 2800.0
        }
        
        base_price = base_prices.get(symbol, 100.0)
        # Add some random variation (±5%)
        import random
        random.seed(hash(symbol) + int(datetime.now().timestamp() / 300))  # 5-minute intervals
        variation = random.uniform(-0.05, 0.05)
        return round(base_price * (1 + variation), 2)
    
    def _generate_mock_historical_data(self, symbol: str, days: int) -> pd.DataFrame:
        """Generate mock historical data for demo purposes"""
        import random
        
        # Set seed for consistency
        random.seed(hash(symbol))
        np.random.seed(hash(symbol) % 2**32)
        
        base_price = 100.0
        dates = pd.date_range(end=datetime.now(), periods=days, freq='D')
        
        # Generate realistic price movement using random walk
        returns = np.random.normal(0.001, 0.02, days)  # Daily returns with slight upward drift
        prices = [base_price]
        
        for i in range(1, days):
            new_price = prices[-1] * (1 + returns[i])
            prices.append(max(new_price, 1.0))  # Ensure price doesn't go below $1
        
        return pd.DataFrame({
            'date': dates,
            'close': prices
        })
