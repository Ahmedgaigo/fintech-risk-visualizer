from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import json
from typing import List

from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, portfolios, market_data
from app.services.websocket_manager import WebSocketManager
from app.services.market_data_service import MarketDataService


# Create database tables
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Start market data service
    market_service = MarketDataService()
    websocket_manager = WebSocketManager()
    
    # Store services in app state
    app.state.market_service = market_service
    app.state.websocket_manager = websocket_manager
    
    # Start background task for price updates
    asyncio.create_task(price_update_task(market_service, websocket_manager))
    
    yield
    
    # Shutdown
    await market_service.close()


app = FastAPI(
    title="Portfolio Risk Dashboard API",
    description="Real-time portfolio risk analysis and management",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(portfolios.router, prefix="/portfolios", tags=["portfolios"])
app.include_router(market_data.router, prefix="/market-data", tags=["market-data"])


@app.get("/")
async def root():
    return {
        "message": "Portfolio Risk Dashboard API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.websocket("/ws/prices")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time price updates"""
    await app.state.websocket_manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and handle client messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "subscribe":
                symbols = message.get("symbols", [])
                await app.state.websocket_manager.subscribe_symbols(websocket, symbols)
            elif message.get("type") == "unsubscribe":
                symbols = message.get("symbols", [])
                await app.state.websocket_manager.unsubscribe_symbols(websocket, symbols)
                
    except WebSocketDisconnect:
        app.state.websocket_manager.disconnect(websocket)


async def price_update_task(market_service: MarketDataService, websocket_manager: WebSocketManager):
    """Background task to fetch and broadcast price updates"""
    while True:
        try:
            # Get all subscribed symbols
            symbols = websocket_manager.get_all_subscribed_symbols()
            
            if symbols:
                # Fetch latest prices
                prices = await market_service.get_multiple_prices(symbols)
                
                # Broadcast to all connected clients
                await websocket_manager.broadcast_prices(prices)
            
            # Wait 5 seconds before next update
            await asyncio.sleep(5)
            
        except Exception as e:
            print(f"Error in price update task: {e}")
            await asyncio.sleep(10)  # Wait longer on error


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
