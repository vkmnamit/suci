from app.tasks.celery_app import celery_app
from app.services.rlaif import RLAIFService
from app.services.city_graph import city_graph_service
from app.db.database_clients import AsyncSessionLocal
import asyncio

@celery_app.task(name="app.tasks.rlaif.rlaif_evaluation")
def rlaif_evaluation():
    """Evaluate prediction MAPE for every city zone and judge if accuracy is low."""
    async def worker():
        async with AsyncSessionLocal() as db:
            rlaif_service = RLAIFService(db)
            zones = city_graph_service.get_all_zones()
            
            print(f"Beginning RLAIF Evaluation across {len(zones)} zones...")
            for zone in zones:
                zone_id = zone['id']
                result = await rlaif_service.trigger_retraining_loop(zone_id)
                print(f"Zone {zone_id} evaluation: {result['status']}")

    asyncio.run(worker())

@celery_app.task(name="app.tasks.rlaif.rlaif_retrain")
def rlaif_retrain(zone_id: str, critique: dict):
    """Retrain the student forecasting model with augmented data (placeholder)."""
    async def worker():
        print(f"Retraining model for zone {zone_id} based on critique: {critique.get('root_cause')}")
        # Synthetic data generation -> Augment -> Model.fit -> Versioning -> MinIO save
        await asyncio.sleep(4) # Simulated training time
        print(f"Successfully retrained and hot-swapped model version for {zone_id}.")

    asyncio.run(worker())
