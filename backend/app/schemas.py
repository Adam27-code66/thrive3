from pydantic import BaseModel
from typing import List, Optional, Any, Dict
import datetime

class AnalyzeRequest(BaseModel):
    sender: str
    recipient: Optional[str] = "employee@company.com"
    subject: str
    body: str
    attachments: Optional[List[Dict[str, Any]]] = []

class IndicatorItem(BaseModel):
    category: str      # Sender, Domain, URL, Urgency, Attachment
    severity: str      # CRITICAL, HIGH, MEDIUM, LOW, SAFE
    title: str
    description: str
    evidence: str
    impact_score: int

class IOCItem(BaseModel):
    type: str          # Email, Domain, URL, IP, Keyword, File Hash
    value: str
    context: Optional[str] = ""

class ScoreBreakdownItem(BaseModel):
    factor: str
    points: int
    description: str

class SenderAnalysis(BaseModel):
    sender_email: str
    sender_domain: str
    display_name: Optional[str] = None
    is_free_provider: bool = False
    is_suspicious_tld: bool = False
    display_name_mismatch: bool = False
    domain_mismatch: bool = False
    risk_level: str = "SAFE"
    indicators: List[str] = []

class DomainAnalysis(BaseModel):
    domain: str
    domain_length: int
    subdomain_count: int
    has_hyphens: bool
    has_numbers: bool
    is_suspicious_tld: bool
    detected_brand: Optional[str] = None
    brand_similarity_score: float = 0.0
    is_brand_impersonation: bool = False
    risk_level: str = "SAFE"
    indicators: List[str] = []

class URLItem(BaseModel):
    url: str
    protocol: str
    domain: str
    path: str
    is_ip_address: bool = False
    is_shortened: bool = False
    has_suspicious_keywords: bool = False
    is_brand_impersonation: bool = False
    risk_level: str = "SAFE"

class URLAnalysis(BaseModel):
    total_urls: int = 0
    urls: List[URLItem] = []
    has_http_links: bool = False
    has_ip_urls: bool = False
    has_shortened_urls: bool = False
    risk_level: str = "SAFE"
    indicators: List[str] = []

class LanguageAnalysis(BaseModel):
    urgency_score: int = 0
    detected_keywords: List[str] = []
    threat_phrases: List[str] = []
    financial_demands: bool = False
    account_suspension_warning: bool = False
    risk_level: str = "SAFE"
    indicators: List[str] = []

class AttachmentItem(BaseModel):
    filename: str
    file_type: Optional[str] = None
    size_bytes: Optional[int] = 0
    is_executable: bool = False
    has_double_extension: bool = False
    has_macros: bool = False
    risk_level: str = "SAFE"
    indicators: List[str] = []

class AttachmentAnalysis(BaseModel):
    total_attachments: int = 0
    attachments: List[AttachmentItem] = []
    has_high_risk_attachment: bool = False
    risk_level: str = "SAFE"
    indicators: List[str] = []

class AnalyzeResponse(BaseModel):
    incident_id: str
    verdict: str                  # LIKELY PHISHING, SUSPICIOUS, SAFE
    risk_score: int               # 0-100
    severity: str                 # CRITICAL, HIGH, MEDIUM, LOW, SAFE
    confidence: int               # 0-100
    detected_brand: Optional[str] = None
    
    sender_analysis: SenderAnalysis
    domain_analysis: DomainAnalysis
    url_analysis: URLAnalysis
    language_analysis: LanguageAnalysis
    attachment_analysis: AttachmentAnalysis
    
    indicators: List[IndicatorItem]
    iocs: List[IOCItem]
    score_breakdown: List[ScoreBreakdownItem]
    recommendation: List[str]
    
    created_at: Optional[str] = None

class IncidentSummary(BaseModel):
    id: int
    incident_id: str
    sender: str
    recipient: Optional[str]
    subject: str
    domain: Optional[str]
    detected_brand: Optional[str]
    risk_score: int
    severity: str
    verdict: str
    status: str
    created_at: str

class IncidentDetail(IncidentSummary):
    body: str
    confidence: int
    sender_analysis: Dict[str, Any]
    domain_analysis: Dict[str, Any]
    url_analysis: Dict[str, Any]
    language_analysis: Dict[str, Any]
    attachment_analysis: Dict[str, Any]
    indicators: List[Dict[str, Any]]
    iocs: List[Dict[str, Any]]
    score_breakdown: List[Dict[str, Any]]
    recommendation: List[str]
