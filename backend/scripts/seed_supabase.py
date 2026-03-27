import asyncio
from sqlalchemy import text
from app.db.database_clients import engine
from app.models.db.timescale_models import Base

async def seed():
    print("🚀 Initializing Supabase Tables...")
    try:
        async with engine.begin() as conn:
            # Create all tables (EnergyReading, CarbonScore, etc.)
            await conn.run_sync(Base.metadata.create_all)
            print("✅ Tables created or updated successfully.")

            # Insert sample city zones
            print("📍 Seeding sample zone data...")
            # Using execute(text(...)) to avoid ORM dependency during initial seed
            await conn.execute(text("""
                INSERT INTO energy_readings (zone_id, mwh, source, is_forecast, timestamp) 
                VALUES 
                ('zone_3', 1200.5, 'grid', 0, now()), 
                ('zone_3', 1150.2, 'solar', 0, now()),
                ('zone_4', 850.0, 'wind', 0, now())
                ON CONFLICT DO NOTHING;
            """))
            
            await conn.execute(text("""
                INSERT INTO carbon_scores (zone_id, kg_co2, intensity_kg_per_mwh, timestamp)
                VALUES
                ('zone_3', 847, 0.72, now()),
                ('zone_4', 450, 0.53, now())
                ON CONFLICT DO NOTHING;
            """))
        
        print("✨ Seeding Complete!")
    except Exception as e:
        print(f"❌ Seeding Error: {str(e)}")
        print("💡 Tip: Make sure your SUPABASE_URL and TIMESCALE_URL are correct in .env")

if __name__ == "__main__":
    asyncio.run(seed())
