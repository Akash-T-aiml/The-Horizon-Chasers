from typing import Dict, Any, List
from app.providers.demo_provider import DemoRoutingProvider

class RouteOptimizer:
    def __init__(self):
        self.routing_provider = DemoRoutingProvider()

    def compare_and_rank_routes(
        self,
        origin: str = "KPR Institute",
        destination: str = "Coimbatore Railway Station",
        preference: str = "Balanced"
    ) -> List[Dict[str, Any]]:
        candidate_routes = self.routing_provider.generate_candidate_routes(origin, destination, preference)

        # Multi-attribute decision ranking
        # score = travel_time + (risk_score * 0.4)
        def scoring_func(route):
            time_val = route["predicted_time_min"]
            risk_val = route["risk_score"]
            if preference == "Fastest":
                return time_val * 1.0 + risk_val * 0.1
            elif preference == "Avoid high-risk traffic":
                return time_val * 0.4 + risk_val * 1.2
            else: # Balanced
                return time_val * 0.7 + risk_val * 0.5

        # Sort so lowest combined penalty is first
        sorted_routes = sorted(candidate_routes, key=scoring_func)
        return sorted_routes

route_optimizer = RouteOptimizer()
