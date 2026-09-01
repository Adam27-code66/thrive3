import re
from app.analysis.brand_similarity import check_brand_impersonation

FREE_EMAIL_PROVIDERS = [
    "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", 
    "aol.com", "icloud.com", "protonmail.com", "mail.com", "zoho.com"
]

SUSPICIOUS_TLDS = [
    "xyz", "top", "tk", "ml", "ga", "cf", "gq", "work", "click", 
    "site", "biz", "online", "tech", "zip", "mov", "monster", "icu"
]

def analyze_sender(sender_str: str, body_text: str = "") -> dict:
    sender_str = sender_str.strip()
    display_name = ""
    email_address = sender_str

    # Extract display name if present: "PayPal Support <security@paypa1-login.com>"
    match = re.match(r'^(.*?)\s*<([^>]+)>$', sender_str)
    if match:
        display_name = match.group(1).strip('"\' ')
        email_address = match.group(2).strip()

    parts = email_address.split('@')
    sender_domain = parts[1].lower() if len(parts) > 1 else ""

    indicators = []
    risk_level = "SAFE"
    is_free_provider = sender_domain in FREE_EMAIL_PROVIDERS
    
    tld = sender_domain.split('.')[-1] if '.' in sender_domain else ""
    is_suspicious_tld = tld in SUSPICIOUS_TLDS

    # Check brand impersonation on sender domain
    brand_check = check_brand_impersonation(sender_domain)
    
    # Check display name mismatch (e.g. Display name says "PayPal" or "Google" but sender is free email or fake domain)
    display_name_mismatch = False
    if display_name:
        for brand in ["paypal", "google", "microsoft", "amazon", "apple", "netflix", "bank", "chase", "support", "security", "billing"]:
            if brand in display_name.lower() and sender_domain != f"{brand}.com" and not brand_check["is_impersonation"]:
                if is_free_provider or not sender_domain.endswith(f"{brand}.com"):
                    display_name_mismatch = True
                    indicators.append(f"Display name '{display_name}' claims to be brand/security service, but actual sender domain is '{sender_domain}'.")
                    break

    if is_free_provider and display_name_mismatch:
        indicators.append(f"Free email provider '{sender_domain}' used to impersonate official organization.")

    if is_suspicious_tld:
        indicators.append(f"Sender email uses high-risk Top-Level Domain (.{tld}).")

    if brand_check["is_impersonation"]:
        indicators.append(f"Sender domain '{sender_domain}' impersonates brand '{brand_check['detected_brand']}'.")

    # Determine risk level
    if brand_check["is_impersonation"] or display_name_mismatch:
        risk_level = "HIGH"
    elif is_suspicious_tld:
        risk_level = "MEDIUM"

    return {
        "sender_email": email_address,
        "sender_domain": sender_domain,
        "display_name": display_name if display_name else None,
        "is_free_provider": is_free_provider,
        "is_suspicious_tld": is_suspicious_tld,
        "display_name_mismatch": display_name_mismatch,
        "domain_mismatch": display_name_mismatch or brand_check["is_impersonation"],
        "risk_level": risk_level,
        "indicators": indicators,
        "detected_brand": brand_check["detected_brand"],
        "brand_similarity": brand_check["similarity_score"]
    }
