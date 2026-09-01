import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Incident
from app.seed import seed_database

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/{incident_id}/json")
def export_incident_json(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.incident_id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    def parse_j(val):
        try:
            return json.loads(val) if val else None
        except Exception:
            return val

    report_data = {
        "platform": "PhishLens — Explainable Phishing Investigation Platform",
        "generated_at": inc.created_at.strftime("%Y-%m-%dT%H:%M:%SZ") if inc.created_at else "",
        "incident_summary": {
            "incident_id": inc.incident_id,
            "status": inc.status,
            "verdict": inc.verdict,
            "severity": inc.severity,
            "risk_score": inc.risk_score,
            "confidence": inc.confidence,
            "detected_brand": inc.detected_brand
        },
        "email_metadata": {
            "sender": inc.sender,
            "recipient": inc.recipient,
            "subject": inc.subject,
            "domain": inc.domain,
            "body": inc.body
        },
        "forensic_analysis": {
            "sender_analysis": parse_j(inc.sender_analysis_json),
            "domain_analysis": parse_j(inc.domain_analysis_json),
            "url_analysis": parse_j(inc.url_analysis_json),
            "language_analysis": parse_j(inc.language_analysis_json),
            "attachment_analysis": parse_j(inc.attachments_json)
        },
        "risk_breakdown": parse_j(inc.score_breakdown_json) or [],
        "triggered_indicators": parse_j(inc.indicators_json) or [],
        "indicators_of_compromise": parse_j(inc.iocs_json) or [],
        "recommended_actions": parse_j(inc.recommendations_json) or []
    }

    return JSONResponse(
        content=report_data,
        headers={"Content-Disposition": f"attachment; filename={inc.incident_id}_report.json"}
    )

@router.post("/seed/reset")
def reset_seed_data(db: Session = Depends(get_db)):
    db.query(Incident).delete()
    db.commit()
    seed_database(db)
    return {"message": "Database successfully re-seeded with realistic phishing demo incidents."}
