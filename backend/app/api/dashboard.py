import json
from collections import Counter
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import Incident
from app.seed import seed_database

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    # Ensure seed data exists if table is empty
    seed_database(db)

    total_analyzed = db.query(Incident).count()
    critical_count = db.query(Incident).filter(Incident.severity == "CRITICAL").count()
    high_count = db.query(Incident).filter(Incident.severity == "HIGH").count()
    medium_count = db.query(Incident).filter(Incident.severity == "MEDIUM").count()
    low_count = db.query(Incident).filter(Incident.severity == "LOW").count()
    safe_count = db.query(Incident).filter(Incident.severity == "SAFE").count()

    # Threat Distribution for Pie/Donut chart
    threat_distribution = [
        {"name": "Critical Threat", "value": critical_count, "color": "#ef4444"},
        {"name": "High Risk", "value": high_count, "color": "#f97316"},
        {"name": "Medium Risk", "value": medium_count, "color": "#eab308"},
        {"name": "Low Risk", "value": low_count, "color": "#3b82f6"},
        {"name": "Safe / Clean", "value": safe_count, "color": "#22c55e"}
    ]

    # Calculate timeline stats (last 7 days)
    timeline_dict = {}
    today = datetime.utcnow().date()
    for i in range(6, -1, -1):
        day_str = (today - timedelta(days=i)).strftime("%b %d")
        timeline_dict[day_str] = {"date": day_str, "incidents": 0, "critical": 0, "high": 0, "medium": 0, "safe": 0}

    all_incidents = db.query(Incident).order_by(desc(Incident.created_at)).all()

    domain_counter = Counter()
    indicator_counter = Counter()

    for inc in all_incidents:
        if inc.created_at:
            day_key = inc.created_at.strftime("%b %d")
            if day_key in timeline_dict:
                timeline_dict[day_key]["incidents"] += 1
                sev = inc.severity.lower()
                if sev in timeline_dict[day_key]:
                    timeline_dict[day_key][sev] += 1

        if inc.domain and inc.severity in ["CRITICAL", "HIGH", "MEDIUM"]:
            domain_counter[inc.domain] += 1

        if inc.indicators_json:
            try:
                inds = json.loads(inc.indicators_json)
                for ind in inds:
                    title = ind.get("title") if isinstance(ind, dict) else str(ind)
                    if title:
                        indicator_counter[title] += 1
            except Exception:
                pass

    top_domains = [
        {"domain": dom, "count": count} 
        for dom, count in domain_counter.most_common(5)
    ]

    top_indicators = [
        {"indicator": title, "count": count}
        for title, count in indicator_counter.most_common(5)
    ]

    recent_incidents = [
        {
            "id": inc.id,
            "incident_id": inc.incident_id,
            "sender": inc.sender,
            "domain": inc.domain,
            "detected_brand": inc.detected_brand,
            "risk_score": inc.risk_score,
            "severity": inc.severity,
            "verdict": inc.verdict,
            "status": inc.status,
            "created_at": inc.created_at.strftime("%b %d, %H:%M") if inc.created_at else ""
        }
        for inc in all_incidents[:6]
    ]

    return {
        "summary": {
            "total_analyzed": total_analyzed,
            "critical_count": critical_count,
            "high_count": high_count,
            "medium_count": medium_count,
            "safe_count": safe_count
        },
        "threat_distribution": threat_distribution,
        "threats_over_time": list(timeline_dict.values()),
        "top_suspicious_domains": top_domains,
        "common_indicators": top_indicators,
        "recent_incidents": recent_incidents
    }
