import json
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.providers.demo_provider import (
    DemoTrafficProvider, DemoWeatherProvider,
    DemoEventsProvider, DemoForecastProvider
)
from app.optimization.propagation_engine import propagation_engine
from app.optimization.risk_engine import risk_engine
from app.optimization.departure_optimizer import departure_optimizer
from app.optimization.route_optimizer import route_optimizer
from app.models.road import RoadSegment
from app.models.alert import AlertModel

class TrafficService:
    def __init__(self):
        self.traffic_provider = DemoTrafficProvider()
        self.weather_provider = DemoWeatherProvider()
        self.events_provider = DemoEventsProvider()
        self.forecast_provider = DemoForecastProvider()

    def get_live_traffic_summary(self) -> Dict[str, Any]:
        return self.traffic_provider.get_live_traffic()

    def get_road_forecast(self, road_id: str) -> Dict[str, Any]:
        return self.forecast_provider.forecast_road(road_id)

    def get_propagation_analysis(self, road_id: str) -> Dict[str, Any]:
        return propagation_engine.compute_propagation(road_id)

    def get_weather_data(self) -> Dict[str, Any]:
        return self.weather_provider.get_current_weather()

    def get_events_data(self) -> List[Dict[str, Any]]:
        return self.events_provider.get_active_events()

    def get_risk_assessment(self, road_id: str) -> Dict[str, Any]:
        return risk_engine.assess_road_risk(road_id)

    def get_active_alerts(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "alert_lakshmi_mills_01",
                "title": "TRAFFIC ALERT",
                "headline": "Congestion predicted ahead on Avinashi Road corridor.",
                "message": "Congestion predicted ahead. Your route may add 14 minutes. Route B could save 12 minutes.",
                "severity": "CRITICAL",
                "delay_added_min": 14,
                "alternative_route_id": "ROUTE_B",
                "alternative_route_name": "Route B (Via Trichy Road / Ring Link)",
                "time_saved_min": 12,
                "road_id": "lakshmi_mills_junction",
                "road_name": "Lakshmi Mills Corridor",
                "created_at": "Just now",
                "is_read": False
            },
            {
                "id": "alert_weather_drizzle_02",
                "title": "WEATHER ADVISORY",
                "headline": "Evening drizzle slowing Avinashi flyover merge rates.",
                "message": "Wet pavement has increased average stopping distances. Elevated ramps operating at 65% capacity.",
                "severity": "INFO",
                "delay_added_min": 4,
                "alternative_route_id": "ROUTE_B",
                "alternative_route_name": "Route B",
                "time_saved_min": 5,
                "road_id": "hope_college",
                "road_name": "Hope College Elevated Ramp",
                "created_at": "12 min ago",
                "is_read": True
            }
        ]

    def predict_journey(self, origin: str, destination: str, departure_time: str, preference: str) -> Dict[str, Any]:
        routes = route_optimizer.compare_and_rank_routes(origin, destination, preference)
        dep_opt = departure_optimizer.evaluate_departure_window(departure_time, origin, destination)

        prediction_steps = [
            "Reading current traffic sensors and probe velocities",
            "Analyzing historical Friday evening commute patterns",
            "Checking real-time weather & Mariamman temple festival events",
            "Forecasting congestion accumulation at Lakshmi Mills bottleneck",
            "Tracing shockwave propagation through downstream network",
            "Comparing multi-corridor candidate travel times",
            "Generating optimal route and departure recommendation"
        ]

        weather = self.get_weather_data()
        events = self.get_events_data()

        return {
            "journey_id": "journey_kpr_station_01",
            "origin": origin,
            "destination": destination,
            "departure_time": departure_time,
            "recommended_route_id": "ROUTE_B",
            "routes": routes,
            "departure_optimization": dep_opt,
            "prediction_steps": prediction_steps,
            "context_signals": {
                "weather": weather["condition"],
                "rainfall_mm": weather["precipitation_mm"],
                "active_events_count": len(events),
                "primary_event": events[0]["title"] if events else None,
                "corridor_risk_score": 87
            }
        }

traffic_service = TrafficService()
