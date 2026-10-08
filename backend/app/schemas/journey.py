from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class RouteOption(BaseModel):
    id: str # ROUTE_A, ROUTE_B, ROUTE_C
    name: str
    via: str
    distance_km: float
    current_time_min: int
    predicted_time_min: int
    time_saved_min: int
    risk_level: str # "LOW", "MEDIUM", "HIGH"
    risk_score: int # 0-100
    is_recommended: bool
    badge: Optional[str] = None
    tags: List[str]
    coordinates: List[List[float]]
    propagation_vulnerability: str
    delay_factors: List[str]

class DepartureSlot(BaseModel):
    offset_minutes: int # 0, 15, 30, 45, 60
    departure_time_label: str # "NOW", "+15", "+30", "+45", "+60"
    clock_time: str # "6:30 PM", "6:45 PM"
    travel_time_min: int # 35, 39, 52, 49, 37
    risk_level: str
    risk_score: int
    is_best_time: bool
    savings_vs_peak_min: int

class DepartureOptimizerResponse(BaseModel):
    recommended_departure: str # "NOW"
    departure_time: str # "6:30 PM"
    expected_travel_time_min: int # 35
    estimated_saving_min: int # 17 min saved vs peak 52 min
    reasoning: str
    slots: List[DepartureSlot]

class JourneyPredictRequest(BaseModel):
    origin: str = "KPR Institute"
    destination: str = "Coimbatore Railway Station"
    departure_time: str = "18:30"
    preference: str = "Balanced" # "Fastest", "Balanced", "Avoid high-risk traffic"

class JourneyPredictResponse(BaseModel):
    journey_id: str
    origin: str
    destination: str
    departure_time: str
    recommended_route_id: str
    routes: List[RouteOption]
    departure_optimization: DepartureOptimizerResponse
    prediction_steps: List[str]
    context_signals: Dict[str, Any]
