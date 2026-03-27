from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class EnergyReading(Base):
    __tablename__ = "energy_readings"
    
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    zone_id = Column(String(50), nullable=False, index=True)
    mwh = Column(Float, nullable=False)
    source = Column(String(50), nullable=False) # grid/solar/wind
    is_forecast = Column(Integer, default=0) # 0: actual, 1: forecast

class CarbonScore(Base):
    __tablename__ = "carbon_scores"
    
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    zone_id = Column(String(50), nullable=False, index=True)
    kg_co2 = Column(Float, nullable=False)
    intensity_kg_per_mwh = Column(Float, nullable=False)
    source_breakdown = Column(JSON, nullable=True)

class RLAIFLog(Base):
    __tablename__ = "rlaif_logs"
    
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    iteration = Column(Integer, nullable=False)
    mape_before = Column(Float, nullable=False)
    mape_after = Column(Float, nullable=False)
    root_cause = Column(String(255), nullable=True)
    model_version = Column(String(100), nullable=False)

class WeatherReading(Base):
    __tablename__ = "weather_readings"
    
    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    zone_id = Column(String(50), nullable=False, index=True)
    temp_c = Column(Float, nullable=False)
    solar_w_m2 = Column(Float, nullable=False)
    wind_ms = Column(Float, nullable=False)
    humidity_pct = Column(Float, nullable=False)
