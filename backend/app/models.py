import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from app.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(50), unique=True, index=True, nullable=False)
    sender = Column(String(255), index=True)
    recipient = Column(String(255))
    subject = Column(String(500))
    body = Column(Text)
    domain = Column(String(255), index=True)
    detected_brand = Column(String(100), nullable=True)
    
    risk_score = Column(Integer, default=0, index=True)
    severity = Column(String(20), default="SAFE", index=True) # SAFE, LOW, MEDIUM, HIGH, CRITICAL
    verdict = Column(String(50), default="SAFE", index=True)   # LIKELY PHISHING, SUSPICIOUS, SAFE
    confidence = Column(Integer, default=80)
    status = Column(String(20), default="OPEN", index=True)   # OPEN, INVESTIGATING, RESOLVED, CLOSED
    
    sender_analysis_json = Column(Text, nullable=True)
    domain_analysis_json = Column(Text, nullable=True)
    url_analysis_json = Column(Text, nullable=True)
    language_analysis_json = Column(Text, nullable=True)
    attachments_json = Column(Text, nullable=True)
    indicators_json = Column(Text, nullable=True)
    iocs_json = Column(Text, nullable=True)
    score_breakdown_json = Column(Text, nullable=True)
    recommendations_json = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
