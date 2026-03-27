import ollama
from app.config import settings
import asyncio
import time

async def check():
    print(f"🔍 Checking Ollama Connection at {settings.OLLAMA_HOST}...")
    try:
        # Check if ollama is reachable
        start_time = time.time()
        response = ollama.chat(
            model=settings.OLLAMA_REASONING_MODEL,
            messages=[{"role": "user", "content": "Return 'READY' if you hear me."}]
        )
        end_time = time.time()
        
        status = response['message']['content'].strip()
        print(f"✅ Ollama Status: {status}")
        print(f"⏱️ Response Time: {end_time - start_time:.2f}s")
        print(f"🧠 Using reasoning model: {settings.OLLAMA_REASONING_MODEL}")
        
    except Exception as e:
        print(f"❌ Ollama Connectivity Error: {str(e)}")
        print(f"💡 Tip: Start Ollama with `ollama run {settings.OLLAMA_REASONING_MODEL}` first.")

if __name__ == "__main__":
    asyncio.run(check())
