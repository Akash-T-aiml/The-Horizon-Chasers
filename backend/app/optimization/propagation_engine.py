import networkx as nx
from typing import Dict, Any, List

class CongestionPropagationEngine:
    def __init__(self):
        self.graph = nx.DiGraph()
        self._build_corridor_graph()

    def _build_corridor_graph(self):
        # Nodes: Road A (Avinashi Rd East) -> Junction B (Lakshmi Mills Junction) -> Road C (Anna Salai North) -> Road D (Station Approach Corridor)
        self.graph.add_node("road_a", name="Road A (Avinashi Road East)", stage=1, type="origin", delay_min=4, coordinates=[11.0250, 77.0090])
        self.graph.add_node("junction_b", name="Junction B (Lakshmi Mills)", stage=2, type="junction", delay_min=12, coordinates=[11.0145, 76.9820])
        self.graph.add_node("road_c", name="Road C (Anna Salai North)", stage=3, type="corridor", delay_min=9, coordinates=[11.0130, 76.9660])
        self.graph.add_node("road_d", name="Road D (Station Approach)", stage=4, type="terminal", delay_min=7, coordinates=[10.9972, 76.9635])

        self.graph.add_edge("road_a", "junction_b", probability=0.94, flow_rate_vph=2850)
        self.graph.add_edge("junction_b", "road_c", probability=0.88, flow_rate_vph=2400)
        self.graph.add_edge("road_c", "road_d", probability=0.79, flow_rate_vph=2100)

    def compute_propagation(self, origin_road_id: str = "road_a") -> Dict[str, Any]:
        nodes_data = []
        for n, data in self.graph.nodes(data=True):
            # assign congestion state based on stage
            state = "SEVERE" if data["stage"] <= 2 else ("HEAVY" if data["stage"] == 3 else "MODERATE")
            nodes_data.append({
                "id": n,
                "name": data["name"],
                "stage": data["stage"],
                "type": data["type"],
                "congestion_state": state,
                "delay_min": data["delay_min"],
                "coordinates": data["coordinates"]
            })

        edges_data = []
        for u, v, data in self.graph.edges(data=True):
            edges_data.append({
                "source": u,
                "target": v,
                "probability": data["probability"],
                "flow_rate_vph": data["flow_rate_vph"]
            })

        return {
            "origin_road_id": "road_a",
            "origin_road_name": "Road A (Avinashi Road East)",
            "estimated_onset_min": 18,
            "affected_corridor_km": 3.2,
            "impact_level": "HIGH",
            "chain_description": "Road A (Avinashi East) → Junction B (Lakshmi Mills) → Road C (Anna Salai) → Road D (Station Approach)",
            "nodes": nodes_data,
            "edges": edges_data,
            "propagation_speed_kmh": 10.8,
            "bottleneck_junction": "Junction B (Lakshmi Mills Junction)"
        }

propagation_engine = CongestionPropagationEngine()
