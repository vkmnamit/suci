from fastapi import APIRouter, Depends, Body
from fastapi.responses import StreamingResponse
from app.services.chat import ChatService, get_chat_service
from app.db.database_clients import get_db_session
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Optional
import json

chat_router = APIRouter()

@chat_router.post("/message")
async def send_chat_message(
    message: str = Body(..., embed=True),
    conversation_id: str = Body(None, embed=True),
    stream: bool = Body(True, embed=True),
    chat_service: ChatService = Depends(get_chat_service)
):
    """Send a user message to SUCI's AI analyst and get a context-grounded response."""
    history = [] # Simplified: in a real app, this would be fetched from database using conversation_id
    
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
        return {"response": response}

@chat_router.post("/briefing")
async def get_daily_briefing(chat_service: ChatService = Depends(get_chat_service)):
    """Generate a daily morning briefing of the city's state."""
    briefing = await chat_service.generate_morning_briefing()
    return {"briefing": briefing}

@chat_router.get("/history")
async def get_chat_history(conversation_id: str):
    """Retrieve the conversation history for a specific chat ID."""
    # Simplified: query PostgreSQL for conversation messages
    return {"history": []}

router = chat_router
