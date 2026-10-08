from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime
from datetime import datetime
from app.db.session import Base

class RouteModel(Base):
    __tablename__ = "routes"

    id = Column(String(32), primary_key=True) # ROUTE_A, ROUTE_B, ROUTE_C
    name = Column(String(128), nullable=False) # Route B (Via Trichy Road / Ring Link)
    summary = Column(String(256), nullable=False)
    origin = Column(String(128), default="KPR Institute")
    destination = Column(String(128), default="Coimbatore Railway Station")
    distance_km = Column(Float, nullable=False)
    base_time_min = Column(Integer, nullable=False)
    current_time_min = Column(Integer, nullable=False)
    predicted_time_min = Column(Integer, nullable=False)
    time_saved_min = Column(Integer, default=0)
    risk_level = Column(String(32), default="LOW") # LOW, MEDIUM, HIGH
    risk_score = Column(Integer, default=25)
    is_recommended = Column(Boolean, default=False)
    badge = Column(String(64), nullable=True) # "RECOMMENDED", "SAVE 14 MIN", "HIGH RISK"
    path_geojson = Column(Text, nullable=True) # JSON coordinates
    corridors_json = Column(Text, nullable=True) # JSON array of road segments

class JourneyModel(Base):
    __tablename__ = "journeys"

    id = Column(String(64), primary_key=True)
    origin = Column(String(128), nullable=False)
    destination = Column(String(128), nullable=False)
    departure_time = Column(String(32), nullable=False)
    preference = Column(String(64), default="Balanced")
    selected_route_id = Column(String(32), nullable=True)
    status = Column(String(32), default="PLANNED") # PLANNED, ACTIVE, COMPLETED
    created_at = Column(DateTime, default=datetime.utcnow)
