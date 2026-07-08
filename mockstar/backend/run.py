import uvicorn
from app.config import settings

if __name__ == "__main__":
    print(f"Starting Mockstar Backend Server on http://localhost:{settings.PORT}")
    print(f"Interactive Swagger Documentation available at http://localhost:{settings.PORT}/docs")
    
    # Run uvicorn server with hot-reloading enabled for development
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=settings.PORT, 
        reload=True
    )
