from typing import TypedDict, List, Dict, Optional
from datetime import datetime

class WeatherContext(TypedDict):
    temp_c: float
    solar_w_m2: float
    wind_ms: float
    humidity_pct: float

class Alert(TypedDict):
    id: str
    zone_id: str
    metric: str
    value: float
    threshold: float
    severity: str # high / medium / low

class AgentOutput(TypedDict):
    agent_id: str
    forecast_mwh: float
    confidence: float
    timestamp: datetime

class ZoneNode(TypedDict):
    id: str
    name: str
    carbon_score: float
    carbon_intensity: str
    renewable_fraction: float

# CityState - shared state across all LangGraph agents as defined in 7.2
class CityState(TypedDict):
    zone_placeholder: str # Placeholder for the city ID
    zone_graph: Dict[str, ZoneNode] # full city graph snapshot
    weather: Dict[str, WeatherContext] # temp, solar, wind per zone
    timestamp: datetime # current cycle time
    predictions: Dict[str, AgentOutput] # filled by each agent
    carbon_scores: Dict[str, float] # filled by carbon layer
    alerts: List[Alert] # active threshold breaches

def create_initial_state(city_id: str) -> CityState:
    """Initialize the city state for a new agent cycle."""
    return CityState(
        zone_placeholder=city_id,
        zone_graph={},
        weather={},
        timestamp=datetime.utcnow(),
        predictions={},
        carbon_scores={},
        alerts=[]
    )
