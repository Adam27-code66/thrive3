import json
import datetime
from sqlalchemy.orm import Session
from app.models import Incident
from app.analysis.sender_analyzer import analyze_sender
from app.analysis.domain_analyzer import analyze_domain
from app.analysis.url_analyzer import analyze_urls
from app.analysis.language_analyzer import analyze_language
from app.analysis.attachment_analyzer import analyze_attachments
from app.analysis.ioc_extractor import extract_iocs
from app.analysis.risk_engine import calculate_risk

SEED_INCIDENTS = [
    {
        "incident_id": "INC-2026-0001",
        "sender": "security@paypa1-login.com",
        "recipient": "employee@company.com",
        "subject": "Your account will be suspended!",
        "body": "Your PayPal account will be suspended unless you verify your account immediately. Click the link below to verify your identity.\n\nhttp://paypa1-login.com/verify",
        "attachments": [],
        "created_days_ago": 0
    },
    {
        "incident_id": "INC-2026-0002",
        "sender": "billing-alert@amaz0n-security.net",
        "recipient": "finance@company.com",
        "subject": "Urgent: Amazon Business Account Locked",
        "body": "Dear Customer,\n\nWe detected unauthorized access to your Amazon corporate account. Your payment methods have been disabled.\nAction required within 24 hours: http://amaz0n-security.net/signin\n\nPlease find attached invoice statement.",
        "attachments": [{"filename": "invoice_statement.pdf.exe", "size_bytes": 450000}],
        "created_days_ago": 1
    },
    {
        "incident_id": "INC-2026-0003",
        "sender": "admin@micros0ft-support.org",
        "recipient": "dev@company.com",
        "subject": "Security Alert: Microsoft 365 Password Expiration",
        "body": "Your Office365 corporate password expires today. Confirm your password immediately to prevent email disruption:\n\nhttp://104.28.16.8/login",
        "attachments": [],
        "created_days_ago": 2
    },
    {
        "incident_id": "INC-2026-0004",
        "sender": "accounts-notice@goog1e-verify.cc",
        "recipient": "marketing@company.com",
        "subject": "New Sign-in from Unknown Device",
        "body": "Google Security Alert: A new sign-in was detected on Windows in Frankfurt. If this was not you, review activity:\nhttp://goog1e-verify.cc/checkpoint",
        "attachments": [],
        "created_days_ago": 3
    },
    {
        "incident_id": "INC-2026-0005",
        "sender": "hr-updates@company.com",
        "recipient": "all-staff@company.com",
        "subject": "Quarterly Company Town Hall & Policy Update",
        "body": "Hi Team,\n\nPlease join us for our Q3 Town Hall meeting this Thursday at 2 PM EST. The meeting agenda and slides are attached below.\n\nBest regards,\nHuman Resources",
        "attachments": [{"filename": "Q3_TownHall_Agenda.pdf", "size_bytes": 1200000}],
        "created_days_ago": 4
    }
]

def seed_database(db: Session):
    existing_count = db.query(Incident).count()
    if existing_count > 0:
        return

    now = datetime.datetime.utcnow()

    for item in SEED_INCIDENTS:
        sender = item["sender"]
        recipient = item["recipient"]
        subject = item["subject"]
        body = item["body"]
        attachments = item["attachments"]
        
        # Run through analysis engine
        s_analysis = analyze_sender(sender, body)
        d_analysis = analyze_domain(s_analysis["sender_domain"])
        u_analysis = analyze_urls(body, s_analysis["sender_domain"])
        l_analysis = analyze_language(subject, body)
        a_analysis = analyze_attachments(attachments)
        
        risk_result = calculate_risk(s_analysis, d_analysis, u_analysis, l_analysis, a_analysis)
        iocs = extract_iocs(sender, recipient, subject, body, u_analysis.get("urls", []), attachments, l_analysis.get("detected_keywords", []))

        created_time = now - datetime.timedelta(days=item["created_days_ago"])

        inc = Incident(
            incident_id=item["incident_id"],
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
            created_at=created_time
        )
        db.add(inc)

    db.commit()
