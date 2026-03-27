from app.db.supabase_client import supabase_client
from typing import List, Dict, Optional
import structlog

logger = structlog.get_logger()

class CityGraphService:
    def __init__(self):
        self.client = supabase_client

    async def get_dynamic_ai_prediction(self, zone_name: str) -> Dict:
        """Consults the local LLM to dynamically simulate predictive model outputs."""
        if not hasattr(self, "_ai_client"):
            from ollama import AsyncClient
            from app.config import settings
            self._ai_client = AsyncClient(host=settings.OLLAMA_HOST)
            self._ai_model = settings.OLLAMA_REASONING_MODEL
            self._cached_predictions = {}
            
        import time
        cache_key = f"{zone_name}_{int(time.time() // 300)}" # rotate cache every 5 minutes
        if cache_key in self._cached_predictions:
            return self._cached_predictions[cache_key]
            
        prompt = f"""
        Act as a live urban prediction model for {zone_name}. Generate current analytics.
        Output ONLY valid JSON:
        {{
            "energy_per_sqm": <float 50-300>,
            "traffic_volume": <int 1000-80000>,
            "congestion_level": <int 10-100>,
            "environmental_impact_score": <float 50-250>
        }}
        """
        try:
            response = await self._ai_client.chat(model=self._ai_model, messages=[{"role": "user", "content": prompt}])
            import json, re
            # Extract JSON from potential reasoning blocks (<think> tags from deepseek-r1)
            content = response['message']['content']
            json_match = re.search(r'\{(?:[^{}]|(?(?=\{).*\}))*\}', content, re.DOTALL)
            parsed_data = json.loads(json_match.group()) if json_match else {}
            
            # Save to cache
            pred = {
                "energy_per_sqm": float(parsed_data.get("energy_per_sqm", 210)),
                "traffic_volume": int(parsed_data.get("traffic_volume", 60000)),
                "congestion_level": int(parsed_data.get("congestion_level", 90)),
                "environmental_impact_score": float(parsed_data.get("environmental_impact_score", 174.0)),
            }
            self._cached_predictions[cache_key] = pred
            return pred
        except Exception as e:
            logger.error(f"AI Prediction failed: {e}")
            return {"energy_per_sqm": 210, "traffic_volume": 60000, "congestion_level": 90, "environmental_impact_score": 174.0}

    async def get_all_zones(self) -> List[Dict]:
        """Fetch all city zones and their current metrics from Supabase, or AI generated dynamic mock data."""
        from app.config import settings
        city_name = settings.CITY_DEFAULT.title()
        
        try:
            response = self.client.table("zones").select("*").execute()
            if response.data and len(response.data) > 0:
                return response.data
        except Exception:
            pass # Fallback to AI generation
            
        # Dynamically predict stats for real city zones!
        # We simulate 3 major zones for the configured city
        zone_names = [f"Central {city_name}", f"North {city_name}", f"South {city_name}"]
        zones = []
        
        for i, name in enumerate(zone_names):
            pred = await self.get_dynamic_ai_prediction(name)
            alerts = 0
            reasons = []
            
            if pred["congestion_level"] > 80:
                alerts += 1
                reasons.append(f"Congestion at {pred['congestion_level']}%.")
            if pred["energy_per_sqm"] > 220:
                alerts += 1
                reasons.append(f"Energy intensity spike ({pred['energy_per_sqm']} MWh/sqm).")
                
            zones.append({
                "id": f"zone-{i+1}",
                "name": name,
                "carbon_score": pred["environmental_impact_score"],
                "carbon_intensity": pred["energy_per_sqm"],
                "renewable_fraction": 0.2 + (i * 0.1),
                "traffic_volume": pred["traffic_volume"],
                "congestion_level": pred["congestion_level"],
                "active_alerts": alerts,
                "alert_reason": " | ".join(reasons) if alerts > 0 else "Optimal"
            })
            
        return zones

    async def get_zone_details(self, zone_id: str) -> Optional[Dict]:
        """Fetch details for a specific zone including its infrastructure."""
        try:
            zone = self.client.table("zones").select("*").eq("id", zone_id).single().execute()
            buildings = self.client.table("buildings").select("*").eq("zone_id", zone_id).execute()
            substations = self.client.table("substations").select("*").eq("zone_id", zone_id).execute()
            
            if not zone.data:
                return None
                
            return {
                "profile": zone.data,
                "buildings": buildings.data,
                "substations": substations.data
            }
        except Exception as e:
            # Mock data for local testing
            return {
                "profile": {
                    "id": zone_id,
                    "name": "Mock Zone Data",
                    "carbon_score": 85,
                    "carbon_intensity": 120,
                    "renewable_fraction": 0.4,
                    "updated_at": "2026-03-27T10:00:00Z"
                },
                "buildings": [{"id": "bldg-1", "type": "commercial", "energy_cost": 450.5}],
                "substations": [{"id": "sub-1", "capacity_mw": 12.0}]
            }

    async def get_city_summary(self) -> str:
        """Generate a text summary of the city state for AI context."""
        zones = await self.get_all_zones()
        if not zones:
            return "City data not initialized."
            
        summary = "Current City Environment State:\n"
        for z in zones:
            summary += f"- {z['name']} (ID: {z['id']}): Carbon Score: {z['carbon_score']}, Renewable: {z['renewable_fraction'] * 100}%\n"
        
        return summary

city_graph_service = CityGraphService()
