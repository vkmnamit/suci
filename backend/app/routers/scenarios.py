from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

@router.get("/")
async def get_scenarios():
    return [
        {
            "id": "scenario-1",
            "name": "High Solar Adoption",
            "date": "March 25, 2026",
            "reduction": 28.5,
            "params": "Traffic: 60%, Energy: 70%, Solar: 45%",
            "description": "Aggressive transition to solar power in residential zones."
        },
        {
            "id": "scenario-2",
            "name": "Traffic Optimization",
            "date": "March 23, 2026",
            "reduction": 18.2,
            "params": "Traffic: 45%, Energy: 65%, Solar: 32%",
            "description": "Smart traffic light synchronization and public transport push."
        },
        {
            "id": "scenario-3",
            "name": "Mixed Intervention",
            "date": "March 20, 2026",
            "reduction": 22.8,
            "params": "Traffic: 55%, Energy: 60%, Solar: 40%",
            "description": "Balanced approach using both energy and transport upgrades."
        }
    ]

@router.post("/")
async def save_scenario(scenario: Dict):
    # Mock save logic
    return {
        "status": "success", 
        "message": "Scenario saved to strategic vault", 
        "id": "scenario-new",
        "timestamp": "2026-03-28T08:30:00Z"
    }
