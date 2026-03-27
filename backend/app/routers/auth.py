from fastapi import APIRouter, Depends, HTTPException, Body
from app.db.supabase_client import get_supabase, Client, supabase_admin
from pydantic import EmailStr
from typing import Dict

auth_router = APIRouter()

@auth_router.post("/signup")
async def signup(
    email: EmailStr = Body(..., embed=True),
    password: str = Body(..., embed=True),
    supabase: Client = Depends(get_supabase)
):
    """Register a new city operator and create their default Organization."""
    name = email.split("@")[0].replace(".", " ").title()
    try:
        response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        if not response.user:
            raise HTTPException(status_code=400, detail="Signup failed in Supabase Auth")
        
        # 1. Create default Organization
        org_data = {"name": f"{name}'s Organization"}
        org_response = supabase_admin.table("organisations").insert(org_data).execute()
        
        org_id = None
        if org_response.data and len(org_response.data) > 0:
            org_id = org_response.data[0].get("id")

        # 2. Insert into public.users
        user_data = {
            "id": response.user.id,
            "email": email,
            "name": name,
            "role": "admin",
            "org_id": org_id
        }
        supabase_admin.table("users").upsert(user_data).execute()

        return {"user": response.user, "session": response.session, "message": "Signup successful"}

    except Exception as e:
        error_msg = str(e)
        if "User already registered" in error_msg or "already exists" in error_msg:
            # Fallback for users trying to sign up again - login instead
            return await login(email=email, password=password, supabase=supabase)
        
        # Raise true error instead of mocking
        raise HTTPException(status_code=400, detail=error_msg)

@auth_router.post("/login")
async def login(
    email: EmailStr = Body(..., embed=True),
    password: str = Body(..., embed=True),
    supabase: Client = Depends(get_supabase)
):
    """Log in as a city operator."""
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        # Update last_login
        if response.user:
            try:
                supabase_admin.table("users").update({"last_login": "now()"}).eq("id", response.user.id).execute()
            except Exception:
                pass
                
        return {"session": response.session, "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

@auth_router.get("/me")
async def get_current_user(token: str, supabase: Client = Depends(get_supabase)):
    """Retrieve the current user and organization details."""
    try:
        user_resp = supabase.auth.get_user(token)
        if not user_resp or getattr(user_resp, 'user', None) is None:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        db_user = supabase.table("users").select("*, organisations(*)").eq("id", user_resp.user.id).single().execute()
        
        return {"user": user_resp.user, "profile": db_user.data if db_user else None}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"User retrieval failed: {str(e)}")

@auth_router.post("/logout")
async def logout(supabase: Client = Depends(get_supabase)):
    """Sign out."""
    supabase.auth.sign_out()
    return {"status": "success"}

router = auth_router
