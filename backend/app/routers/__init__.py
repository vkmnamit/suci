from .auth import router as auth
from .city_forecast_routes import router as city # map city routes
from .city_forecast_routes import router_forecast as forecast # map forecast routes
from .rlaif_routes import router as rlaif
from .chat_routes import router as chat

# Placeholder routers for other modules as defined in main.py
from fastapi import APIRouter

def create_placeholder(name):
    router = APIRouter()
    @router.get("/")
    async def get_placeholder():
        return {"module": name, "status": "placeholder"}
    return router

scenarios = create_placeholder("scenarios")
interventions = create_placeholder("interventions")
reports = create_placeholder("reports")
admin = create_placeholder("admin")
