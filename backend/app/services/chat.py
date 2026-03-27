import ollama
from ollama import AsyncClient
from app.config import settings
from app.services.city_graph import city_graph_service
from app.services.forecast import get_forecast_service
from typing import AsyncGenerator, List, Dict
import json

class ChatService:
    def __init__(self):
        self.host = settings.OLLAMA_HOST
        self.model = settings.OLLAMA_REASONING_MODEL
        self.forecast_service = get_forecast_service()
        self.client = AsyncClient(host=self.host) if self.host else AsyncClient()

    async def build_city_context(self) -> str:
        """Fetch real-time city state and format as a context string for the LLM."""
        zones = await city_graph_service.get_all_zones()
        context = "Current City Status:\n"
        for zone in zones:
            context += f"- {zone['name']} (ID: {zone['id']}): Carbon Score: {zone.get('carbon_score')}, Intensity: {zone.get('carbon_intensity')}"
            if "traffic_volume" in zone:
                context += f", Traffic: {zone.get('traffic_volume')}, Congestion: {zone.get('congestion_level')}%"
            context += f", Renewable Fraction: {zone.get('renewable_fraction')}\n"
        
        active_alerts = [z for z in zones if (z.get('active_alerts') or 0) > 0]
        if active_alerts:
            context += "\nActive Alerts Requiring Intervention:\n"
            for alert in active_alerts:
                context += f"- [WARNING] {alert['name']} has {alert.get('active_alerts')} active alerts. Details: {alert.get('alert_reason', 'High carbon footprint anomaly')}\n"
        
        return context

    async def send_message_stream(self, message: str, history: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
        """Send a message to Ollama (qwen2.5:7b) and stream back the response tokens."""
        city_context = await self.build_city_context()
        
        system_prompt = f"""
        You are SUCI (Self-Improving Urban Climate Intelligence), a specialized AI city climate analyst.
        Your goal is to provide actionable insights into urban carbon emissions and energy demand.
        
        CONTEXT:
        {city_context}
        
        INSTRUCTIONS:
        1. Be precise and data-driven. Use zone names and numbers from the context.
        2. Keep responses focused on climate impact and intervention recommendations.
        3. Format any intervention recommendations clearly with 'Action', 'Predicted carbon reduction', and 'Cost'.
        4. If the user asks about a specific zone, focus your analysis on that zone.
        """

        messages = [{"role": "system", "content": system_prompt}] + history + [{"role": "user", "content": message}]

        # Using Ollama's AsyncClient for non-blocking streaming
        stream = await self.client.chat(
            model=self.model,
            messages=messages,
            stream=True,
        )

        async for chunk in stream:
            yield chunk['message']['content']

    async def generate_morning_briefing(self) -> str:
        """Generate a summarized briefing of the city's status for the operator."""
        city_context = await self.build_city_context()
        
        prompt = f"""
        Generate a daily morning briefing for a City Climate Officer.
        Summarize the current state of the city based on this data:
        {city_context}
        
        The briefing should include:
        1. Top 3 zones with highest carbon intensity.
        2. Renewable energy penetration across the city.
        3. Suggested action for today.
        
        Keep it concise and professional.
        """
        
        response = await self.client.chat(
            model=self.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response['message']['content']

async def get_chat_service():
    """Dependency hook for FastAPI for ChatService."""
    return ChatService()
