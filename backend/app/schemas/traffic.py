from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class RoadSegmentSchema(BaseModel):
    id: str
    name: str
    corridor: str
    from_node: str
    to_node: str
    length_km: float
    speed_limit_kmh: float
    current_speed_kmh: float
    current_volume: int
    congestion_level: str
    risk_score: int
    coordinates: Optional[List[List[float]]] = None

class LiveTrafficSummary(BaseModel):
    status: str = "NORMAL"
    context_statement: str = "No major congestion nearby. Average corridor velocity 34 km/h."
    updated_at: str = "2 min ago"
    roads: List[RoadSegmentSchema]
    critical_roads: List[Dict[str, Any]]

class ForecastPoint(BaseModel):
    horizon_minutes: int
    horizon_label: str # "NOW", "+15", "+30", "+45", "+60"
    congestion: str # "Moderate", "Heavy", "Severe"
    speed_kmh: float
    risk_score: int
    spillover_probability: float

class RoadForecastResponse(BaseModel):
    road_id: str
    road_name: str
    summary: str
    timeline: List[ForecastPoint]

class PropagationNode(BaseModel):
    id: str
    name: str
    stage: int # 1, 2, 3, 4
    type: str # "origin", "junction", "corridor", "terminal"
    congestion_state: str
    delay_min: int
    coordinates: List[float]

class PropagationEdge(BaseModel):
    source: str
    target: str
    probability: float
    flow_rate_vph: int

class PropagationResponse(BaseModel):
    origin_road_id: str
    origin_road_name: str
    estimated_onset_min: int
    affected_corridor_km: float
    impact_level: str # HIGH, MODERATE, LOW
    chain_description: str
    nodes: List[PropagationNode]
    edges: List[PropagationEdge]
    propagation_speed_kmh: float
    bottleneck_junction: str

class RiskFactor(BaseModel):
    name: str
    score: int
    weight: float
    description: str
    severity: str # "high", "moderate", "low"

class RiskAssessmentResponse(BaseModel):
    road_id: str
    road_name: str
    risk_score: int # 87
    risk_level: str # HIGH RISK
    headline: str # "Severe congestion likely within 30 min."
    contributing_factors: List[RiskFactor]
    ai_recommendation: str

class WeatherObservation(BaseModel):
    temperature_c: float = 27.5
    condition: str = "Drizzle / Humid"
    humidity_pct: int = 78
    precipitation_mm: float = 2.4
    visibility_km: float = 7.5
    road_surface_risk: str = "Moderate friction reduction (-12% braking factor)"
    impact_statement: str = "Light evening drizzle is slowing Avinashi flyover merge rates."

class EventItem(BaseModel):
    id: str
    title: str
    category: str
    location: str
    severity: str
    impact_radius_km: float
    description: str
    context_note: str

class AlertItem(BaseModel):
    id: str
    title: str
    headline: str
    message: str
    severity: str
    delay_added_min: int
    alternative_route_id: str
    alternative_route_name: str
    time_saved_min: int
    road_id: str
    road_name: str
    created_at: str
    is_read: bool
