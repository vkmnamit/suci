from supabase import create_client, Client
from app.config import settings

# Singleton Supabase client
supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

# Admin client for service-role tasks (use with caution)
supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

def get_supabase() -> Client:
    """Dependency for getting the Supabase client."""
    return supabase_client
