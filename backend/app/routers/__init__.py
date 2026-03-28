from .auth import router as auth
from .city_forecast_routes import router as city # map city routes
from .city_forecast_routes import router_forecast as forecast # map forecast routes
from .rlaif_routes import router as rlaif
from .chat_routes import router as chat
from .scenarios import router as scenarios
from .interventions import router as interventions
from .reports import router as reports

# Placeholder routers for remaining modules
from fastapi import APIRouter

def create_placeholder(name):
    router = APIRouter()
    @router.get("/")
    async def get_placeholder():
        return {"module": name, "status": "placeholder"}
    return router

admin = create_placeholder("admin")
