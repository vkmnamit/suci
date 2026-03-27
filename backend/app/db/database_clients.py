from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.config import settings

# --- Postgres / TimescaleDB Setup ---
engine = create_async_engine(
    settings.TIMESCALE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

async def get_db_session():
    """Dependency for getting an async DB session."""
    async with AsyncSessionLocal() as session:
        yield session

