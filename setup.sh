#!/bin/bash

# Portfolio Risk Dashboard Setup Script
echo "🚀 Setting up Portfolio Risk Dashboard..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your API keys if needed."
else
    echo "✅ .env file already exists."
fi

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

# Display access information
echo ""
echo "🎉 Setup complete!"
echo ""
echo "📊 Access your Portfolio Risk Dashboard:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Documentation: http://localhost:8000/docs"
echo "   Demo (Static): Open demo.html in your browser"
echo ""
echo "🗄️  Database:"
echo "   PostgreSQL: localhost:5432"
echo "   Database: portfolio_db"
echo "   Username: portfolio_user"
echo "   Password: portfolio_pass"
echo ""
echo "📝 Next steps:"
echo "   1. Open http://localhost:3000 in your browser"
echo "   2. Register a new account or use the demo"
echo "   3. Create your first portfolio"
echo "   4. Add some assets (AAPL, GOOGL, MSFT, etc.)"
echo "   5. View real-time risk metrics"
echo ""
echo "🛠️  Development:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart: docker-compose restart"
echo ""
echo "💡 For demo purposes without full setup, open demo.html in your browser!"
