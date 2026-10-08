from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from app.db.session import Base

class RoadSegment(Base):
    __tablename__ = "road_segments"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    corridor = Column(String(128), default="Coimbatore Metro")
    from_node = Column(String(64), nullable=False)
    to_node = Column(String(64), nullable=False)
    length_km = Column(Float, default=2.5)
    speed_limit_kmh = Column(Float, default=50.0)
    current_speed_kmh = Column(Float, default=32.0)
    current_volume = Column(Integer, default=1400) # vehicles/hr
    congestion_level = Column(String(32), default="NORMAL") # FREE, NORMAL, MODERATE, HEAVY, SEVERE
    risk_score = Column(Integer, default=35) # 0-100
    geometry_geojson = Column(Text, nullable=True) # JSON line coordinates
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
