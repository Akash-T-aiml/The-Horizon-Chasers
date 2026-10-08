from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import router as api_router
from app.db.session import engine, Base

# Create tables if not existing
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="Traffix Predictive Traffic Decision Assistant API. Real-time forecasting, propagation modeling, departure optimization, and route recommendation.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow dev frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "product": settings.APP_NAME,
        "tagline": settings.APP_TAGLINE,
        "status": "operational",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
