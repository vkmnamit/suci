from celery import Celery
from celery.schedules import crontab
from app.config import settings

# Initialize Celery app
celery_app = Celery(
    "suci_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Celery configurations
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_ignore_result=True, # Recommended for performance if results aren't needed
)

# --- Periodic Beat Schedule (as defined in 6.4) ---
celery_app.conf.beat_schedule = {
    "ingest-weather-every-15-min": {
        "task": "app.tasks.ingestion.ingest_weather",
        "schedule": crontab(minute="*/15"),
    },
    "ingest-energy-every-15-min": {
        "task": "app.tasks.ingestion.ingest_energy",
        "schedule": crontab(minute="*/15"),
    },
    "run-agent-cycle-every-15-min": {
        "task": "app.tasks.agent_cycle.run_agent_cycle",
        "schedule": crontab(minute="*/15"),
    },
    "rlaif-evaluation-every-30-min": {
        "task": "app.tasks.rlaif.rlaif_evaluation",
        "schedule": crontab(minute="*/30"),
    },
    "generate-morning-briefing-daily": {
        "task": "app.tasks.chat.generate_briefing",
        "schedule": crontab(hour=6, minute=30), # 6:30 AM daily
    },
    "cleanup-old-data-nightly": {
        "task": "app.tasks.system.cleanup_old_data",
        "schedule": crontab(hour=2, minute=0), # 2:00 AM daily
    },
}

# Auto-discover tasks in specific modules
celery_app.autodiscover_tasks(["app.tasks.ingestion", "app.tasks.agent_cycle", "app.tasks.rlaif"])
