import re

KNOWN_BRANDS = [
    {"name": "PayPal", "domain": "paypal.com", "keywords": ["paypal", "paypa1", "paypals"]},
    {"name": "Google", "domain": "google.com", "keywords": ["google", "goog1e", "g00gle"]},
    {"name": "Microsoft", "domain": "microsoft.com", "keywords": ["microsoft", "micros0ft", "mcrosoft", "msft"]},
    {"name": "Amazon", "domain": "amazon.com", "keywords": ["amazon", "amaz0n", "amazn"]},
    {"name": "Apple", "domain": "apple.com", "keywords": ["apple", "app1e", "appl"]},
    {"name": "Netflix", "domain": "netflix.com", "keywords": ["netflix", "netfl1x"]},
    {"name": "LinkedIn", "domain": "linkedin.com", "keywords": ["linkedin", "linked1n"]},
    {"name": "Instagram", "domain": "instagram.com", "keywords": ["instagram", "instagr0m"]},
    {"name": "Facebook", "domain": "facebook.com", "keywords": ["facebook", "faceb00k"]},
    {"name": "Bank of America", "domain": "bankofamerica.com", "keywords": ["bankofamerica", "bofa"]},
    {"name": "Chase", "domain": "chase.com", "keywords": ["chase", "chasebank"]},
    {"name": "Wells Fargo", "domain": "wellsfargo.com", "keywords": ["wellsfargo"]},
    {"name": "DHL", "domain": "dhl.com", "keywords": ["dhl", "dhl-express"]},
    {"name": "FedEx", "domain": "fedex.com", "keywords": ["fedex"]},
    {"name": "DocuSign", "domain": "docusign.com", "keywords": ["docusign", "docus1gn"]},
    {"name": "USPS", "domain": "usps.com", "keywords": ["usps", "usps-tracking"]}
]

HOMOGLYPH_MAP = {
    '1': 'l',
    '0': 'o',
    '3': 'e',
    '@': 'a',
    'vv': 'w',
    'rn': 'm',
    '5': 's',
    '8': 'b',
    '$': 's'
}

def normalize_domain(domain_str: str) -> str:
    domain_clean = domain_str.lower().strip()
    # strip protocol if present
    if "://" in domain_clean:
        domain_clean = domain_clean.split("://")[1]
    domain_clean = domain_clean.split("/")[0].split(":")[0]
    return domain_clean

def levenshtein_distance(s1: str, s2: str) -> int:
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

def normalize_homoglyphs(text: str) -> str:
    res = text.lower()
    for src, target in HOMOGLYPH_MAP.items():
        res = res.replace(src, target)
    return res

def check_brand_impersonation(domain: str) -> dict:
    clean_dom = normalize_domain(domain)
    
    # Strip TLD for matching root domain
    parts = clean_dom.split('.')
    if len(parts) >= 2:
        root_name = parts[-2]
    else:
        root_name = clean_dom

    # Check exact match with known brand domains
    for brand in KNOWN_BRANDS:
        if clean_dom == brand["domain"] or clean_dom.endswith("." + brand["domain"]):
            return {
                "detected_brand": brand["name"],
                "legitimate_domain": brand["domain"],
                "similarity_score": 100.0,
                "is_impersonation": False,
                "reason": "Legitimate brand domain match."
            }

    best_match = None
    max_score = 0.0
    reason_str = ""

    for brand in KNOWN_BRANDS:
        legit_root = brand["domain"].split('.')[0]
        
        # Method 1: Normalized homoglyph substring search
        normalized_root = normalize_homoglyphs(root_name)
        if legit_root in normalized_root or any(kw in normalized_root for kw in brand["keywords"]):
            # Substring match with character substitution or hyphenated suffix like paypa1-login
            score = 94.0 if root_name != legit_root else 100.0
            if score > max_score and clean_dom != brand["domain"]:
                max_score = score
                best_match = brand
                reason_str = f"Domain '{clean_dom}' contains brand target pattern '{legit_root}' with character substitution or suspicious suffix."

        # Method 2: Levenshtein distance check on root domain name
        dist = levenshtein_distance(normalized_root, legit_root)
        max_len = max(len(normalized_root), len(legit_root))
        if max_len > 0:
            ratio = (1.0 - (dist / max_len)) * 100.0
            if ratio > 65.0 and ratio > max_score and clean_dom != brand["domain"]:
                max_score = ratio
                best_match = brand
                reason_str = f"Domain root '{root_name}' has high similarity ({ratio:.1f}%) to brand '{brand['name']}' ({legit_root})."

    if best_match and max_score >= 65.0:
        return {
            "detected_brand": best_match["name"],
            "legitimate_domain": best_match["domain"],
            "similarity_score": round(max_score, 1),
            "is_impersonation": True,
            "reason": reason_str
        }

    return {
        "detected_brand": None,
        "legitimate_domain": None,
        "similarity_score": 0.0,
        "is_impersonation": False,
        "reason": "No brand impersonation detected."
    }
