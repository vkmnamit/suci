from app.db.supabase_client import supabase_client
from typing import List, Dict, Optional
import structlog

logger = structlog.get_logger()

class CityGraphService:
    def __init__(self):
        self.client = supabase_client

    async def get_real_world_metrics(self, zone_name: str) -> Dict:
        """Fetches REAL geolocation and air quality data with adaptive scoping."""
        import httpx
        from geopy.geocoders import Nominatim
        import random
        from app.config import settings
        from datetime import datetime, timezone
        
        # We want to be able to find ANY city in India, not just Bengaluru.
        # But we still want to prefer India-based results.
        india_scoped_query = f"{zone_name}, India"
        logger.info(f"Targeting real-world coordinates for: {india_scoped_query}")
        
        try:
            geolocator = Nominatim(user_agent="suci_urban_intelligence_v2")
            
            # Step 1: Try searching for the zone across all of India
            location = geolocator.geocode(india_scoped_query, country_codes="in")
            
            # Step 2: If not found, try searching scoped to the default city (e.g. "Outer Ring Road, Bengaluru")
            if not location:
                city = settings.CITY_DEFAULT.title()
                city_scoped_query = f"{zone_name}, {city}, India"
                logger.info(f"Primary search failed. Trying city-scoped: {city_scoped_query}")
                location = geolocator.geocode(city_scoped_query, country_codes="in")

            if not location:
                # Step 3: Absolute fallback if even the city search fails
                # Use Bengaluru coordinates but mark as simulated
                lat, lon = 12.9716, 77.5946 
                is_simulated = True
                logger.warning(f"Location {zone_name} not found anywhere. Using center-point fallback.")
            else:
                lat, lon = location.latitude, location.longitude
                is_simulated = False
                logger.info(f"Successfully found {zone_name} at: {lat}, {lon}")

            # WAQI (aqicn.org) / AQI.in Integration - Highly accurate for India
            waqi_token = "demo" # The user can swap this for their own waqi_token in .env later
            waqi_url = f"https://api.waqi.info/feed/geo:{lat};{lon}/?token={waqi_token}"
            
            async with httpx.AsyncClient() as client:
                try:
                    waqi_response = await client.get(waqi_url, timeout=5.0)
                    waqi_json = waqi_response.json()
                    
                    if waqi_json.get("status") == "ok":
                        data = waqi_json.get("data", {})
                        iaqi = data.get("iaqi", {})
                        pm2_5 = iaqi.get("pm25", {}).get("v", 50)
                        co = iaqi.get("co", {}).get("v", 400)
                        no2 = iaqi.get("no2", {}).get("v", 20)
                        logger.info(f"WAQI Data Received: PM2.5={pm2_5}, CO={co}")
                    else:
                        raise Exception("WAQI returned non-ok status")
                except Exception as waqi_err:
                    logger.warning(f"WAQI failed, falling back to Open-Meteo: {waqi_err}")
                    # Open-Meteo Fallback
                    aq_url = f"https://air-quality-api.open-meteo.com/v1/air-quality?latitude={lat}&longitude={lon}&current=pm2_5,carbon_monoxide,nitrogen_dioxide&forecast_days=1"
                    aq_response = await client.get(aq_url)
                    aq_data = aq_response.json().get("current", {})
                    pm2_5 = aq_data.get("pm2_5", 50)
                    co = aq_data.get("carbon_monoxide", 400)
                    no2 = aq_data.get("nitrogen_dioxide", 20)

            iso_time = datetime.now(timezone.utc).isoformat()
            
            return {
                "latitude": lat,
                "longitude": lon,
                "pm2_5": pm2_5,
                "co": co,
                "no2": no2,
                "timestamp": iso_time,
                "is_simulated_geo": is_simulated
            }
            
        except Exception as e:
            logger.error(f"Environmental API call failed: {e}")
            return {"latitude": 0, "longitude": 0, "pm2_5": 50, "co": 400, "timestamp": datetime.now(timezone.utc).isoformat(), "is_simulated_geo": True}

    async def get_dynamic_ai_prediction(self, zone_name: str) -> Dict:
        """Fuses Real Sensors + AI reasoning with corrected IDs and timestamps."""
        if not hasattr(self, "_ai_client"):
            from ollama import AsyncClient
            from app.config import settings
            self._ai_client = AsyncClient(host=settings.OLLAMA_HOST)
            self._ai_model = settings.OLLAMA_REASONING_MODEL
            
        real_inputs = await self.get_real_world_metrics(zone_name)
        
        prompt = f"""
        [ROLE: SUCI Strategic Urban Commander & Climate Scientist]
        [OBJECTIVE: Generate a Definitive 'Master Governance Plan' for {zone_name}]
        
        CONTEXT (LIVE SENSOR FUSION @ {real_inputs['timestamp']}):
        - Location: {real_inputs['latitude']}, {real_inputs['longitude']}
        - PM2.5: {real_inputs['pm2_5']}
        - CO Emissions: {real_inputs['co']}
        - NO2 levels: {real_inputs['no2']}
        
        TASK:
        Provide an IN-DEPTH tactical and strategic roadmap. 
        Focus on: ROI of carbon reduction, multi-phase governance commands, and a definitive conclusion on climate stabilization.
        
        Output ONLY valid JSON:
        {{
            "meta": {{
                "planning_mode": "STRATEGIC_COMMAND",
                "urgency_scale": "LOW | MEDIUM | HIGH | CRITICAL"
            }},
            "industrial_kpis": {{
                "grid_load_surge": "<MW value>",
                "impact_confidence": <float 0.0-1.0>
            }},
            "tactical_plan": {{
                "immediate_1h": {{
                    "action": "<Direct tactical command>",
                    "impact": "<Predicted kg CO2 avoided in 60 mins>"
                }},
                "short_term_3h": {{ "action": "...", "impact": "..." }},
                "mid_cycle_6h": {{ "action": "...", "impact": "..." }}
            }},
            "carbon_control_strategy": [
                {{
                    "method": "Grid Decarbonization",
                    "how_it_works": "<Technical breakdown of peak-shaving/BESS>",
                    "expected_co2_drop": "<%-reduction>"
                }}
            ],
            "live_alert_summary": "<15-word flashing header for command center>",
            "final_conclusion": "<A 50-word definitive summary of the impact. What happens to the zone's climate in 24-48 hours if these steps are taken?>",
            "operational_thought": "<Deep technical reasoning for your strategy choice>"
        }}
        """
        try:
            response = await self._ai_client.chat(
                model=self._ai_model, 
                messages=[{"role": "user", "content": prompt}],
                options={"temperature": 0.3} # Balanced for deep but grounded reasoning
            )
            import json, re
            content = response['message']['content']
            
            # Substantial JSON extraction
            try:
                start = content.find('{')
                end = content.rfind('}')
                parsed_data = json.loads(content[start:end+1]) if start != -1 else {}
            except Exception:
                parsed_data = {}
            
            # RESTORING THE FULL STRATEGIC MASTER FORMAT
            zone_data = {
                "id": f"zone-{zone_name.lower().replace(' ', '-')}",
                "name": zone_name.title(),
                "lat": real_inputs["latitude"],
                "lng": real_inputs["longitude"],
                "carbon_score": float(real_inputs["pm2_5"] * 0.8),
                "carbon_intensity": float(real_inputs["pm2_5"] * 1.5),
                "renewable_fraction": 0.40, 
                "status": parsed_data.get("meta", {}).get("urgency_scale", "MODERATE"),
                "ai_analysis": parsed_data.get("live_alert_summary", "Calculating Strategic Pulse..."),
                "recommended_action": parsed_data.get("tactical_plan", {}).get("immediate_1h", {}).get("action", "Awaiting sensor trigger."),
                "thought": parsed_data.get("operational_thought", "Analyzing sensor flux..."),
                "tactical_ops": parsed_data.get("tactical_plan", {}), # Full nested tactical plan
                "carbon_control_strategy": parsed_data.get("carbon_control_strategy", []),
                "final_conclusion": parsed_data.get("final_conclusion", "Stabilization phase in progress."),
                "updated_at": real_inputs["timestamp"]
            }
            
            logger.info(f"Persisting Full Strategy for: {zone_data['id']}")
            try:
                # We attempt full save (Requires Supabase columns status, tactical_ops, final_conclusion, etc.)
                self.client.table("zones").upsert(zone_data).execute()
                logger.info("Strategy Save: SUCCESS")
            except Exception as db_err:
                logger.error(f"Strategy Save: FAILED - {db_err}")
                
            return zone_data 
        except Exception as e:
            logger.error(f"Deep Strategic Strategist Failed: {e}")
            return {
                "id": f"zone-{zone_name.lower().replace(' ', '-')}",
                "status": "COMMAND_FAIL",
                "lat": real_inputs["latitude"],        
                "lng": real_inputs["longitude"],
                "updated_at": real_inputs["timestamp"]
            }

    async def get_all_zones(self) -> List[Dict]:
        """Fetch all city zones from Supabase, or generate via AI if empty."""
        try:
            response = self.client.table("zones").select("*").execute()
            if response.data and len(response.data) > 0:
                return response.data
        except Exception:
            pass
            
        # Fallback: if DB is empty, generate seed zones for the default city
        from app.config import settings
        city = settings.CITY_DEFAULT.title()
        seed_zones = [f"Central {city}", f"North {city}", f"Industrial District"]
        
        results = []
        for z_name in seed_zones:
            data = await self.get_dynamic_ai_prediction(z_name)
            results.append(data)
        return results

    async def get_zone_details(self, zone_name: str) -> Optional[Dict]:
        """Fetch details for any zone. If it doesn't exist, AI predicts it on the fly and saves it."""
        zone_id = zone_name.lower().replace(" ", "-")
        try:
            # Try to fetch from DB first
            response = self.client.table("zones").select("*").eq("id", zone_id).execute()
            if response.data and len(response.data) > 0:
                return {"profile": response.data[0]}
        except Exception:
            pass

        # If not in DB, create it dynamically via AI!
        logger.info(f"Zone {zone_name} not found. Triggering AI prediction...")
        profile = await self.get_dynamic_ai_prediction(zone_name)
        return {"profile": profile}

    async def get_city_summary(self) -> str:
        """Generate a text summary of all known zones."""
        zones = await self.get_all_zones()
        if not zones: return "No city data available."
        summary = "Current State:\n"
        for z in zones:
            summary += f"- {z['name']}: Carbon Score {z['carbon_score']}, Congestion {z.get('congestion_level')}%"
        return summary

city_graph_service = CityGraphService()
