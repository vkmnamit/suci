from app.db.supabase_client import supabase_client
from datetime import datetime, timezone
import structlog

logger = structlog.get_logger()

class MockReading:
    def __init__(self, mwh):
        self.mwh = mwh

class ForecastService:
    def __init__(self, db_session = None):
        self.client = supabase_client
        self.db = db_session

    async def get_current_zone_utility_load(self, zone_id: str) -> float:
        """Mock current energy demand."""
        return 450.5

    async def get_forecast_comparison(self, zone_id: str, horizon_hours: int = 6) -> dict:
        """Mock comparison of forecasts vs actuals."""
        return {
            "actuals": [MockReading(40.0), MockReading(42.0)],
            "forecasts": [MockReading(38.0), MockReading(43.0)],
            "status": "success"
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
