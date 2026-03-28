from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, city, forecast, scenarios, interventions, chat, rlaif, reports, admin
from app.config import settings

def create_app() -> FastAPI:
    app = FastAPI(
        title="SUCI - Self-Improving Urban Climate Intelligence",
        description="API for urban climate intelligence and self-improving agent orchestration.",
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json"
    )

    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # Allow all for debugging connection issues
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth, prefix="/api/v1/auth", tags=["auth"])
    app.include_router(city, prefix="/api/v1/city", tags=["city"])
    app.include_router(forecast, prefix="/api/v1/forecast", tags=["forecast"])
    app.include_router(scenarios, prefix="/api/v1/scenarios", tags=["scenarios"])
    app.include_router(interventions, prefix="/api/v1/interventions", tags=["interventions"])
    app.include_router(chat, prefix="/api/v1/chat", tags=["chat"])
    app.include_router(rlaif, prefix="/api/v1/rlaif", tags=["rlaif"])
    app.include_router(reports, prefix="/api/v1/reports", tags=["reports"])
    app.include_router(admin, prefix="/api/v1/admin", tags=["admin"])

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "version": "1.0.0"}

    return app

app = create_app()
