from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from app.db.session import Base

class TrafficObservation(Base):
    __tablename__ = "traffic_observations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    road_id = Column(String(64), index=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    speed_kmh = Column(Float, nullable=False)
    volume_vph = Column(Integer, default=1200)
    density_vpkm = Column(Float, default=40.0)
    congestion_state = Column(String(32), default="NORMAL") # FREE, NORMAL, MODERATE, HEAVY, SEVERE

class TrafficForecast(Base):
    __tablename__ = "traffic_forecasts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    road_id = Column(String(64), index=True, nullable=False)
    horizon_minutes = Column(Integer, nullable=False) # 0, 15, 30, 45, 60
    predicted_speed_kmh = Column(Float, nullable=False)
    predicted_congestion = Column(String(32), nullable=False)
    risk_probability = Column(Float, default=0.5)
    generated_at = Column(DateTime, default=datetime.utcnow)
