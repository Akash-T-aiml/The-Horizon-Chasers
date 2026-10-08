from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime
from app.db.session import Base

class EventModel(Base):
    __tablename__ = "traffic_events"

    id = Column(String(64), primary_key=True)
    title = Column(String(128), nullable=False)
    category = Column(String(64), nullable=False) # FESTIVAL, ACCIDENT, ROADWORK, WEATHER
    location = Column(String(128), nullable=False)
    corridor = Column(String(128), nullable=True)
    severity = Column(String(32), default="HIGH")
    impact_radius_km = Column(Float, default=2.5)
    description = Column(String(256), nullable=True)
    active = Column(Boolean, default=True)
