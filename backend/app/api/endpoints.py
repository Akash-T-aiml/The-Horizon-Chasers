from fastapi import APIRouter, HTTPException, Query, Body
from typing import Dict, Any, List, Optional
from app.services.traffic_service import traffic_service
from app.optimization.route_optimizer import route_optimizer
from app.optimization.departure_optimizer import departure_optimizer
from app.schemas.traffic import (
    LiveTrafficSummary, RoadForecastResponse, PropagationResponse,
    RiskAssessmentResponse, WeatherObservation, EventItem, AlertItem
)
from app.schemas.journey import (
    JourneyPredictRequest, JourneyPredictResponse, DepartureOptimizerResponse,
    RouteOption
)

router = APIRouter()

@router.get("/health", tags=["System"])
def health_check():
    return {
        "status": "online",
        "service": "Traffix Predictive Engine",
        "version": "1.0.0",
        "providers": {
            "traffic": "demo",
            "weather": "demo",
            "events": "demo",
            "routing": "demo",
            "ml_engine": "active"
        }
    }

@router.get("/traffic/live", response_model=LiveTrafficSummary, tags=["Traffic"])
def get_live_traffic():
    return traffic_service.get_live_traffic_summary()

@router.get("/traffic/forecast/{road_id}", response_model=RoadForecastResponse, tags=["Traffic"])
def get_traffic_forecast(road_id: str):
    return traffic_service.get_road_forecast(road_id)

@router.get("/traffic/propagation/{road_id}", response_model=PropagationResponse, tags=["Propagation"])
def get_traffic_propagation(road_id: str):
    return traffic_service.get_propagation_analysis(road_id)

@router.get("/weather", response_model=WeatherObservation, tags=["Context"])
def get_weather():
    return traffic_service.get_weather_data()

@router.get("/events", response_model=List[EventItem], tags=["Context"])
def get_events():
    return traffic_service.get_events_data()

@router.get("/alerts", response_model=List[AlertItem], tags=["Alerts"])
def get_alerts():
    return traffic_service.get_active_alerts()

@router.post("/journeys/predict", response_model=JourneyPredictResponse, tags=["Journeys"])
def predict_journey(request: JourneyPredictRequest):
    return traffic_service.predict_journey(
        origin=request.origin,
        destination=request.destination,
        departure_time=request.departure_time,
        preference=request.preference
    )

@router.post("/routes/compare", response_model=List[RouteOption], tags=["Routes"])
def compare_routes(
    origin: str = Body(default="KPR Institute"),
    destination: str = Body(default="Coimbatore Railway Station"),
    preference: str = Body(default="Balanced")
):
    return route_optimizer.compare_and_rank_routes(origin, destination, preference)

@router.post("/departure/optimize", response_model=DepartureOptimizerResponse, tags=["Routes"])
def optimize_departure(
    base_time: str = Body(default="6:30 PM", embed=True),
    origin: str = Body(default="KPR Institute", embed=True),
    destination: str = Body(default="Coimbatore Railway Station", embed=True)
):
    return departure_optimizer.evaluate_departure_window(base_time, origin, destination)

@router.get("/routes/{route_id}", response_model=RouteOption, tags=["Routes"])
def get_route_details(route_id: str):
    routes = route_optimizer.compare_and_rank_routes()
    for r in routes:
        if r["id"] == route_id:
            return r
    if routes:
        return routes[0]
    raise HTTPException(status_code=404, detail="Route not found")

@router.get("/journeys/{journey_id}", response_model=JourneyPredictResponse, tags=["Journeys"])
def get_journey(journey_id: str):
    return traffic_service.predict_journey(
        origin="KPR Institute",
        destination="Coimbatore Railway Station",
        departure_time="6:30 PM",
        preference="Balanced"
    )

@router.get("/risk/{road_id}", response_model=RiskAssessmentResponse, tags=["Risk"])
def get_road_risk(road_id: str):
    return traffic_service.get_risk_assessment(road_id)
