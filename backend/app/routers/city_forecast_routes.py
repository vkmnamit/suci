from fastapi import APIRouter, Depends, HTTPException
from app.services.city_graph import city_graph_service
from app.services.forecast import ForecastService, get_forecast_service
from app.db.database_clients import get_db_session
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict

# --- City Router ---
city_router = APIRouter()

@city_router.get("/zones")
async def get_all_zones():
    """Retrieve current state of all city zones from Neo4j graph."""
    zones = await city_graph_service.get_all_zones()
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

@forecast_router.get("/all-zones")
async def get_all_zone_forecasts():
    """Fetch carbon and energy forecast summaries for every city zone."""
    zones = await city_graph_service.get_all_zones()
    return {"summary": "Total city forecast data", "zones": len(zones)}

router = city_router
router_forecast = forecast_router
