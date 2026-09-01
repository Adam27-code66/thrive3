import re
from urllib.parse import urlparse
from app.analysis.brand_similarity import check_brand_impersonation, normalize_domain

URL_REGEX = r'https?://[^\s<>"]+|www\.[^\s<>"]+'

SHORTENER_DOMAINS = [
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", 
    "buff.ly", "ow.ly", "rb.gy", "cutt.ly", "rebrand.ly"
]

SUSPICIOUS_PATHS = [
    "verify", "login", "account", "update", "secure", "signin", 
    "auth", "banking", "confirm", "portal", "credential", "password", 
    "checkpoint", "validation", "suspended", "restore"
]

def extract_urls(text: str) -> list:
    urls = re.findall(URL_REGEX, text, re.IGNORECASE)
    # Deduplicate while preserving order
    seen = set()
    deduped = []
    for u in urls:
        clean_u = u.rstrip('.,;)"\'')
        if clean_u not in seen:
            seen.add(clean_u)
            deduped.append(clean_u)
    return deduped

def analyze_urls(body_text: str, sender_domain: str = "") -> dict:
    extracted = extract_urls(body_text)
    
    url_items = []
    has_http_links = False
    has_ip_urls = False
    has_shortened_urls = False
    indicators = []
    max_risk = "SAFE"

    for raw_url in extracted:
        full_url = raw_url if raw_url.startswith("http") else f"http://{raw_url}"
        parsed = urlparse(full_url)
        
        protocol = parsed.scheme.upper()
        domain = normalize_domain(parsed.netloc)
        path = parsed.path.lower()
        
        # Check HTTP
        if protocol == "HTTP":
            has_http_links = True
            
        # Check IP address as domain
        is_ip = bool(re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', domain))
        if is_ip:
            has_ip_urls = True
            
        # Check shortened
        is_shortened = domain in SHORTENER_DOMAINS
        if is_shortened:
            has_shortened_urls = True
            
        # Check suspicious path
        has_suspicious_kw = any(kw in path for kw in SUSPICIOUS_PATHS)
        
        # Check brand impersonation in URL domain
        brand_check = check_brand_impersonation(domain)
        is_brand_impersonation = brand_check["is_impersonation"]
        
        item_risk = "SAFE"
        if is_brand_impersonation or is_ip:
            item_risk = "CRITICAL"
        elif is_shortened or (protocol == "HTTP" and has_suspicious_kw):
            item_risk = "HIGH"
        elif protocol == "HTTP" or has_suspicious_kw:
            item_risk = "MEDIUM"

        url_items.append({
            "url": raw_url,
            "protocol": protocol,
            "domain": domain,
            "path": parsed.path,
            "is_ip_address": is_ip,
            "is_shortened": is_shortened,
            "has_suspicious_keywords": has_suspicious_kw,
            "is_brand_impersonation": is_brand_impersonation,
            "detected_brand": brand_check["detected_brand"],
            "risk_level": item_risk
        })

    # Summary indicators
    if has_ip_urls:
        indicators.append("Email contains links using raw IP addresses instead of legitimate domain names.")
        max_risk = "CRITICAL"
        
    any_impersonation = any(u["is_brand_impersonation"] for u in url_items)
    if any_impersonation:
        impersonated = [f"{u['domain']} ({u['detected_brand']})" for u in url_items if u['is_brand_impersonation']]
        indicators.append(f"Suspicious URL brand impersonation detected in link(s): {', '.join(impersonated)}.")
        max_risk = "CRITICAL"
        
    if has_http_links:
        indicators.append("Unencrypted HTTP protocol link detected in message body.")
        if max_risk not in ["CRITICAL"]:
            max_risk = "HIGH"

    if has_shortened_urls:
        indicators.append("URL shortener service used to disguise target destination.")
        if max_risk not in ["CRITICAL", "HIGH"]:
            max_risk = "HIGH"

    suspicious_path_count = sum(1 for u in url_items if u["has_suspicious_keywords"])
    if suspicious_path_count > 0:
        indicators.append(f"{suspicious_path_count} URL(s) contain credential harvesting path keywords (e.g., /verify, /login).")
        if max_risk == "SAFE":
            max_risk = "MEDIUM"

    return {
        "total_urls": len(url_items),
        "urls": url_items,
        "has_http_links": has_http_links,
        "has_ip_urls": has_ip_urls,
        "has_shortened_urls": has_shortened_urls,
        "risk_level": max_risk,
        "indicators": indicators
    }
