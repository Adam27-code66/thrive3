import json
import uuid
import datetime
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Incident
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.analysis.sender_analyzer import analyze_sender
from app.analysis.domain_analyzer import analyze_domain
from app.analysis.url_analyzer import analyze_urls
from app.analysis.language_analyzer import analyze_language
from app.analysis.attachment_analyzer import analyze_attachments
from app.analysis.ioc_extractor import extract_iocs
from app.analysis.risk_engine import calculate_risk
from app.services.eml_parser import parse_email_file

router = APIRouter(prefix="/api", tags=["Analysis"])

def run_full_analysis(sender: str, recipient: str, subject: str, body: str, attachments: list, db: Session) -> dict:
    sender = sender or "unknown@external-domain.com"
    recipient = recipient or "employee@company.com"
    subject = subject or "(No Subject)"
    body = body or ""
    attachments = attachments or []

    # 1. Individual analysis stages
    s_analysis = analyze_sender(sender, body)
    d_analysis = analyze_domain(s_analysis["sender_domain"])
    u_analysis = analyze_urls(body, s_analysis["sender_domain"])
    l_analysis = analyze_language(subject, body)
    a_analysis = analyze_attachments(attachments)

    # 2. Risk engine score calculation
    risk_result = calculate_risk(s_analysis, d_analysis, u_analysis, l_analysis, a_analysis)

    # 3. IOC Extraction
    iocs = extract_iocs(sender, recipient, subject, body, u_analysis.get("urls", []), attachments, l_analysis.get("detected_keywords", []))

    # Generate unique incident ID
    unique_suffix = str(uuid.uuid4().hex)[:4].upper()
    incident_id = f"INC-2026-{unique_suffix}"

    # Create & Save Incident in DB
    now = datetime.datetime.utcnow()
    inc = Incident(
        incident_id=incident_id,
        sender=sender,
        recipient=recipient,
        subject=subject,
        body=body,
        domain=d_analysis["domain"],
        detected_brand=risk_result.get("detected_brand"),
        risk_score=risk_result["risk_score"],
        severity=risk_result["severity"],
        verdict=risk_result["verdict"],
        confidence=risk_result["confidence"],
        status="OPEN" if risk_result["risk_score"] > 40 else "CLOSED",
        sender_analysis_json=json.dumps(s_analysis),
        domain_analysis_json=json.dumps(d_analysis),
        url_analysis_json=json.dumps(u_analysis),
        language_analysis_json=json.dumps(l_analysis),
        attachments_json=json.dumps(a_analysis),
        indicators_json=json.dumps(risk_result["indicators"]),
        iocs_json=json.dumps(iocs),
        score_breakdown_json=json.dumps(risk_result["score_breakdown"]),
        recommendations_json=json.dumps(risk_result["recommendation"]),
        created_at=now
    )
    
    db.add(inc)
    db.commit()

    return {
        "incident_id": incident_id,
        "verdict": risk_result["verdict"],
        "risk_score": risk_result["risk_score"],
        "severity": risk_result["severity"],
        "confidence": risk_result["confidence"],
        "detected_brand": risk_result.get("detected_brand"),
        "sender_analysis": s_analysis,
        "domain_analysis": d_analysis,
        "url_analysis": u_analysis,
        "language_analysis": l_analysis,
        "attachment_analysis": a_analysis,
        "indicators": risk_result["indicators"],
        "iocs": iocs,
        "score_breakdown": risk_result["score_breakdown"],
        "recommendation": risk_result["recommendation"],
        "created_at": now.isoformat()
    }

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_email(payload: AnalyzeRequest, db: Session = Depends(get_db)):
    try:
        res = run_full_analysis(
            sender=payload.sender,
            recipient=payload.recipient,
            subject=payload.subject,
            body=payload.body,
            attachments=payload.attachments or [],
            db=db
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email analysis error: {str(e)}")

@router.post("/analyze/file")
async def analyze_email_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        content = await file.read()
        parsed = parse_email_file(content, file.filename)
        res = run_full_analysis(
            sender=parsed["sender"],
            recipient=parsed["recipient"],
            subject=parsed["subject"],
            body=parsed["body"],
            attachments=parsed.get("attachments", []),
            db=db
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"File parsing error: {str(e)}")
