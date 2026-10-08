import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "TRAFFIX"
    APP_TAGLINE: str = "Predictive Traffic Decision Assistant"
    ENVIRONMENT: str = "development"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "*"
    ]
    DATABASE_URL: str = "sqlite:///./traffix.db"
    
    # Providers: demo, mappls, openweathermap, etc.
    TRAFFIC_PROVIDER: str = "demo"
    WEATHER_PROVIDER: str = "demo"
    EVENTS_PROVIDER: str = "demo"
    ROUTING_PROVIDER: str = "demo"

    # Seed context
    CORRIDOR_CITY: str = "Coimbatore"
    DEFAULT_ORIGIN: str = "KPR Institute"
    DEFAULT_DESTINATION: str = "Coimbatore Railway Station"
    DEFAULT_DEPARTURE_TIME: str = "18:30"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
