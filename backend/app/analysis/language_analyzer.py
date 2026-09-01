import re

URGENCY_KEYWORDS = [
    "urgent", "immediately", "suspended", "suspension", "verify", 
    "verification", "account locked", "account disabled", "action required", 
    "confirm now", "limited time", "password", "security alert", "payment", 
    "invoice", "click here", "login", "update account", "unauthorized",
    "24 hours", "terminate", "penalty", "billing", "expire", "restricted"
]

THREAT_PATTERNS = [
    (r"account (will be|has been) (suspended|disabled|locked|terminated)", "Account suspension threat"),
    (r"(verify|confirm|update) your (account|identity|billing|information) (immediately|now|within)", "Immediate verification demand"),
    (r"(unauthorized|suspicious) (activity|access|login) detected", "Fake security warning"),
    (r"action required within \d+ hours", "Time-pressured constraint"),
    (r"(failure|unless you) (to verify|to update) will result in", "Coercive consequence phrase"),
    (r"(click (the|here|this) link|click below)", "Call to action payload trigger")
]

def analyze_language(subject: str, body: str) -> dict:
    combined_text = f"{subject} {body}".lower()
    
    detected_keywords = []
    for kw in URGENCY_KEYWORDS:
        if re.search(r'\b' + re.escape(kw) + r'\b', combined_text):
            detected_keywords.append(kw)

    # Deduplicate keywords
    detected_keywords = list(set(detected_keywords))

    detected_phrases = []
    for pattern, description in THREAT_PATTERNS:
        if re.search(pattern, combined_text):
            detected_phrases.append(description)

    financial_demands = any(kw in combined_text for kw in ["payment", "invoice", "billing", "credit card", "bank", "wire transfer", "refund"])
    account_suspension = any(kw in combined_text for kw in ["suspended", "suspension", "locked", "disabled", "terminate", "restricted"])

    # Calculate urgency score (0 - 100)
    base_score = len(detected_keywords) * 12
    phrase_score = len(detected_phrases) * 20
    
    if account_suspension:
        base_score += 25
    if financial_demands:
        base_score += 15

    urgency_score = min(100, base_score + phrase_score)

    indicators = []
    risk_level = "SAFE"

    if urgency_score >= 70:
        risk_level = "HIGH"
        indicators.append(f"High language urgency score ({urgency_score}/100) detected in email body/subject.")
    elif urgency_score >= 40:
        risk_level = "MEDIUM"
        indicators.append(f"Moderate psychological pressure and urgency indicators detected ({urgency_score}/100).")

    if account_suspension:
        indicators.append("Email threatens account suspension or closure to create fear and force rapid action.")

    if len(detected_phrases) > 0:
        indicators.append(f"Coercive NLP threat patterns detected: {', '.join(detected_phrases)}.")

    return {
        "urgency_score": urgency_score,
        "detected_keywords": detected_keywords,
        "threat_phrases": detected_phrases,
        "financial_demands": financial_demands,
        "account_suspension_warning": account_suspension,
        "risk_level": risk_level,
        "indicators": indicators
    }
