# Deployment Guide

This guide covers deploying the Portfolio Risk Dashboard to various cloud platforms.

## Quick Deploy Options

### 1. Render (Recommended)

**Backend Deployment:**
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:port/db
   SECRET_KEY=your-secret-key
   POLYGON_API_KEY=your-api-key (optional)
   ALPHA_VANTAGE_API_KEY=your-api-key (optional)
   ```

**Frontend Deployment:**
1. Create a new Static Site on Render
2. Set build command: `cd frontend && npm install && npm run build`
3. Set publish directory: `frontend/build`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.onrender.com`

**Database:**
- Use Render's PostgreSQL add-on or external service like Supabase

### 2. Railway

1. Connect GitHub repository
2. Deploy backend and frontend as separate services
3. Railway will auto-detect and deploy both services
4. Add environment variables in Railway dashboard

### 3. Heroku

**Backend:**
```bash
# Install Heroku CLI
heroku create your-app-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set SECRET_KEY=your-secret-key
git subtree push --prefix backend heroku main
```

**Frontend:**
```bash
heroku create your-app-frontend
heroku buildpacks:set mars/create-react-app
heroku config:set REACT_APP_API_URL=https://your-backend.herokuapp.com
git subtree push --prefix frontend heroku main
```

### 4. Vercel + PlanetScale

**Frontend (Vercel):**
1. Import project from GitHub
2. Set framework preset to "Create React App"
3. Set root directory to `frontend`
4. Add environment variables

**Backend (Vercel Serverless):**
1. Create `vercel.json` in backend directory:
```json
{
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ]
}
```

**Database (PlanetScale):**
- Create PlanetScale database
- Update DATABASE_URL in environment variables

## Environment Variables

### Backend
```env
DATABASE_URL=postgresql://user:pass@host:port/db
SECRET_KEY=your-super-secret-key
POLYGON_API_KEY=your-polygon-key
ALPHA_VANTAGE_API_KEY=your-alpha-vantage-key
CORS_ORIGINS=["https://your-frontend-domain.com"]
```

### Frontend
```env
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_WS_URL=wss://your-backend-domain.com
```

## Database Setup

### PostgreSQL Schema
The application will automatically create tables on startup. For production, consider running migrations manually:

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    full_name VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Portfolios table
CREATE TABLE portfolios (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Portfolio assets table
CREATE TABLE portfolio_assets (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolios(id),
    symbol VARCHAR NOT NULL,
    quantity FLOAT NOT NULL,
    purchase_price FLOAT,
    purchase_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);
```

## Production Considerations

### Security
- Use strong SECRET_KEY (generate with `openssl rand -hex 32`)
- Enable HTTPS in production
- Set proper CORS origins
- Use environment variables for all secrets
- Consider rate limiting for API endpoints

### Performance
- Enable Redis for caching (optional)
- Use CDN for frontend assets
- Consider database connection pooling
- Monitor API response times

### Monitoring
- Set up application monitoring (Sentry, DataDog)
- Monitor database performance
- Set up alerts for API failures
- Track WebSocket connection health

### Scaling
- Use horizontal scaling for backend services
- Consider database read replicas for heavy read workloads
- Implement caching for market data
- Use message queues for background tasks

## Docker Production Deployment

### Docker Compose for Production
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/portfolio_db
      - SECRET_KEY=${SECRET_KEY}
    depends_on:
      - db
    restart: unless-stopped

  frontend:
    build: ./frontend
    environment:
      - REACT_APP_API_URL=https://your-domain.com/api
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=portfolio_db
      - POSTGRES_USER=portfolio_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Nginx Configuration
```nginx
upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /ws/ {
        proxy_pass http://backend/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        proxy_pass http://frontend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS_ORIGINS includes your frontend domain
   - Check that API URL is correct in frontend

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database server is accessible
   - Ensure database exists and user has permissions

3. **WebSocket Connection Failures**
   - Check WebSocket URL configuration
   - Verify proxy settings for WebSocket upgrade
   - Ensure firewall allows WebSocket connections

4. **API Key Issues**
   - Market data will fall back to mock data if API keys are missing
   - Verify API key format and permissions
   - Check API rate limits

### Health Checks

Add health check endpoints:
```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.get("/health/db")
async def db_health_check(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}
```

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Check API endpoint responses
5. Monitor WebSocket connections

Remember to test your deployment thoroughly before going live!
