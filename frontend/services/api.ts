import {
  LiveTrafficSummary,
  RoadForecastResponse,
  PropagationResponse,
  RiskAssessmentResponse,
  RouteOption,
  DepartureOptimizerResponse,
  JourneyPredictResponse,
  AlertItem,
  WeatherObservation,
  EventItem
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Fallback constants
export const FALLBACK_ROUTES: RouteOption[] = [
  {
    id: 'ROUTE_B',
    name: 'Route B',
    via: 'Via Trichy Road / Ring Link',
    distance_km: 19.5,
    current_time_min: 35,
    predicted_time_min: 38,
    time_saved_min: 14,
    risk_level: 'LOW',
    risk_score: 25,
    is_recommended: true,
    badge: 'RECOMMENDED',
    tags: ['Fastest Predicted', 'Bypasses Festival', 'Save 14 min'],
    propagation_vulnerability: 'Low (Segregated southern arterial bypass)',
    delay_factors: ['Minor signal queue at Sungam Junction (-2 min)'],
    coordinates: [
      [11.0827, 77.0607],
      [11.0650, 77.0520],
      [11.0420, 77.0350],
      [11.0150, 77.0280],
      [10.9980, 76.9980],
      [10.9980, 76.9780],
      [10.9972, 76.9635]
    ]
  },
  {
    id: 'ROUTE_C',
    name: 'Route C',
    via: 'Via Sathy Road / Gandhipuram Bypass',
    distance_km: 21.0,
    current_time_min: 42,
    predicted_time_min: 44,
    time_saved_min: 8,
    risk_level: 'MEDIUM',
    risk_score: 54,
    is_recommended: false,
    badge: 'MODERATE RISK',
    tags: ['Alternative Corridor', 'Extra 1.5 km'],
    propagation_vulnerability: 'Moderate (Sensitive to Gandhipuram spillover)',
    delay_factors: ['Crosscut signal cycle delay', 'Market goods unloading'],
    coordinates: [
      [11.0827, 77.0607],
      [11.0680, 77.0250],
      [11.0450, 76.9950],
      [11.0250, 76.9800],
      [11.0180, 76.9680],
      [10.9972, 76.9635]
    ]
  },
  {
    id: 'ROUTE_A',
    name: 'Route A',
    via: 'Via Avinashi Road Main',
    distance_km: 18.2,
    current_time_min: 36,
    predicted_time_min: 52,
    time_saved_min: 0,
    risk_level: 'HIGH',
    risk_score: 87,
    is_recommended: false,
    badge: 'HIGH RISK',
    tags: ['Direct Distance', 'Festival Bottleneck Ahead', '+16 min delay'],
    propagation_vulnerability: 'Critical (Directly inside 3.2 km propagation shockwave)',
    delay_factors: [
      'Mariamman temple crowd spillover at Lakshmi Mills',
      'Elevated corridor ramp pinch point',
      'Rain-slowed merge friction'
    ],
    coordinates: [
      [11.0827, 77.0607],
      [11.0600, 77.0450],
      [11.0315, 77.0255],
      [11.0250, 77.0090],
      [11.0210, 76.9980],
      [11.0145, 76.9820],
      [11.0130, 76.9660],
      [10.9972, 76.9635]
    ]
  }
];

export const FALLBACK_DEPARTURE: DepartureOptimizerResponse = {
  recommended_departure: 'NOW',
  departure_time: '6:30 PM',
  expected_travel_time_min: 35,
  estimated_saving_min: 17,
  reasoning: 'Departing immediately avoids the downstream festival propagation wavefront arriving at Lakshmi Mills in ~18 minutes.',
  slots: [
    { offset_minutes: 0, departure_time_label: 'NOW', clock_time: '6:30 PM', travel_time_min: 35, risk_level: 'LOW', risk_score: 25, is_best_time: true, savings_vs_peak_min: 17 },
    { offset_minutes: 15, departure_time_label: '+15', clock_time: '6:45 PM', travel_time_min: 39, risk_level: 'MODERATE', risk_score: 55, is_best_time: false, savings_vs_peak_min: 13 },
    { offset_minutes: 30, departure_time_label: '+30', clock_time: '7:00 PM', travel_time_min: 52, risk_level: 'HIGH', risk_score: 87, is_best_time: false, savings_vs_peak_min: 0 },
    { offset_minutes: 45, departure_time_label: '+45', clock_time: '7:15 PM', travel_time_min: 49, risk_level: 'HIGH', risk_score: 82, is_best_time: false, savings_vs_peak_min: 3 },
    { offset_minutes: 60, departure_time_label: '+60', clock_time: '7:30 PM', travel_time_min: 37, risk_level: 'LOW', risk_score: 32, is_best_time: false, savings_vs_peak_min: 15 }
  ]
};

export const FALLBACK_PROPAGATION: PropagationResponse = {
  origin_road_id: 'road_a',
  origin_road_name: 'Road A (Avinashi Road East)',
  estimated_onset_min: 18,
  affected_corridor_km: 3.2,
  impact_level: 'HIGH',
  chain_description: 'Road A (Avinashi East) → Junction B (Lakshmi Mills) → Road C (Anna Salai) → Road D (Station Approach)',
  nodes: [
    { id: 'road_a', name: 'Road A (Avinashi Road East)', stage: 1, type: 'origin', congestion_state: 'SEVERE', delay_min: 4, coordinates: [11.0250, 77.0090] },
    { id: 'junction_b', name: 'Junction B (Lakshmi Mills)', stage: 2, type: 'junction', congestion_state: 'SEVERE', delay_min: 12, coordinates: [11.0145, 76.9820] },
    { id: 'road_c', name: 'Road C (Anna Salai North)', stage: 3, type: 'corridor', congestion_state: 'HEAVY', delay_min: 9, coordinates: [11.0130, 76.9660] },
    { id: 'road_d', name: 'Road D (Station Approach)', stage: 4, type: 'terminal', congestion_state: 'MODERATE', delay_min: 7, coordinates: [10.9972, 76.9635] }
  ],
  edges: [
    { source: 'road_a', target: 'junction_b', probability: 0.94, flow_rate_vph: 2850 },
    { source: 'junction_b', target: 'road_c', probability: 0.88, flow_rate_vph: 2400 },
    { source: 'road_c', target: 'road_d', probability: 0.79, flow_rate_vph: 2100 }
  ],
  propagation_speed_kmh: 10.8,
  bottleneck_junction: 'Junction B (Lakshmi Mills Junction)'
};

export const FALLBACK_RISK: RiskAssessmentResponse = {
  road_id: 'avinashi_road',
  road_name: 'Avinashi Road Corridor',
  risk_score: 87,
  risk_level: 'HIGH RISK',
  headline: 'Severe congestion likely within 30 min.',
  ai_recommendation: 'Divert immediately to Trichy Road Link (Route B) to bypass the 3.2 km corridor shockwave and save 14 minutes.',
  contributing_factors: [
    { name: 'Traffic Volume Surge', score: 88, weight: 0.25, description: 'Corridor throughput is at 94% of saturation capacity (3,400 vph vs 3,600 max design).', severity: 'high' },
    { name: 'Speed Velocity Drop', score: 82, weight: 0.20, description: 'Average speed has fallen from 42 km/h free flow down to 14 km/h (-66% reduction).', severity: 'high' },
    { name: 'Historical Friday Surge Pattern', score: 91, weight: 0.20, description: 'Historical records show Friday 18:30-19:30 consistently exhibits a 3.4x spike in queue delay.', severity: 'high' },
    { name: 'Upstream Congestion Spillover', score: 85, weight: 0.15, description: 'Shockwave from Hope College merge ramp is propagating backwards at 11 km/h.', severity: 'high' },
    { name: 'Festival Event Density', score: 94, weight: 0.10, description: 'Mariamman temple chariot procession within 500m causing pedestrian overflow.', severity: 'high' },
    { name: 'Weather Surface Friction', score: 68, weight: 0.10, description: 'Evening drizzle reduced pavement friction by 14%, increasing braking buffers.', severity: 'moderate' }
  ]
};

async function safeFetch<T>(url: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      next: { revalidate: 0 }
    });
    if (!res.ok) {
      console.warn(`API returned ${res.status} for ${url}, using demo fallback.`);
      return fallback;
    }
    return await res.json();
  } catch (err) {
    console.warn(`API fetch failed for ${url}, using demo fallback:`, err);
    return fallback;
  }
}

export const api = {
  getLiveTraffic: async (): Promise<LiveTrafficSummary> => {
    const fallback: LiveTrafficSummary = {
      status: 'NORMAL',
      context_statement: 'No major congestion nearby. Average corridor velocity 34 km/h.',
      updated_at: '2 min ago',
      roads: [
        {
          id: 'anna_salai',
          name: 'Anna Salai',
          corridor: 'Gandhipuram - City Center',
          from_node: 'Gandhipuram',
          to_node: 'Railway Station',
          length_km: 3.8,
          speed_limit_kmh: 40,
          current_speed_kmh: 16,
          current_volume: 2850,
          congestion_level: 'HEAVY',
          risk_score: 78
        },
        {
          id: 'avinashi_road',
          name: 'Avinashi Road',
          corridor: 'Airport - Lakshmi Mills Expressway',
          from_node: 'Hope College',
          to_node: 'Lakshmi Mills',
          length_km: 5.4,
          speed_limit_kmh: 50,
          current_speed_kmh: 24,
          current_volume: 2420,
          congestion_level: 'MODERATE',
          risk_score: 72
        },
        {
          id: 'outer_ring_road',
          name: 'Outer Ring Road',
          corridor: 'Neelambur - Irugur Freight Bypass',
          from_node: 'Neelambur',
          to_node: 'Singanallur Junction',
          length_km: 8.2,
          speed_limit_kmh: 60,
          current_speed_kmh: 12,
          current_volume: 3200,
          congestion_level: 'SEVERE',
          risk_score: 89
        },
        {
          id: 'trichy_road',
          name: 'Trichy Road Link',
          corridor: 'Singanallur - Sungam Arterial',
          from_node: 'Singanallur',
          to_node: 'Railway Station South',
          length_km: 6.1,
          speed_limit_kmh: 50,
          current_speed_kmh: 42,
          current_volume: 1150,
          congestion_level: 'NORMAL',
          risk_score: 24
        },
        {
          id: 'lakshmi_mills_junction',
          name: 'Lakshmi Mills Junction',
          corridor: 'Central Metro Core',
          from_node: 'Peelamedu',
          to_node: 'Gandhipuram Crosscut',
          length_km: 2.1,
          speed_limit_kmh: 35,
          current_speed_kmh: 9,
          current_volume: 3400,
          congestion_level: 'SEVERE',
          risk_score: 92
        }
      ],
      critical_roads: [
        { name: 'Anna Salai', state: 'Heavy', color: 'orange' },
        { name: 'Avinashi Road', state: 'Moderate', color: 'amber' },
        { name: 'Outer Ring Road', state: 'Severe', color: 'rose' },
        { name: 'Trichy Road Link', state: 'Normal', color: 'emerald' },
        { name: 'Lakshmi Mills', state: 'Severe', color: 'rose' }
      ]
    };
    return safeFetch<LiveTrafficSummary>(`${API_BASE}/traffic/live`, fallback);
  },

  getForecast: async (roadId: string = 'anna_salai'): Promise<RoadForecastResponse> => {
    const fallback: RoadForecastResponse = {
      road_id: roadId,
      road_name: roadId === 'anna_salai' ? 'Anna Salai' : 'Avinashi Road',
      summary: 'Congestion sharply climbs between T+15 and T+30 min as festival arrival overlaps with peak office dismissals.',
      timeline: [
        { horizon_minutes: 0, horizon_label: 'NOW', congestion: 'Moderate', speed_kmh: 28, risk_score: 52, spillover_probability: 0.25 },
        { horizon_minutes: 15, horizon_label: '+15', congestion: 'Heavy', speed_kmh: 18, risk_score: 74, spillover_probability: 0.65 },
        { horizon_minutes: 30, horizon_label: '+30', congestion: 'Severe', speed_kmh: 11, risk_score: 89, spillover_probability: 0.92 },
        { horizon_minutes: 45, horizon_label: '+45', congestion: 'Severe', speed_kmh: 13, risk_score: 86, spillover_probability: 0.88 },
        { horizon_minutes: 60, horizon_label: '+60', congestion: 'Heavy', speed_kmh: 22, risk_score: 68, spillover_probability: 0.55 }
      ]
    };
    return safeFetch<RoadForecastResponse>(`${API_BASE}/traffic/forecast/${roadId}`, fallback);
  },

  getPropagation: async (roadId: string = 'road_a'): Promise<PropagationResponse> => {
    return safeFetch<PropagationResponse>(`${API_BASE}/traffic/propagation/${roadId}`, FALLBACK_PROPAGATION);
  },

  getRisk: async (roadId: string = 'avinashi_road'): Promise<RiskAssessmentResponse> => {
    return safeFetch<RiskAssessmentResponse>(`${API_BASE}/risk/${roadId}`, FALLBACK_RISK);
  },

  getWeather: async (): Promise<WeatherObservation> => {
    const fallback: WeatherObservation = {
      temperature_c: 27.5,
      condition: 'Evening Drizzle / Overcast',
      humidity_pct: 78,
      precipitation_mm: 2.4,
      visibility_km: 7.5,
      road_surface_risk: 'Moderate friction reduction (-14% braking coefficient)',
      impact_statement: 'Wet asphalt on flyovers is increasing follow-distance buffer by 22%.'
    };
    return safeFetch<WeatherObservation>(`${API_BASE}/weather`, fallback);
  },

  getEvents: async (): Promise<EventItem[]> => {
    const fallback: EventItem[] = [
      {
        id: 'festival_mariamman_01',
        title: 'Annual Mariamman Chariot Procession',
        category: 'FESTIVAL',
        location: 'Lakshmi Mills & Puliakulam Junction',
        severity: 'HIGH',
        impact_radius_km: 2.8,
        description: 'Devotee gathering and temple procession causing lane diversion on Westbound corridor.',
        context_note: 'Festival traffic is compounding evening commuter load near Lakshmi Mills.'
      }
    ];
    return safeFetch<EventItem[]>(`${API_BASE}/events`, fallback);
  },

  getAlerts: async (): Promise<AlertItem[]> => {
    const fallback: AlertItem[] = [
      {
        id: 'alert_lakshmi_mills_01',
        title: 'TRAFFIC ALERT',
        headline: 'Congestion predicted ahead on Avinashi Road corridor.',
        message: 'Congestion predicted ahead. Your route may add 14 minutes. Route B could save 12 minutes.',
        severity: 'CRITICAL',
        delay_added_min: 14,
        alternative_route_id: 'ROUTE_B',
        alternative_route_name: 'Route B (Via Trichy Road / Ring Link)',
        time_saved_min: 12,
        road_id: 'lakshmi_mills_junction',
        road_name: 'Lakshmi Mills Corridor',
        created_at: 'Just now',
        is_read: false
      }
    ];
    return safeFetch<AlertItem[]>(`${API_BASE}/alerts`, fallback);
  },

  predictJourney: async (params: {
    origin: string;
    destination: string;
    departure_time: string;
    preference: string;
  }): Promise<JourneyPredictResponse> => {
    const fallback: JourneyPredictResponse = {
      journey_id: 'journey_kpr_station_01',
      origin: params.origin || 'KPR Institute',
      destination: params.destination || 'Coimbatore Railway Station',
      departure_time: params.departure_time || '6:30 PM',
      recommended_route_id: 'ROUTE_B',
      routes: FALLBACK_ROUTES,
      departure_optimization: FALLBACK_DEPARTURE,
      prediction_steps: [
        'Reading current traffic sensors and probe velocities',
        'Analyzing historical Friday evening commute patterns',
        'Checking real-time weather & Mariamman temple festival events',
        'Forecasting congestion accumulation at Lakshmi Mills bottleneck',
        'Tracing shockwave propagation through downstream network',
        'Comparing multi-corridor candidate travel times',
        'Generating optimal route and departure recommendation'
      ],
      context_signals: {
        weather: 'Evening Drizzle',
        rainfall_mm: 2.4,
        active_events_count: 1,
        primary_event: 'Mariamman Chariot Procession',
        corridor_risk_score: 87
      }
    };

    return safeFetch<JourneyPredictResponse>(
      `${API_BASE}/journeys/predict`,
      fallback,
      {
        method: 'POST',
        body: JSON.stringify(params)
      }
    );
  },

  getDepartureOptimization: async (baseTime: string = '6:30 PM'): Promise<DepartureOptimizerResponse> => {
    return safeFetch<DepartureOptimizerResponse>(
      `${API_BASE}/departure/optimize`,
      FALLBACK_DEPARTURE,
      {
        method: 'POST',
        body: JSON.stringify({ base_time: baseTime })
      }
    );
  }
};
