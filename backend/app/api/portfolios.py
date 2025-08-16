from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

from ..core.database import get_db
from ..models.user import User
from ..models.portfolio import Portfolio, PortfolioAsset
from ..services.market_data_service import MarketDataService
from ..services.risk_calculator import RiskCalculator
from .auth import get_current_user

router = APIRouter()


# Pydantic models
class PortfolioAssetCreate(BaseModel):
    symbol: str
    quantity: float
    purchase_price: Optional[float] = None
    purchase_date: Optional[datetime] = None


class PortfolioAssetResponse(BaseModel):
    id: int
    symbol: str
    quantity: float
    purchase_price: Optional[float]
    purchase_date: Optional[datetime]
    current_price: Optional[float] = None
    market_value: Optional[float] = None
    unrealized_pnl: Optional[float] = None

    class Config:
        from_attributes = True


class PortfolioCreate(BaseModel):
    name: str
    description: Optional[str] = None
    assets: List[PortfolioAssetCreate] = []


class PortfolioUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class PortfolioResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    assets: List[PortfolioAssetResponse] = []
    total_value: Optional[float] = None
    total_cost: Optional[float] = None
    total_pnl: Optional[float] = None
    risk_metrics: Optional[Dict] = None

    class Config:
        from_attributes = True


class RiskMetricsResponse(BaseModel):
    portfolio_id: int
    total_return: float
    annualized_return: float
    volatility: float
    sharpe_ratio: float
    sortino_ratio: float
    beta: float
    var_95: float
    cvar_95: float
    max_drawdown: float
    information_ratio: float
    last_updated: datetime


@router.get("/", response_model=List[PortfolioResponse])
async def get_portfolios(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all portfolios for the current user"""
    result = await db.execute(
        select(Portfolio)
        .where(Portfolio.owner_id == current_user.id)
        .options(selectinload(Portfolio.assets))
    )
    portfolios = result.scalars().all()
    
    # Enrich with market data
    market_service = MarketDataService()
    try:
        enriched_portfolios = []
        for portfolio in portfolios:
            enriched_portfolio = await _enrich_portfolio_with_market_data(portfolio, market_service)
            enriched_portfolios.append(enriched_portfolio)
        return enriched_portfolios
    finally:
        await market_service.close()


@router.post("/", response_model=PortfolioResponse)
async def create_portfolio(
    portfolio_data: PortfolioCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new portfolio"""
    # Create portfolio
    db_portfolio = Portfolio(
        name=portfolio_data.name,
        description=portfolio_data.description,
        owner_id=current_user.id
    )
    
    db.add(db_portfolio)
    await db.flush()  # Get the portfolio ID
    
    # Add assets
    for asset_data in portfolio_data.assets:
        db_asset = PortfolioAsset(
            portfolio_id=db_portfolio.id,
            symbol=asset_data.symbol.upper(),
            quantity=asset_data.quantity,
            purchase_price=asset_data.purchase_price,
            purchase_date=asset_data.purchase_date
        )
        db.add(db_asset)
    
    await db.commit()
    await db.refresh(db_portfolio)
    
    # Load with assets
    result = await db.execute(
        select(Portfolio)
        .where(Portfolio.id == db_portfolio.id)
        .options(selectinload(Portfolio.assets))
    )
    portfolio = result.scalar_one()
    
    # Enrich with market data
    market_service = MarketDataService()
    try:
        return await _enrich_portfolio_with_market_data(portfolio, market_service)
    finally:
        await market_service.close()


@router.get("/{portfolio_id}", response_model=PortfolioResponse)
async def get_portfolio(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific portfolio"""
    result = await db.execute(
        select(Portfolio)
        .where(Portfolio.id == portfolio_id, Portfolio.owner_id == current_user.id)
        .options(selectinload(Portfolio.assets))
    )
    portfolio = result.scalar_one_or_none()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    # Enrich with market data
    market_service = MarketDataService()
    try:
        return await _enrich_portfolio_with_market_data(portfolio, market_service)
    finally:
        await market_service.close()


@router.put("/{portfolio_id}", response_model=PortfolioResponse)
async def update_portfolio(
    portfolio_id: int,
    portfolio_data: PortfolioUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a portfolio"""
    result = await db.execute(
        select(Portfolio)
        .where(Portfolio.id == portfolio_id, Portfolio.owner_id == current_user.id)
        .options(selectinload(Portfolio.assets))
    )
    portfolio = result.scalar_one_or_none()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    # Update fields
    if portfolio_data.name is not None:
        portfolio.name = portfolio_data.name
    if portfolio_data.description is not None:
        portfolio.description = portfolio_data.description
    
    await db.commit()
    await db.refresh(portfolio)
    
    # Enrich with market data
    market_service = MarketDataService()
    try:
        return await _enrich_portfolio_with_market_data(portfolio, market_service)
    finally:
        await market_service.close()


@router.delete("/{portfolio_id}")
async def delete_portfolio(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a portfolio"""
    result = await db.execute(
        select(Portfolio)
        .where(Portfolio.id == portfolio_id, Portfolio.owner_id == current_user.id)
    )
    portfolio = result.scalar_one_or_none()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    await db.delete(portfolio)
    await db.commit()
    
    return {"message": "Portfolio deleted successfully"}


@router.post("/{portfolio_id}/assets", response_model=PortfolioAssetResponse)
async def add_asset_to_portfolio(
    portfolio_id: int,
    asset_data: PortfolioAssetCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Add an asset to a portfolio"""
    # Verify portfolio ownership
    result = await db.execute(
        select(Portfolio)
        .where(Portfolio.id == portfolio_id, Portfolio.owner_id == current_user.id)
    )
    portfolio = result.scalar_one_or_none()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    # Create asset
    db_asset = PortfolioAsset(
        portfolio_id=portfolio_id,
        symbol=asset_data.symbol.upper(),
        quantity=asset_data.quantity,
        purchase_price=asset_data.purchase_price,
        purchase_date=asset_data.purchase_date
    )
    
    db.add(db_asset)
    await db.commit()
    await db.refresh(db_asset)
    
    # Enrich with market data
    market_service = MarketDataService()
    try:
        current_price = await market_service.get_current_price(db_asset.symbol)
        return _enrich_asset_with_market_data(db_asset, current_price)
    finally:
        await market_service.close()


@router.put("/{portfolio_id}/assets/{asset_id}", response_model=PortfolioAssetResponse)
async def update_portfolio_asset(
    portfolio_id: int,
    asset_id: int,
    asset_data: PortfolioAssetCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a portfolio asset"""
    # Verify portfolio ownership and get asset
    result = await db.execute(
        select(PortfolioAsset)
        .join(Portfolio)
        .where(
            PortfolioAsset.id == asset_id,
            PortfolioAsset.portfolio_id == portfolio_id,
            Portfolio.owner_id == current_user.id
        )
    )
    asset = result.scalar_one_or_none()
    
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    # Update asset
    asset.symbol = asset_data.symbol.upper()
    asset.quantity = asset_data.quantity
    asset.purchase_price = asset_data.purchase_price
    asset.purchase_date = asset_data.purchase_date
    
    await db.commit()
    await db.refresh(asset)
    
    # Enrich with market data
    market_service = MarketDataService()
    try:
        current_price = await market_service.get_current_price(asset.symbol)
        return _enrich_asset_with_market_data(asset, current_price)
    finally:
        await market_service.close()


@router.delete("/{portfolio_id}/assets/{asset_id}")
async def remove_asset_from_portfolio(
    portfolio_id: int,
    asset_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove an asset from a portfolio"""
    # Verify portfolio ownership and get asset
    result = await db.execute(
        select(PortfolioAsset)
        .join(Portfolio)
        .where(
            PortfolioAsset.id == asset_id,
            PortfolioAsset.portfolio_id == portfolio_id,
            Portfolio.owner_id == current_user.id
        )
    )
    asset = result.scalar_one_or_none()
    
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
    
    await db.delete(asset)
    await db.commit()
    
    return {"message": "Asset removed successfully"}


@router.get("/{portfolio_id}/risk-metrics", response_model=RiskMetricsResponse)
async def get_portfolio_risk_metrics(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get detailed risk metrics for a portfolio"""
    result = await db.execute(
        select(Portfolio)
        .where(Portfolio.id == portfolio_id, Portfolio.owner_id == current_user.id)
        .options(selectinload(Portfolio.assets))
    )
    portfolio = result.scalar_one_or_none()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    # Calculate risk metrics
    market_service = MarketDataService()
    risk_calculator = RiskCalculator()
    
    try:
        symbols = [asset.symbol for asset in portfolio.assets]
        if not symbols:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Portfolio has no assets"
            )
        
        # Get historical data for all assets
        historical_data = {}
        weights = {}
        total_value = 0
        
        for asset in portfolio.assets:
            hist_data = await market_service.get_historical_data(asset.symbol)
            current_price = await market_service.get_current_price(asset.symbol)
            
            if current_price:
                market_value = asset.quantity * current_price
                total_value += market_value
                historical_data[asset.symbol] = hist_data['close']
        
        # Calculate weights
        for asset in portfolio.assets:
            current_price = await market_service.get_current_price(asset.symbol)
            if current_price:
                market_value = asset.quantity * current_price
                weights[asset.symbol] = market_value / total_value if total_value > 0 else 0
        
        # Get market benchmark (SPY)
        market_data = await market_service.get_historical_data('SPY')
        market_prices = market_data['close'] if not market_data.empty else None
        
        # Calculate metrics
        metrics = risk_calculator.calculate_portfolio_metrics(
            historical_data, weights, market_prices
        )
        
        return RiskMetricsResponse(
            portfolio_id=portfolio_id,
            last_updated=datetime.now(),
            **metrics
        )
        
    finally:
        await market_service.close()


# Helper functions
async def _enrich_portfolio_with_market_data(portfolio: Portfolio, market_service: MarketDataService) -> PortfolioResponse:
    """Enrich portfolio with current market data"""
    enriched_assets = []
    total_value = 0
    total_cost = 0
    
    for asset in portfolio.assets:
        current_price = await market_service.get_current_price(asset.symbol)
        enriched_asset = _enrich_asset_with_market_data(asset, current_price)
        enriched_assets.append(enriched_asset)
        
        if enriched_asset.market_value:
            total_value += enriched_asset.market_value
        
        if asset.purchase_price:
            total_cost += asset.purchase_price * asset.quantity
    
    total_pnl = total_value - total_cost if total_cost > 0 else None
    
    return PortfolioResponse(
        id=portfolio.id,
        name=portfolio.name,
        description=portfolio.description,
        created_at=portfolio.created_at,
        updated_at=portfolio.updated_at,
        assets=enriched_assets,
        total_value=total_value,
        total_cost=total_cost,
        total_pnl=total_pnl
    )


def _enrich_asset_with_market_data(asset: PortfolioAsset, current_price: Optional[float]) -> PortfolioAssetResponse:
    """Enrich asset with current market data"""
    market_value = None
    unrealized_pnl = None
    
    if current_price:
        market_value = asset.quantity * current_price
        if asset.purchase_price:
            cost_basis = asset.quantity * asset.purchase_price
            unrealized_pnl = market_value - cost_basis
    
    return PortfolioAssetResponse(
        id=asset.id,
        symbol=asset.symbol,
        quantity=asset.quantity,
        purchase_price=asset.purchase_price,
        purchase_date=asset.purchase_date,
        current_price=current_price,
        market_value=market_value,
        unrealized_pnl=unrealized_pnl
    )
