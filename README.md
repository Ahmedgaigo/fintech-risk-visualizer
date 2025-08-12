# fintech-risk-visualizer
# Real-Time Portfolio Risk Dashboard

A comprehensive web-based dashboard for real-time portfolio risk analysis and management.

## Features

- **Real-time Portfolio Management**: Create and manage investment portfolios with live price updates
- **Risk Analytics**: Calculate Sharpe ratio, Beta, Volatility, and Value at Risk (VaR)
- **Live Data Streaming**: WebSocket-powered real-time market data updates
- **Interactive Visualizations**: Dynamic charts and graphs using Recharts
- **User Authentication**: Secure JWT-based user accounts
- **Data Persistence**: PostgreSQL database for portfolios and user data

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **WebSocket** for real-time updates

### Backend
- **FastAPI** (Python) with async support
- **WebSocket** endpoints for live data streaming
- **SQLAlchemy** ORM with PostgreSQL
- **Pandas/NumPy** for financial calculations
- **JWT** authentication

### External APIs
- **Polygon.io** for real-time market data
- **Alpha Vantage** as backup data source

## Project Structure

```
portfolio-risk-dashboard/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── public/
│   └── package.json
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core functionality
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── requirements.txt
│   └── main.py
├── docker-compose.yml       # Development environment
├── .env.example            # Environment variables template
└── README.md
```

## Quick Start

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd portfolio-risk-dashboard
   cp .env.example .env
   ```

2. **Start with Docker**:
   ```bash
   docker-compose up -d
   ```

3. **Or run manually**:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   
   # Frontend
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Risk Metrics

### Sharpe Ratio
Measures risk-adjusted return:
```
Sharpe = (Portfolio Return - Risk-free Rate) / Portfolio Volatility
```

### Beta
Measures market sensitivity:
```
Beta = Covariance(Portfolio, Market) / Variance(Market)
```

### Value at Risk (VaR)
Estimates potential loss at 95% confidence:
```
VaR = Portfolio Mean - (1.65 * Portfolio Standard Deviation)
```

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /portfolios` - Get user portfolios
- `POST /portfolios` - Create new portfolio
- `PUT /portfolios/{id}` - Update portfolio
- `DELETE /portfolios/{id}` - Delete portfolio
- `GET /market-data/{symbol}` - Get real-time price data
- `WebSocket /ws/prices` - Live price updates

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Market Data API
POLYGON_API_KEY=your-polygon-api-key
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-api-key

# Redis (for caching)
REDIS_URL=redis://localhost:6379
```

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Quality
```bash
# Backend
black app/
flake8 app/

# Frontend
npm run lint
npm run type-check
```

## Deployment

The application is configured for deployment on:
- **Render** (recommended)
- **Railway**
- **Heroku**

See deployment guides in `/docs` folder.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
