from fastapi import APIRouter, Depends, Body
from fastapi.responses import StreamingResponse
from app.services.chat import ChatService, get_chat_service
from app.db.database_clients import get_db_session
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Optional
import json
import os
from datetime import datetime

CHAT_DB_FILE = "chat_db.json"

def load_chat_db():
    if os.path.exists(CHAT_DB_FILE):
        try:
            with open(CHAT_DB_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_chat_db(db):
    try:
        with open(CHAT_DB_FILE, "w") as f:
            json.dump(db, f, indent=2)
    except Exception:
        pass

chat_router = APIRouter()

@chat_router.post("/message")
async def send_chat_message(
    message: str = Body(..., embed=True),
    conversation_id: str = Body("default", embed=True),
    stream: bool = Body(False, embed=True),
    chat_service: ChatService = Depends(get_chat_service)
):
    """Send a user message to SUCI's AI analyst and get a context-grounded response."""
    chat_db = load_chat_db()
    if conversation_id is None:
        conversation_id = "default"
        
    if conversation_id not in chat_db:
        chat_db[conversation_id] = []
        
    history = [{"role": m["role"], "content": m["content"]} for m in chat_db[conversation_id]]
    
    # Save user message
    chat_db[conversation_id].append({
        "id": f"user-{datetime.now().timestamp()}",
        "role": "user",
        "content": message,
        "timestamp": datetime.now().isoformat()
    })
    save_chat_db(chat_db)
    
    # If streaming is requested, return a StreamingResponse
    if stream:
        async def response_streamer():
            # Initial token for SSE
            yield f"data: {json.dumps({'token': ''})}\n\n"
            
            async for token in chat_service.send_message_stream(message, history):
                yield f"data: {json.dumps({'token': token})}\n\n"
            
            yield f"data: {json.dumps({'done': True, 'full_response': 'Generated full response text here'})}\n\n"

        return StreamingResponse(response_streamer(), media_type="text/event-stream")
    
    else:
        # Fetch non-streaming response from ChatService
        response = await chat_service.send_message(message, history)
        
        chat_db[conversation_id].append({
            "id": f"assistant-{datetime.now().timestamp()}",
            "role": "assistant",
            "content": response,
            "timestamp": datetime.now().isoformat()
        })
        save_chat_db(chat_db)
        
        return {"response": response}

@chat_router.post("/briefing")
async def get_daily_briefing(chat_service: ChatService = Depends(get_chat_service)):
    """Generate a daily morning briefing of the city's state."""
    briefing = await chat_service.generate_morning_briefing()
    return {"briefing": briefing}

@chat_router.get("/history")
async def get_chat_history(conversation_id: str = "default"):
    """Retrieve the conversation history for a specific chat ID."""
    chat_db = load_chat_db()
    return {"history": chat_db.get(conversation_id, [])}

router = chat_router
