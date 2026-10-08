from typing import Dict, Any, List

class RiskEngine:
    def assess_road_risk(self, road_id: str = "avinashi_road") -> Dict[str, Any]:
        road_name_map = {
            "avinashi_road": "Avinashi Road Corridor",
            "anna_salai": "Anna Salai Arterial",
            "lakshmi_mills_junction": "Lakshmi Mills Bottleneck",
            "outer_ring_road": "Outer Ring Road Express",
            "trichy_road": "Trichy Road Link"
        }
        road_name = road_name_map.get(road_id, "Avinashi Road Corridor")

        # 87 / 100 HIGH RISK
        contributing_factors = [
            {
                "name": "Traffic Volume Surge",
                "score": 88,
                "weight": 0.25,
                "description": "Corridor throughput is at 94% of saturation capacity (3,400 vph vs 3,600 max design).",
                "severity": "high"
            },
            {
                "name": "Speed Velocity Drop",
                "score": 82,
                "weight": 0.20,
                "description": "Average speed has fallen from 42 km/h free flow down to 14 km/h (-66% reduction).",
                "severity": "high"
            },
            {
                "name": "Historical Friday Surge Pattern",
                "score": 91,
                "weight": 0.20,
                "description": "Historical records show Friday 18:30-19:30 consistently exhibits a 3.4x spike in queue delay.",
                "severity": "high"
            },
            {
                "name": "Upstream Congestion Spillover",
                "score": 85,
                "weight": 0.15,
                "description": "Shockwave from Hope College merge ramp is propagating backwards at 11 km/h.",
                "severity": "high"
            },
            {
                "name": "Festival Event Density",
                "score": 94,
                "weight": 0.10,
                "description": "Mariamman temple chariot procession within 500m causing pedestrian overflow.",
                "severity": "high"
            },
            {
                "name": "Weather Surface Friction",
                "score": 68,
                "weight": 0.10,
                "description": "Evening drizzle reduced pavement friction by 14%, increasing braking buffers.",
                "severity": "moderate"
            }
        ]

        return {
            "road_id": road_id,
            "road_name": road_name,
            "risk_score": 87,
            "risk_level": "HIGH RISK",
            "headline": "Severe congestion likely within 30 min.",
            "contributing_factors": contributing_factors,
            "ai_recommendation": "Divert immediately to Trichy Road Link (Route B) to bypass the 3.2 km corridor shockwave and save 14 minutes."
        }

risk_engine = RiskEngine()
