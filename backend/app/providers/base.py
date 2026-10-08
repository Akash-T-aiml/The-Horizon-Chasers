from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class TrafficProvider(ABC):
    @abstractmethod
    def get_live_traffic(self) -> Dict[str, Any]:
        """Fetch current live road segments and corridor conditions."""
        pass

    @abstractmethod
    def get_road_details(self, road_id: str) -> Optional[Dict[str, Any]]:
        """Fetch specific road metrics."""
        pass

class WeatherProvider(ABC):
    @abstractmethod
    def get_current_weather(self, city: str = "Coimbatore") -> Dict[str, Any]:
        """Fetch weather condition, rain intensity, surface friction factor."""
        pass

class EventsProvider(ABC):
    @abstractmethod
    def get_active_events(self, city: str = "Coimbatore") -> List[Dict[str, Any]]:
        """Fetch festivals, roadworks, sports/college events near transit corridors."""
        pass

class RoutingProvider(ABC):
    @abstractmethod
    def generate_candidate_routes(self, origin: str, destination: str, preference: str) -> List[Dict[str, Any]]:
        """Compute candidate routes between origin and destination."""
        pass

class ForecastProvider(ABC):
    @abstractmethod
    def forecast_road(self, road_id: str, horizon_minutes: List[int]) -> Dict[str, Any]:
        """Forecast road state for future horizons."""
        pass
