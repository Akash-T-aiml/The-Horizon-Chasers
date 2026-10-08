from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from app.db.session import Base

class AlertModel(Base):
    __tablename__ = "traffic_alerts"

    id = Column(String(64), primary_key=True)
    title = Column(String(128), default="TRAFFIC ALERT")
    headline = Column(String(256), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(32), default="WARNING") # INFO, WARNING, CRITICAL
    delay_added_min = Column(Integer, default=14)
    alternative_route_id = Column(String(32), default="ROUTE_B")
    alternative_route_name = Column(String(128), default="Route B")
    time_saved_min = Column(Integer, default=12)
    road_id = Column(String(64), default="lakshmi_mills_junction")
    road_name = Column(String(128), default="Lakshmi Mills Junction")
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
