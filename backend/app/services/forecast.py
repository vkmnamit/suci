from app.db.supabase_client import supabase_client
from datetime import datetime, timezone
import structlog

logger = structlog.get_logger()

class MockReading:
    def __init__(self, mwh):
        self.mwh = mwh

from app.services.models import model_service

class ForecastService:
    def __init__(self, db_session = None):
        self.client = supabase_client
        self.db = db_session

    async def get_current_zone_utility_load(self, zone_id: str) -> float:
        """Mock current energy demand with slight variance."""
        import random
        return 450.5 + random.uniform(-20, 20)

    async def get_forecast_comparison(self, zone_id: str, horizon_hours: int = 24) -> list:
        """Use the ML model to generate a realistic 24h forecast."""
        # Use default values for the forecast based on the zone
        base_values = {
            "traffic": 70, 
            "energy": 450, 
            "renewable_fraction": 0.35, 
            "temperature": 28
        }
        return model_service.forecast_24h(base_values)

    async def get_aggregated_city_forecast(self, zones_count: int = 6) -> dict:
        """Generate city-wide aggregated forecast data using the ML model."""
        base_forecast = await self.get_forecast_comparison("city-wide", 24)
        
        # Scale by roughly the number of zones
        for p in base_forecast:
            p["actual_mwh"] = round(float(p["actual_mwh"] * zones_count), 2)
            p["predicted_mwh"] = round(float(p["predicted_mwh"] * zones_count), 2)
            p["carbon"] = round(float(p["carbon"] * zones_count), 2)
            
        total_actual = sum(p["actual_mwh"] for p in base_forecast)
        total_predicted = sum(p["predicted_mwh"] for p in base_forecast)
        
        return {
            "total_actual_mwh": round(float(total_actual), 2),
            "total_predicted_mwh": round(float(total_predicted), 2),
            "forecast": base_forecast
        }

    async def ingest_reading(self, zone_id: str, mwh: float, source: str):
        """Save a new energy reading to Supabase."""
        data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "zone_id": zone_id,
            "mwh": mwh,
            "source": source,
            "is_forecast": False
        }
        return self.client.table("energy_readings").insert(data).execute()

    async def save_prediction(self, zone_id: str, predicted_mwh: float, model_version: str):
        """Save an AI model prediction to Supabase."""
        data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "zone_id": zone_id,
            "predicted_mwh": predicted_mwh,
            "model_version": model_version
        }
        return self.client.table("model_predictions").insert(data).execute()

    async def get_latest_performance(self, zone_id: str):
        """Fetch the most recent predictions and actuals to calculate MAPE."""
        response = self.client.table("model_predictions")\
            .select("predicted_mwh, actual_mwh")\
            .eq("zone_id", zone_id)\
            .order("timestamp", desc=True)\
            .limit(10)\
            .execute()
        return response.data

forecast_service = ForecastService()

def get_forecast_service() -> ForecastService:
    return forecast_service
