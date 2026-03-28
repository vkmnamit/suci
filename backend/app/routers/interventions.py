from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

@router.get("/")
async def get_interventions():
    return [
        {
            "id": "int-1",
            "title": "Grid Decarbonization",
            "description": "Switching 30% of industrial load to renewable sources.",
            "impact": "High",
            "cost": "€2.4M",
            "co2_reduction": "12.5%",
            "status": "ready"
        },
        {
            "id": "int-2",
            "title": "Smart Traffic Flow",
            "description": "AI-driven traffic management in core zones.",
            "impact": "Medium",
            "cost": "€0.8M",
            "co2_reduction": "8.2%",
            "status": "active"
        },
        {
            "id": "int-3",
            "title": "Zone Retrofitting",
            "description": "Energy efficiency upgrades for older buildings.",
            "impact": "High",
            "cost": "€4.1M",
            "co2_reduction": "15.7%",
            "status": "planned"
        },
        {
            "id": "int-4",
            "title": "Public EV Expansion",
            "description": "Deployment of 500 new EV charging stations.",
            "impact": "Medium",
            "cost": "€1.2M",
            "co2_reduction": "6.8%",
            "status": "active"
        }
    ]

@router.post("/{intervention_id}/activate")
async def activate_intervention(intervention_id: str):
    return {"status": "success", "message": f"Intervention {intervention_id} activated", "impact": "immediate"}
