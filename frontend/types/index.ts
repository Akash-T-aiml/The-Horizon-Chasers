export interface RoadSegment {
  id: string;
  name: string;
  corridor: string;
  from_node: string;
  to_node: string;
  length_km: number;
  speed_limit_kmh: number;
  current_speed_kmh: number;
  current_volume: number;
  congestion_level: 'FREE' | 'NORMAL' | 'MODERATE' | 'HEAVY' | 'SEVERE';
  risk_score: number;
  coordinates?: [number, number][];
}

export interface LiveTrafficSummary {
  status: string;
  context_statement: string;
  updated_at: string;
  roads: RoadSegment[];
  critical_roads: {
    name: string;
    state: string;
    color: string;
  }[];
}

export interface ForecastPoint {
  horizon_minutes: number;
  horizon_label: string;
  congestion: string;
  speed_kmh: number;
  risk_score: number;
  spillover_probability: number;
}

export interface RoadForecastResponse {
  road_id: string;
  road_name: string;
  summary: string;
  timeline: ForecastPoint[];
}

export interface PropagationNode {
  id: string;
  name: string;
  stage: number;
  type: string;
  congestion_state: string;
  delay_min: number;
  coordinates: [number, number];
}

export interface PropagationEdge {
  source: string;
  target: string;
  probability: number;
  flow_rate_vph: number;
}

export interface PropagationResponse {
  origin_road_id: string;
  origin_road_name: string;
  estimated_onset_min: number;
  affected_corridor_km: number;
  impact_level: string;
  chain_description: string;
  nodes: PropagationNode[];
  edges: PropagationEdge[];
  propagation_speed_kmh: number;
  bottleneck_junction: string;
}

export interface RiskFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
  severity: 'high' | 'moderate' | 'low';
}

export interface RiskAssessmentResponse {
  road_id: string;
  road_name: string;
  risk_score: number;
  risk_level: string;
  headline: string;
  contributing_factors: RiskFactor[];
  ai_recommendation: string;
}

export interface RouteOption {
  id: string;
  name: string;
  via: string;
  distance_km: number;
  current_time_min: number;
  predicted_time_min: number;
  time_saved_min: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_score: number;
  is_recommended: boolean;
  badge?: string;
  tags: string[];
  coordinates: [number, number][];
  propagation_vulnerability: string;
  delay_factors: string[];
}

export interface DepartureSlot {
  offset_minutes: number;
  departure_time_label: string;
  clock_time: string;
  travel_time_min: number;
  risk_level: string;
  risk_score: number;
  is_best_time: boolean;
  savings_vs_peak_min: number;
}

export interface DepartureOptimizerResponse {
  recommended_departure: string;
  departure_time: string;
  expected_travel_time_min: number;
  estimated_saving_min: number;
  reasoning: string;
  slots: DepartureSlot[];
}

export interface JourneyPredictResponse {
  journey_id: string;
  origin: string;
  destination: string;
  departure_time: string;
  recommended_route_id: string;
  routes: RouteOption[];
  departure_optimization: DepartureOptimizerResponse;
  prediction_steps: string[];
  context_signals: {
    weather?: string;
    rainfall_mm?: number;
    active_events_count?: number;
    primary_event?: string;
    corridor_risk_score?: number;
  };
}

export interface AlertItem {
  id: string;
  title: string;
  headline: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  delay_added_min: number;
  alternative_route_id: string;
  alternative_route_name: string;
  time_saved_min: number;
  road_id: string;
  road_name: string;
  created_at: string;
  is_read: boolean;
}

export interface WeatherObservation {
  temperature_c: number;
  condition: string;
  humidity_pct: number;
  precipitation_mm: number;
  visibility_km: number;
  road_surface_risk: string;
  impact_statement: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: string;
  location: string;
  severity: string;
  impact_radius_km: number;
  description: string;
  context_note: string;
}
