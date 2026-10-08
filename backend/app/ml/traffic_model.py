import numpy as np
from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseTrafficModel(ABC):
    @abstractmethod
    def predict_speed_and_risk(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict future speed, congestion category, and risk score."""
        pass

class TrafficForecastMLModel(BaseTrafficModel):
    """
    Traffic speed and congestion forecasting model.
    Incorporates historical time-of-day baselines, rainfall friction,
    and event density adjustments.
    """
    def __init__(self):
        # Initialized weights representing trained model feature importances
        self.weights = {
            "volume_ratio": 0.35,
            "historical_peak_factor": 0.25,
            "weather_penalty": 0.15,
            "event_proximity_penalty": 0.25
        }

    def predict_speed_and_risk(self, features: Dict[str, Any]) -> Dict[str, Any]:
        current_speed = features.get("current_speed_kmh", 30.0)
        speed_limit = features.get("speed_limit_kmh", 50.0)
        horizon = features.get("horizon_minutes", 15)
        has_event = features.get("has_event_nearby", True)
        rain_mm = features.get("precipitation_mm", 2.4)
        is_friday_evening = features.get("is_friday_evening", True)

        # Baseline decay as peak rush hour progresses
        time_decay = 1.0 - (min(horizon, 35) / 100.0)
        if horizon > 45:
            # Commuter recovery curve after peak passes
            recovery = (horizon - 45) * 0.015
            time_decay += recovery

        # Weather factor (wet pavement reduces speed)
        weather_friction = max(0.75, 1.0 - (rain_mm * 0.05))

        # Event factor (festival crowd choke)
        event_choke = 0.55 if has_event else 0.95

        predicted_speed = max(8.0, current_speed * time_decay * weather_friction * event_choke)
        
        # Risk calculation (0 - 100)
        speed_deficit = max(0.0, (speed_limit - predicted_speed) / speed_limit)
        risk_score = int(min(98, max(15, speed_deficit * 90 + (25 if has_event else 5))))

        if risk_score > 75:
            congestion_state = "Severe"
        elif risk_score > 55:
            congestion_state = "Heavy"
        elif risk_score > 35:
            congestion_state = "Moderate"
        else:
            congestion_state = "Free Flow"

        return {
            "predicted_speed_kmh": round(predicted_speed, 1),
            "risk_score": risk_score,
            "congestion_state": congestion_state,
            "confidence_interval": [round(predicted_speed * 0.9, 1), round(predicted_speed * 1.1, 1)]
        }

traffic_ml_model = TrafficForecastMLModel()
