from fastapi import APIRouter
from typing import List, Dict

router = APIRouter()

@router.get("/")
async def get_reports():
    return [
        {
            "id": "rep-1",
            "title": "Monthly Climate Audit - Feb 2026",
            "date": "2026-03-01",
            "type": "Compliance",
            "status": "Finalized",
            "size": "2.4MB"
        },
        {
            "id": "rep-2",
            "title": "Energy Efficiency Analysis",
            "date": "2026-03-15",
            "type": "Performance",
            "status": "Draft",
            "size": "1.1MB"
        },
        {
            "id": "rep-3",
            "title": "Zone-wise Carbon Breakdown",
            "date": "2026-03-20",
            "type": "Strategic",
            "status": "Finalized",
            "size": "4.8MB"
        },
        {
            "id": "rep-4",
            "title": "AI Prediction Accuracy Report",
            "date": "2026-03-25",
            "type": "Model Performance",
            "status": "Processing",
            "size": "0.5MB"
        },
        {
            "id": "rep-5",
            "title": "Quarterly Urban Sustainability Audit Q1",
            "date": "2026-03-27",
            "type": "Sustainability",
            "status": "Finalized",
            "size": "12.2MB"
        },
        {
            "id": "rep-6",
            "title": "Industrial Emission Compliance - North",
            "date": "2026-03-27",
            "type": "Audit",
            "status": "Finalized",
            "size": "3.5MB"
        },
        {
            "id": "rep-7",
            "title": "Smart Grid Health Log",
            "date": "2026-03-28",
            "type": "Infrastructure",
            "status": "Ready",
            "size": "0.8MB"
        },
        {
            "id": "rep-8",
            "title": "Renewable Energy Transition Forecast",
            "date": "2026-03-28",
            "type": "Predictive",
            "status": "Draft",
            "size": "2.9MB"
        }
    ]

@router.get("/{report_id}/download")
async def download_report(report_id: str):
    return {"status": "success", "url": f"https://api.suci.urban/storage/reports/{report_id}.pdf"}
