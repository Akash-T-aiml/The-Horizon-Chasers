from typing import List, Dict, Any, Optional
from app.providers.base import (
    TrafficProvider, WeatherProvider, EventsProvider,
    RoutingProvider, ForecastProvider
)

# Coimbatore key coordinates
COORDINATES = {
    "kpr_institute": [11.0827, 77.0607],
    "neelambur_bypass": [11.0650, 77.0520],
    "hope_college": [11.0250, 77.0090],
    "peelamedu": [11.0210, 76.9980],
    "lakshmi_mills": [11.0145, 76.9820],
    "gandhipuram": [11.0180, 76.9680],
    "anna_salai": [11.0130, 76.9660],
    "trichy_road_sungam": [10.9980, 76.9780],
    "outer_ring_road": [11.0420, 77.0350],
    "railway_station": [10.9972, 76.9635],
}

class DemoTrafficProvider(TrafficProvider):
    def get_live_traffic(self) -> Dict[str, Any]:
        roads = [
            {
                "id": "anna_salai",
                "name": "Anna Salai",
                "corridor": "Gandhipuram - City Center",
                "from_node": "Gandhipuram",
                "to_node": "Railway Station",
                "length_km": 3.8,
                "speed_limit_kmh": 40.0,
                "current_speed_kmh": 16.0,
                "current_volume": 2850,
                "congestion_level": "HEAVY",
                "risk_score": 78,
                "coordinates": [
                    [11.0180, 76.9680],
                    [11.0130, 76.9660],
                    [11.0050, 76.9645],
                    [10.9972, 76.9635]
                ]
            },
            {
                "id": "avinashi_road",
                "name": "Avinashi Road",
                "corridor": "Airport - Lakshmi Mills Expressway",
                "from_node": "Hope College",
                "to_node": "Lakshmi Mills",
                "length_km": 5.4,
                "speed_limit_kmh": 50.0,
                "current_speed_kmh": 24.0,
                "current_volume": 2420,
                "congestion_level": "MODERATE",
                "risk_score": 72,
                "coordinates": [
                    [11.0450, 77.0380],
                    [11.0315, 77.0255],
                    [11.0250, 77.0090],
                    [11.0210, 76.9980],
                    [11.0145, 76.9820]
                ]
            },
            {
                "id": "outer_ring_road",
                "name": "Outer Ring Road",
                "corridor": "Neelambur - Irugur Freight Bypass",
                "from_node": "Neelambur",
                "to_node": "Singanallur Junction",
                "length_km": 8.2,
                "speed_limit_kmh": 60.0,
                "current_speed_kmh": 12.0,
                "current_volume": 3200,
                "congestion_level": "SEVERE",
                "risk_score": 89,
                "coordinates": [
                    [11.0650, 77.0520],
                    [11.0420, 77.0350],
                    [11.0150, 77.0280],
                    [10.9920, 77.0210]
                ]
            },
            {
                "id": "trichy_road",
                "name": "Trichy Road Link",
                "corridor": "Singanallur - Sungam Arterial",
                "from_node": "Singanallur",
                "to_node": "Railway Station South",
                "length_km": 6.1,
                "speed_limit_kmh": 50.0,
                "current_speed_kmh": 42.0,
                "current_volume": 1150,
                "congestion_level": "NORMAL",
                "risk_score": 24,
                "coordinates": [
                    [11.0020, 77.0250],
                    [10.9980, 76.9980],
                    [10.9980, 76.9780],
                    [10.9972, 76.9635]
                ]
            },
            {
                "id": "lakshmi_mills_junction",
                "name": "Lakshmi Mills Junction",
                "corridor": "Central Metro Core",
                "from_node": "Peelamedu",
                "to_node": "Gandhipuram Crosscut",
                "length_km": 2.1,
                "speed_limit_kmh": 35.0,
                "current_speed_kmh": 9.0,
                "current_volume": 3400,
                "congestion_level": "SEVERE",
                "risk_score": 92,
                "coordinates": [
                    [11.0210, 76.9980],
                    [11.0170, 76.9890],
                    [11.0145, 76.9820],
                    [11.0160, 76.9740]
                ]
            }
        ]

        critical_roads = [
            {"name": "Anna Salai", "state": "Heavy", "color": "orange"},
            {"name": "Avinashi Road", "state": "Moderate", "color": "amber"},
            {"name": "Outer Ring Road", "state": "Severe", "color": "rose"},
            {"name": "Trichy Road Link", "state": "Normal", "color": "emerald"},
            {"name": "Lakshmi Mills", "state": "Severe", "color": "rose"}
        ]

        return {
            "status": "NORMAL",
            "context_statement": "No major regional gridlock nearby. Localized queue forming on Avinashi-Lakshmi corridor.",
            "updated_at": "2 min ago",
            "roads": roads,
            "critical_roads": critical_roads
        }

    def get_road_details(self, road_id: str) -> Optional[Dict[str, Any]]:
        live = self.get_live_traffic()
        for r in live["roads"]:
            if r["id"] == road_id:
                return r
        return live["roads"][0]

class DemoWeatherProvider(WeatherProvider):
    def get_current_weather(self, city: str = "Coimbatore") -> Dict[str, Any]:
        return {
            "city": city,
            "temperature_c": 27.5,
            "condition": "Evening Drizzle / Overcast",
            "humidity_pct": 78,
            "precipitation_mm": 2.4,
            "visibility_km": 7.5,
            "road_surface_risk": "Moderate friction reduction (-14% braking coefficient)",
            "impact_statement": "Wet asphalt on flyovers is increasing follow-distance buffer by 22%."
        }

class DemoEventsProvider(EventsProvider):
    def get_active_events(self, city: str = "Coimbatore") -> List[Dict[str, Any]]:
        return [
            {
                "id": "festival_mariamman_01",
                "title": "Annual Mariamman Chariot Procession",
                "category": "FESTIVAL",
                "location": "Lakshmi Mills & Puliakulam Junction",
                "corridor": "Avinashi Road Core",
                "severity": "HIGH",
                "impact_radius_km": 2.8,
                "description": "Devotee gathering and temple procession causing lane diversion on Westbound corridor.",
                "context_note": "Festival traffic is compounding evening commuter load near Lakshmi Mills."
            },
            {
                "id": "flyover_expansion_02",
                "title": "Avinashi Elevated Expressway Ramp Work",
                "category": "ROADWORK",
                "location": "Hope College Pier 42",
                "corridor": "Avinashi Road",
                "severity": "MODERATE",
                "impact_radius_km": 1.2,
                "description": "Right-turn lane constriction between 6:00 PM and 9:00 PM.",
                "context_note": "Bottleneck upstream of Peelamedu."
            }
        ]

class DemoRoutingProvider(RoutingProvider):
    def generate_candidate_routes(self, origin: str, destination: str, preference: str) -> List[Dict[str, Any]]:
        return [
            {
                "id": "ROUTE_B",
                "name": "Route B",
                "via": "Via Trichy Road / Ring Link",
                "distance_km": 19.5,
                "current_time_min": 35,
                "predicted_time_min": 38,
                "time_saved_min": 14,
                "risk_level": "LOW",
                "risk_score": 25,
                "is_recommended": True,
                "badge": "RECOMMENDED",
                "tags": ["Fastest Predicted", "Bypasses Festival", "Save 14 min"],
                "propagation_vulnerability": "Low (Segregated southern arterial bypass)",
                "delay_factors": ["Minor signal queue at Sungam Junction (-2 min)"],
                "coordinates": [
                    [11.0827, 77.0607], # KPR Institute
                    [11.0650, 77.0520], # Neelambur
                    [11.0420, 77.0350], # Ring road transition
                    [11.0150, 77.0280], # Singanallur bypass
                    [10.9980, 76.9980], # Trichy Rd arterial
                    [10.9980, 76.9780], # Sungam
                    [10.9972, 76.9635]  # Coimbatore Railway Station
                ]
            },
            {
                "id": "ROUTE_C",
                "name": "Route C",
                "via": "Via Sathy Road / Gandhipuram Bypass",
                "distance_km": 21.0,
                "current_time_min": 42,
                "predicted_time_min": 44,
                "time_saved_min": 8,
                "risk_level": "MEDIUM",
                "risk_score": 54,
                "is_recommended": False,
                "badge": "MODERATE RISK",
                "tags": ["Alternative Corridor", "Extra 1.5 km"],
                "propagation_vulnerability": "Moderate (Sensitive to Gandhipuram spillover)",
                "delay_factors": ["Crosscut signal cycle delay", "Market goods unloading"],
                "coordinates": [
                    [11.0827, 77.0607], # KPR
                    [11.0680, 77.0250], # Sathy rd feeder
                    [11.0450, 76.9950], # Ganapathy
                    [11.0250, 76.9800], # North Gandhipuram
                    [11.0180, 76.9680], # Gandhipuram
                    [10.9972, 76.9635]  # Station
                ]
            },
            {
                "id": "ROUTE_A",
                "name": "Route A",
                "via": "Via Avinashi Road Main",
                "distance_km": 18.2,
                "current_time_min": 36,
                "predicted_time_min": 52,
                "time_saved_min": 0,
                "risk_level": "HIGH",
                "risk_score": 87,
                "is_recommended": False,
                "badge": "HIGH RISK",
                "tags": ["Direct Distance", "Festival Bottleneck Ahead", "+16 min delay"],
                "propagation_vulnerability": "Critical (Directly inside 3.2 km propagation shockwave)",
                "delay_factors": [
                    "Mariamman temple crowd spillover at Lakshmi Mills",
                    "Elevated corridor ramp pinch point",
                    "Rain-slowed merge friction"
                ],
                "coordinates": [
                    [11.0827, 77.0607], # KPR
                    [11.0600, 77.0450], # Goldwins
                    [11.0315, 77.0255], # Airport / CIT
                    [11.0250, 77.0090], # Hope College
                    [11.0210, 76.9980], # Peelamedu
                    [11.0145, 76.9820], # Lakshmi Mills (Hotspot)
                    [11.0130, 76.9660], # Anna Salai
                    [10.9972, 76.9635]  # Station
                ]
            }
        ]

class DemoForecastProvider(ForecastProvider):
    def forecast_road(self, road_id: str = "anna_salai", horizon_minutes: List[int] = [0, 15, 30, 45, 60]) -> Dict[str, Any]:
        road_name_map = {
            "anna_salai": "Anna Salai",
            "avinashi_road": "Avinashi Road",
            "lakshmi_mills_junction": "Lakshmi Mills Junction",
            "outer_ring_road": "Outer Ring Road",
            "trichy_road": "Trichy Road Link"
        }
        name = road_name_map.get(road_id, "Anna Salai")
        
        timeline = [
            {
                "horizon_minutes": 0,
                "horizon_label": "NOW",
                "congestion": "Moderate",
                "speed_kmh": 28.0,
                "risk_score": 52,
                "spillover_probability": 0.25
            },
            {
                "horizon_minutes": 15,
                "horizon_label": "+15",
                "congestion": "Heavy",
                "speed_kmh": 18.0,
                "risk_score": 74,
                "spillover_probability": 0.65
            },
            {
                "horizon_minutes": 30,
                "horizon_label": "+30",
                "congestion": "Severe",
                "speed_kmh": 11.0,
                "risk_score": 89,
                "spillover_probability": 0.92
            },
            {
                "horizon_minutes": 45,
                "horizon_label": "+45",
                "congestion": "Severe",
                "speed_kmh": 13.0,
                "risk_score": 86,
                "spillover_probability": 0.88
            },
            {
                "horizon_minutes": 60,
                "horizon_label": "+60",
                "congestion": "Heavy",
                "speed_kmh": 22.0,
                "risk_score": 68,
                "spillover_probability": 0.55
            }
        ]

        return {
            "road_id": road_id,
            "road_name": name,
            "summary": "Congestion sharply climbs between T+15 and T+30 min as festival arrival overlaps with peak office dismissals.",
            "timeline": timeline
        }
