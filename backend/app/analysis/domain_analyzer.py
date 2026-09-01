import re
from app.analysis.brand_similarity import check_brand_impersonation, normalize_domain
from app.analysis.sender_analyzer import SUSPICIOUS_TLDS

def analyze_domain(domain_str: str) -> dict:
    domain = normalize_domain(domain_str)
    
    parts = domain.split('.')
    tld = parts[-1] if len(parts) > 1 else ""
    subdomain_count = max(0, len(parts) - 2)
    has_hyphens = '-' in domain
    
    # Check numbers replacing letters
    has_numbers = bool(re.search(r'\d', parts[0] if parts else domain))
    domain_length = len(domain)
    
    is_suspicious_tld = tld in SUSPICIOUS_TLDS
    
    # Brand similarity check
    brand_check = check_brand_impersonation(domain)
    
    indicators = []
    risk_level = "SAFE"
    
    if brand_check["is_impersonation"]:
        indicators.append(f"Domain '{domain}' closely resembles known brand '{brand_check['detected_brand']}' ({brand_check['similarity_score']}% similarity).")
        risk_level = "CRITICAL"
        
    if has_hyphens and brand_check["is_impersonation"]:
        indicators.append(f"Suspicious hyphenation in domain '{domain}' attempting to trick recipients.")
        
    if has_numbers and brand_check["is_impersonation"]:
        indicators.append("Number substitution (leetspeak/homoglyph) detected in domain name.")
        
    if subdomain_count >= 3:
        indicators.append(f"Excessive subdomains ({subdomain_count}) detected, often used to conceal target host.")
        if risk_level != "CRITICAL":
            risk_level = "HIGH"
            
    if is_suspicious_tld:
        indicators.append(f"Domain uses high-risk TLD (.{tld}).")
        if risk_level not in ["CRITICAL", "HIGH"]:
            risk_level = "MEDIUM"

    if domain_length > 30:
        indicators.append(f"Abnormally long domain length ({domain_length} chars).")

    return {
        "domain": domain,
        "domain_length": domain_length,
        "subdomain_count": subdomain_count,
        "has_hyphens": has_hyphens,
        "has_numbers": has_numbers,
        "is_suspicious_tld": is_suspicious_tld,
        "detected_brand": brand_check["detected_brand"],
        "legitimate_brand_domain": brand_check["legitimate_domain"],
        "brand_similarity_score": brand_check["similarity_score"],
        "is_brand_impersonation": brand_check["is_impersonation"],
        "risk_level": risk_level,
        "indicators": indicators
    }
