from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

from ..services.market_data_service import MarketDataService

router = APIRouter()


# Pydantic models
class PriceResponse(BaseModel):
    symbol: str
    price: float
    timestamp: datetime


class HistoricalDataPoint(BaseModel):
    date: datetime
    close: float


class HistoricalDataResponse(BaseModel):
    symbol: str
    data: List[HistoricalDataPoint]
    period_days: int


class MultiPriceResponse(BaseModel):
    prices: Dict[str, float]
    timestamp: datetime


@router.get("/price/{symbol}", response_model=PriceResponse)
async def get_current_price(symbol: str):
    """Get current price for a single symbol"""
    market_service = MarketDataService()
    
    try:
        price = await market_service.get_current_price(symbol.upper())
        
        if price is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Price data not found for symbol: {symbol}"
            )
        
        return PriceResponse(
            symbol=symbol.upper(),
            price=price,
            timestamp=datetime.now()
        )
        
    finally:
        await market_service.close()


@router.post("/prices", response_model=MultiPriceResponse)
async def get_multiple_prices(symbols: List[str]):
    """Get current prices for multiple symbols"""
    if not symbols:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one symbol is required"
        )
    
    if len(symbols) > 50:  # Limit to prevent abuse
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 50 symbols allowed per request"
        )
    
    market_service = MarketDataService()
    
    try:
        # Convert to uppercase
        symbols_upper = [symbol.upper() for symbol in symbols]
        
        prices = await market_service.get_multiple_prices(symbols_upper)
        
        return MultiPriceResponse(
            prices=prices,
            timestamp=datetime.now()
        )
        
    finally:
        await market_service.close()


@router.get("/historical/{symbol}", response_model=HistoricalDataResponse)
async def get_historical_data(
    symbol: str,
    days: int = 252  # Default to 1 year of trading days
):
    """Get historical price data for a symbol"""
    if days < 1 or days > 2000:  # Reasonable limits
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Days must be between 1 and 2000"
        )
    
    market_service = MarketDataService()
    
    try:
        historical_df = await market_service.get_historical_data(symbol.upper(), days)
        
        if historical_df.empty:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Historical data not found for symbol: {symbol}"
            )
        
        # Convert DataFrame to response format
        data_points = []
        for _, row in historical_df.iterrows():
            data_points.append(HistoricalDataPoint(
                date=row['date'],
                close=row['close']
            ))
        
        return HistoricalDataResponse(
            symbol=symbol.upper(),
            data=data_points,
            period_days=len(data_points)
        )
        
    finally:
        await market_service.close()


@router.get("/search/{query}")
async def search_symbols(query: str):
    """Search for symbols (basic implementation)"""
    # This is a basic implementation. In a real app, you'd integrate with
    # a symbol search API like Polygon.io or Alpha Vantage
    
    if len(query) < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Query must be at least 1 character"
        )
    
    # Mock symbol suggestions based on common stocks/ETFs
    mock_symbols = {
        'A': ['AAPL', 'AMZN', 'AMD', 'ADBE'],
        'B': ['BRK.B', 'BA', 'BAC', 'BABA'],
        'C': ['COST', 'CRM', 'CSCO', 'CVX'],
        'D': ['DIS', 'DOW', 'DHR'],
        'E': ['ETH', 'EBAY'],
        'F': ['FB', 'FORD', 'FDX'],
        'G': ['GOOGL', 'GOOG', 'GS', 'GM'],
        'H': ['HD', 'HON'],
        'I': ['IBM', 'INTC', 'INTU'],
        'J': ['JNJ', 'JPM'],
        'K': ['KO', 'KEY'],
        'L': ['LMT', 'LOW'],
        'M': ['MSFT', 'META', 'MCD', 'MMM'],
        'N': ['NVDA', 'NFLX', 'NKE'],
        'O': ['ORCL'],
        'P': ['PG', 'PFE', 'PYPL'],
        'Q': ['QQQ', 'QCOM'],
        'R': ['RTX'],
        'S': ['SPY', 'SHOP', 'SQ'],
        'T': ['TSLA', 'TSM', 'T'],
        'U': ['UNH', 'USB'],
        'V': ['V', 'VZ', 'VTI', 'VOO'],
        'W': ['WMT', 'WFC'],
        'X': ['XOM'],
        'Y': ['YELP'],
        'Z': ['ZM']
    }
    
    query_upper = query.upper()
    suggestions = []
    
    # Find symbols that start with the query
    for symbol_list in mock_symbols.values():
        for symbol in symbol_list:
            if symbol.startswith(query_upper):
                suggestions.append({
                    'symbol': symbol,
                    'name': f'{symbol} Inc.',  # Mock company name
                    'type': 'stock'
                })
    
    # Also check if query matches any symbol partially
    if len(suggestions) < 10:
        for symbol_list in mock_symbols.values():
            for symbol in symbol_list:
                if query_upper in symbol and symbol not in [s['symbol'] for s in suggestions]:
                    suggestions.append({
                        'symbol': symbol,
                        'name': f'{symbol} Inc.',
                        'type': 'stock'
                    })
                    if len(suggestions) >= 10:
                        break
            if len(suggestions) >= 10:
                break
    
    return {
        'query': query,
        'suggestions': suggestions[:10]  # Limit to 10 results
    }


@router.get("/market-status")
async def get_market_status():
    """Get current market status"""
    # This is a simplified implementation
    # In a real app, you'd check actual market hours and holidays
    
    now = datetime.now()
    
    # Simple market hours check (9:30 AM - 4:00 PM ET, Monday-Friday)
    # This doesn't account for holidays or timezone properly
    is_weekday = now.weekday() < 5  # Monday = 0, Sunday = 6
    current_hour = now.hour
    
    # Rough approximation of market hours (not timezone-aware)
    is_market_hours = 9 <= current_hour < 16
    
    market_open = is_weekday and is_market_hours
    
    return {
        'market_open': market_open,
        'timestamp': now,
        'next_open': 'Next business day 9:30 AM ET' if not market_open else None,
        'next_close': '4:00 PM ET today' if market_open else None
    }
