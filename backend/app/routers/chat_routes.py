from fastapi import APIRouter, Depends, Body
from fastapi.responses import StreamingResponse
from app.services.chat import ChatService, get_chat_service
from app.db.supabase_client import get_supabase
from typing import List, Dict, Optional
import json
from datetime import datetime

chat_router = APIRouter()

@chat_router.post("/message")
async def send_chat_message(
    message: str = Body(..., embed=True),
    conversation_id: str = Body("default", embed=True),
    stream: bool = Body(False, embed=True),
    chat_service: ChatService = Depends(get_chat_service),
    supabase = Depends(get_supabase)
):
    """Send a user message to SUCI's AI analyst and get a context-grounded response."""
    if conversation_id is None:
        conversation_id = "default"
        
    # Save user message
    supabase.table("chat_history").insert({
        "conversation_id": conversation_id,
        "role": "user",
        "content": message
    }).execute()
        
    # Fetch history for context
    res = supabase.table("chat_history").select("role, content").eq("conversation_id", conversation_id).order("created_at").execute()
    history = [{"role": row["role"], "content": row["content"]} for row in (res.data or [])]
    
    # If streaming is requested, return a StreamingResponse
    if stream:
        async def response_streamer():
            # Initial token for SSE
            yield f"data: {json.dumps({'token': ''})}\n\n"
            
            full_response = ""
            async for token in chat_service.send_message_stream(message, history):
                full_response += token
                yield f"data: {json.dumps({'token': token})}\n\n"
                
            # Persist the output of AI into the Supabase table even in streaming mode!
            supabase.table("chat_history").insert({
                "conversation_id": conversation_id,
                "role": "assistant",
                "content": full_response
            }).execute()
            
            yield f"data: {json.dumps({'done': True, 'full_response': full_response})}\n\n"

        return StreamingResponse(response_streamer(), media_type="text/event-stream")
    
    else:
        # Fetch non-streaming response from ChatService
        response = await chat_service.send_message(message, history)
        
        supabase.table("chat_history").insert({
            "conversation_id": conversation_id,
            "role": "assistant",
            "content": response
        }).execute()
        
        return {"response": response}

@chat_router.post("/briefing")
async def get_daily_briefing(chat_service: ChatService = Depends(get_chat_service)):
    """Generate a daily morning briefing of the city's state."""
    briefing = await chat_service.generate_morning_briefing()
    return {"briefing": briefing}

@chat_router.get("/history")
async def get_chat_history(conversation_id: str = "default", supabase = Depends(get_supabase)):
    """Retrieve the conversation history for a specific chat ID."""
    try:
        res = supabase.table("chat_history").select("id, role, content, created_at").eq("conversation_id", conversation_id).order("created_at").execute()
        history = [{"id": str(row["id"]), "role": row["role"], "content": row["content"], "timestamp": row["created_at"]} for row in (res.data or [])]
        return {"history": history}
    except Exception:
        return {"history": []}

router = chat_router
