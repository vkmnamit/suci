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
        },
        {
            "id": "int-5",
            "title": "Urban Reforestation",
            "description": "Planting 10,000 native trees across industrial fringes.",
            "impact": "Medium",
            "cost": "€0.3M",
            "co2_reduction": "4.5%",
            "status": "planned"
        },
        {
            "id": "int-6",
            "title": "Smart Street Lighting",
            "description": "IoT-enabled motion sensing LED grid.",
            "impact": "Low",
            "cost": "€0.5M",
            "co2_reduction": "2.1%",
            "status": "ready"
        },
        {
            "id": "int-7",
            "title": "Waste-to-Energy",
            "description": "Methane capture from central landfill.",
            "impact": "High",
            "cost": "€3.5M",
            "co2_reduction": "11.2%",
            "status": "ready"
        },
        {
            "id": "int-8",
            "title": "Industrial CCUS",
            "description": "Carbon capture for steel manufacturing zones.",
            "impact": "High",
            "cost": "€12.0M",
            "co2_reduction": "22.3%",
            "status": "planned"
        }
    ]

@router.post("/{intervention_id}/activate")
async def activate_intervention(intervention_id: str):
    return {"status": "success", "message": f"Intervention {intervention_id} activated", "impact": "immediate"}
