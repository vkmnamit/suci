from fastapi import APIRouter, Depends, HTTPException
from app.services.city_graph import city_graph_service
from app.services.forecast import ForecastService, get_forecast_service
from app.services.models import model_service
from typing import List, Dict

# --- City Router ---
city_router = APIRouter()

@city_router.get("/zones")
async def get_all_zones(city: str = "bangalore"):
    """Retrieve current state of all city zones from Neo4j graph."""
    zones = await city_graph_service.get_all_zones(city)
    return {"zones": zones}

@city_router.get("/zones/{zone_id}")
async def get_zone_endpoint(zone_id: str):
    """Retrieve detailed state of a single zone."""
    zone = await city_graph_service.get_zone_details(zone_id)
    if not zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    return {"zone": zone}

@city_router.get("/zones/{zone_id}/state")
async def get_zone_real_time_state(zone_id: str, forecast_service: ForecastService = Depends(get_forecast_service)):
    """Fetch the current energy and carbon state for a specific zone."""
    mwh = await forecast_service.get_current_zone_utility_load(zone_id)
    zone_graph = await city_graph_service.get_zone_details(zone_id) or {}
    
    # zone_graph returns {"profile": data}. If it exists, extract it.
    profile = zone_graph.get("profile", {})
    
    return {
        "zone_id": zone_id,
        "energy_demand_mwh": mwh,
        "carbon_score": profile.get("carbon_score", 0),
        "last_updated": profile.get("updated_at")
    }

# --- Forecast Router ---
forecast_router = APIRouter()

@forecast_router.get("/energy/{zone_id}")
async def get_energy_forecast(zone_id: str, hours: int = 6, forecast_service: ForecastService = Depends(get_forecast_service)):
    """Fetch energy demand forecast vs actuals for the last/next 6 hours."""
    comparison = await forecast_service.get_forecast_comparison(zone_id, horizon_hours=hours)
    return comparison

@forecast_router.get("/map-trend")
async def get_map_trend(city: str = "bangalore", forecast_service: ForecastService = Depends(get_forecast_service)):
    """Fetch predictive carbon trends for every city zone for map visualization."""
    zones = await city_graph_service.get_all_zones(city)
    trend_data = []
    
    for zone in zones:
        profile = zone.get("profile", {})
        # Use ML model to predict next state
        prediction = model_service.predict(
            traffic_density=profile.get("traffic_density", 50),
            energy_consumption=profile.get("energy_consumption", 300),
            renewable_percentage=profile.get("renewable_percentage", 30),
            temperature=profile.get("temperature", 25)
        )
        
        trend_data.append({
            "zone_id": zone.get("id"),
            "current_carbon": profile.get("carbon_score", 0),
            "predicted_carbon": prediction.get("carbon_intensity", 0),
            "current_energy": profile.get("energy_consumption", 0),
            "predicted_energy": prediction.get("energy_consumption", 0),
            "trend": "UP" if prediction.get("carbon_intensity", 0) > profile.get("carbon_score", 0) else "DOWN"
        })
        
    return {"trends": trend_data}

router = city_router
router_forecast = forecast_router
