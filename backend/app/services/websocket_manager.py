import json
from typing import Dict, List, Set
from fastapi import WebSocket
from collections import defaultdict


class WebSocketManager:
    """Manages WebSocket connections and message broadcasting"""
    
    def __init__(self):
        # Active connections
        self.active_connections: List[WebSocket] = []
        # Symbol subscriptions per connection
        self.subscriptions: Dict[WebSocket, Set[str]] = defaultdict(set)
        # Reverse mapping: symbol -> set of connections
        self.symbol_subscribers: Dict[str, Set[WebSocket]] = defaultdict(set)
    
    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        self.subscriptions[websocket] = set()
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        # Remove from symbol subscriptions
        if websocket in self.subscriptions:
            symbols = self.subscriptions[websocket].copy()
            for symbol in symbols:
                self.symbol_subscribers[symbol].discard(websocket)
                if not self.symbol_subscribers[symbol]:
                    del self.symbol_subscribers[symbol]
            del self.subscriptions[websocket]
    
    async def subscribe_symbols(self, websocket: WebSocket, symbols: List[str]):
        """Subscribe a connection to specific symbols"""
        for symbol in symbols:
            self.subscriptions[websocket].add(symbol)
            self.symbol_subscribers[symbol].add(websocket)
        
        # Send confirmation
        await websocket.send_text(json.dumps({
            "type": "subscription_confirmed",
            "symbols": symbols
        }))
    
    async def unsubscribe_symbols(self, websocket: WebSocket, symbols: List[str]):
        """Unsubscribe a connection from specific symbols"""
        for symbol in symbols:
            self.subscriptions[websocket].discard(symbol)
            self.symbol_subscribers[symbol].discard(websocket)
            if not self.symbol_subscribers[symbol]:
                del self.symbol_subscribers[symbol]
        
        # Send confirmation
        await websocket.send_text(json.dumps({
            "type": "unsubscription_confirmed",
            "symbols": symbols
        }))
    
    def get_all_subscribed_symbols(self) -> List[str]:
        """Get all symbols that have at least one subscriber"""
        return list(self.symbol_subscribers.keys())
    
    async def broadcast_prices(self, prices: Dict[str, float]):
        """Broadcast price updates to subscribed connections"""
        if not prices:
            return
        
        # Group connections by the symbols they're subscribed to
        messages_to_send: Dict[WebSocket, Dict[str, float]] = defaultdict(dict)
        
        for symbol, price in prices.items():
            if symbol in self.symbol_subscribers:
                for websocket in self.symbol_subscribers[symbol]:
                    messages_to_send[websocket][symbol] = price
        
        # Send messages
        disconnected_connections = []
        for websocket, symbol_prices in messages_to_send.items():
            try:
                message = {
                    "type": "price_update",
                    "data": symbol_prices,
                    "timestamp": json.dumps(None, default=str)  # Will be replaced by current time
                }
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                print(f"Error sending message to WebSocket: {e}")
                disconnected_connections.append(websocket)
        
        # Clean up disconnected connections
        for websocket in disconnected_connections:
            self.disconnect(websocket)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send a message to a specific connection"""
        try:
            await websocket.send_text(message)
        except Exception as e:
            print(f"Error sending personal message: {e}")
            self.disconnect(websocket)
    
    async def broadcast_to_all(self, message: str):
        """Broadcast a message to all connected clients"""
        disconnected_connections = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                print(f"Error broadcasting to connection: {e}")
                disconnected_connections.append(connection)
        
        # Clean up disconnected connections
        for connection in disconnected_connections:
            self.disconnect(connection)
