from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "SUCI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # Supabase (Replacing custom Postgres/Redis)
    SUPABASE_URL: str = "https://your-project-id.supabase.co"
    SUPABASE_ANON_KEY: str = "your-anon-key"
    SUPABASE_SERVICE_ROLE_KEY: str = "your-service-role-key"
    
    # Use Supabase Connection String (Transaction mode recommended for serverless)
    TIMESCALE_URL: str = "postgresql+asyncpg://postgres:[password]@db.[project-id].supabase.co:5432/postgres"
    
    # Neo4j (Stays as graph storage)
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"
    
    # AI / External APIs
    OLLAMA_HOST: str = "http://localhost:11434"
    OLLAMA_REASONING_MODEL: str = "deepseek-r1:1.5b"
    OPENMETEO_BASE_URL: str = "https://api.open-meteo.com/v1"
    
    # RLAIF
    MODEL_RETRAIN_THRESHOLD: float = 0.10
    
    # Auth
    JWT_SECRET: str = "your-32-character-minimal-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Infrastructure
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minio_admin"
    MINIO_SECRET_KEY: str = "minio_password"
    
    CITY_DEFAULT: str = "bengaluru"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
