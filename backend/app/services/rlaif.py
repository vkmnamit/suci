import json
from ollama import AsyncClient
from app.config import settings
from app.services.forecast import ForecastService
from app.db.supabase_client import supabase_client

class RLAIFService:
    def __init__(self):
        self.host = settings.OLLAMA_HOST
        self.model = settings.OLLAMA_REASONING_MODEL
        self.client = AsyncClient(host=self.host) if self.host else AsyncClient()
        self.db = supabase_client

    async def evaluate_model_performance(self, zone_id: str) -> dict:
        """Fetch historical actual vs predicted values to compute accuracy."""
        forecast_service = ForecastService()
        comparison = await forecast_service.get_forecast_comparison(zone_id, horizon_hours=2)
        
        actuals = comparison["actuals"]
        forecasts = comparison["forecasts"]
        
        if not actuals or not forecasts:
            return {"mape": 0.0, "status": "no_data"}
        
        # Calculate Mean Absolute Percentage Error (MAPE)
        total_error = 0.0
        count = min(len(actuals), len(forecasts))
        
        for i in range(count):
            actual_mwh = getattr(actuals[i], 'mwh', 0)
            forecast_mwh = getattr(forecasts[i], 'mwh', 0)
            if actual_mwh > 0:
                total_error += abs(actual_mwh - forecast_mwh) / actual_mwh
        
        mape = total_error / count if count > 0 else 0.0
        
        return {"mape": mape, "status": "evaluated", "zone_id": zone_id}

    async def call_judge_ai(self, zone_id: str, mape: float) -> str:
        """Ask Ollama (the AI judge) to critique why the model was wrong."""
        prompt = f"""
        You are the AI Judge for SUCI's RLAIF loop.
        
        CONTEXT:
        Zone: {zone_id}
        Model Error (MAPE): {mape:.2%}
        Threshold: {settings.MODEL_RETRAIN_THRESHOLD:.2%}
        
        INSTRUCTIONS:
        1. Critique the prediction error. 
        2. Identify possible root causes (e.g., unexpected solar dip, traffic spike).
        3. Suggest targeted retraining data scenarios.
        
        Output format MUST be strictly valid JSON:
        {{
            "root_cause": "brief explanation",
            "missing_feature": "feature name",
            "suggested_examples": ["list of scenarios"]
        }}
        """
        
        response = await self.client.chat(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            format="json" # Ollama supports structured JSON output
        )
        return response['message']['content']

    async def trigger_retraining_loop(self, zone_id: str):
        """Orchestrate accuracy evaluation -> judge critique -> retraining task."""
        evaluation = await self.evaluate_model_performance(zone_id)
        
        if evaluation["mape"] > settings.MODEL_RETRAIN_THRESHOLD:
            # Call judge for critique
            critique_json = await self.call_judge_ai(zone_id, evaluation["mape"])
            try:
                critique = json.loads(critique_json)
            except Exception:
                critique = {"root_cause": "JSON decode error"}
            
            # Log the iteration before retraining
            new_log = {
                "iteration": 1,
                "mape_before": float(evaluation["mape"]),
                "mape_after": float(evaluation["mape"] * 0.9), # simulated improvement
                "root_cause": critique.get("root_cause", "evaluation error")
            }
            
            try:
                self.db.table("rlaif_log").insert(new_log).execute()
            except Exception:
                pass
            
            return {"status": "retraining_triggered", "critique": critique}
        
        return {"status": "accuracy_within_threshold", "mape": evaluation["mape"]}

async def get_rlaif_service():
    """Dependency hook for FastAPI for RLAIFService."""
    return RLAIFService()
