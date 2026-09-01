import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.database import get_db
from app.models import Incident

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

@router.get("")
def list_incidents(
    search: Optional[str] = None,
    severity: Optional[str] = None,
    verdict: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Incident)

    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Incident.incident_id.like(term),
                Incident.sender.like(term),
                Incident.recipient.like(term),
                Incident.subject.like(term),
                Incident.domain.like(term),
                Incident.detected_brand.like(term)
            )
        )

    if severity and severity.upper() != "ALL":
        query = query.filter(Incident.severity == severity.upper())

    if verdict and verdict.upper() != "ALL":
        query = query.filter(Incident.verdict == verdict.upper())

    if status and status.upper() != "ALL":
        query = query.filter(Incident.status == status.upper())

    total = query.count()
    incidents = query.order_by(desc(Incident.created_at)).offset(offset).limit(limit).all()

    items = []
    for inc in incidents:
        items.append({
            "id": inc.id,
            "incident_id": inc.incident_id,
            "sender": inc.sender,
            "recipient": inc.recipient,
            "subject": inc.subject,
            "domain": inc.domain,
            "detected_brand": inc.detected_brand,
            "risk_score": inc.risk_score,
            "severity": inc.severity,
            "verdict": inc.verdict,
            "confidence": inc.confidence,
            "status": inc.status,
            "created_at": inc.created_at.strftime("%Y-%m-%d %H:%M:%S") if inc.created_at else ""
        })

    return {
        "total": total,
        "items": items
    }

@router.get("/{incident_id}")
def get_incident(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.incident_id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found.")

    def parse_json_field(val):
        if not val:
            return None
        try:
            return json.loads(val)
        except Exception:
            return val

    return {
        "id": inc.id,
        "incident_id": inc.incident_id,
        "sender": inc.sender,
        "recipient": inc.recipient,
        "subject": inc.subject,
        "body": inc.body,
        "domain": inc.domain,
        "detected_brand": inc.detected_brand,
        "risk_score": inc.risk_score,
        "severity": inc.severity,
        "verdict": inc.verdict,
        "confidence": inc.confidence,
        "status": inc.status,
        "created_at": inc.created_at.strftime("%Y-%m-%d %H:%M:%S") if inc.created_at else "",
        "sender_analysis": parse_json_field(inc.sender_analysis_json),
        "domain_analysis": parse_json_field(inc.domain_analysis_json),
        "url_analysis": parse_json_field(inc.url_analysis_json),
        "language_analysis": parse_json_field(inc.language_analysis_json),
        "attachment_analysis": parse_json_field(inc.attachments_json),
        "indicators": parse_json_field(inc.indicators_json) or [],
        "iocs": parse_json_field(inc.iocs_json) or [],
        "score_breakdown": parse_json_field(inc.score_breakdown_json) or [],
        "recommendation": parse_json_field(inc.recommendations_json) or []
    }

@router.patch("/{incident_id}/status")
def update_incident_status(incident_id: str, payload: dict, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.incident_id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")

    new_status = payload.get("status", "OPEN").upper()
    if new_status not in ["OPEN", "INVESTIGATING", "RESOLVED", "CLOSED"]:
        raise HTTPException(status_code=400, detail="Invalid status value")

    inc.status = new_status
    db.commit()
    return {"incident_id": incident_id, "status": new_status}

@router.delete("/{incident_id}")
def delete_incident(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(Incident).filter(Incident.incident_id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    db.delete(inc)
    db.commit()
    return {"message": f"Incident '{incident_id}' deleted successfully."}
