def calculate_risk(
    sender_analysis: dict,
    domain_analysis: dict,
    url_analysis: dict,
    language_analysis: dict,
    attachment_analysis: dict
) -> dict:
    breakdown = []
    raw_points = 0

    # 1. Brand Impersonation (+25)
    is_brand_imp = domain_analysis.get("is_brand_impersonation") or any(
        u.get("is_brand_impersonation") for u in url_analysis.get("urls", [])
    )
    detected_brand = domain_analysis.get("detected_brand") or sender_analysis.get("detected_brand")
    
    if is_brand_imp:
        pts = 25
        raw_points += pts
        brand_name = detected_brand or "Major Brand"
        sim_score = domain_analysis.get("brand_similarity_score", 94.0)
        breakdown.append({
            "factor": "Brand Impersonation",
            "points": pts,
            "description": f"Domain closely resembles legitimate brand '{brand_name}' with {sim_score}% similarity."
        })

    # 2. Suspicious Domain (+20)
    if domain_analysis.get("risk_level") in ["CRITICAL", "HIGH"] or domain_analysis.get("has_hyphens") or domain_analysis.get("has_numbers"):
        pts = 20
        raw_points += pts
        breakdown.append({
            "factor": "Suspicious Domain",
            "points": pts,
            "description": f"Domain '{domain_analysis.get('domain')}' uses character substitution or high-risk domain structure."
        })

    # 3. Suspicious Sender / Display Name Mismatch (+15)
    if sender_analysis.get("domain_mismatch") or sender_analysis.get("display_name_mismatch") or sender_analysis.get("is_suspicious_tld"):
        pts = 15
        raw_points += pts
        breakdown.append({
            "factor": "Suspicious Sender",
            "points": pts,
            "description": "Sender email domain mismatches claimed identity or utilizes untrusted TLD/provider."
        })

    # 4. Suspicious URL (+15)
    if url_analysis.get("risk_level") in ["CRITICAL", "HIGH"] or url_analysis.get("has_ip_urls") or url_analysis.get("has_shortened_urls"):
        pts = 15
        raw_points += pts
        breakdown.append({
            "factor": "Suspicious URL",
            "points": pts,
            "description": "Email contains links pointing to verification/login harvesting forms or IP addresses."
        })

    # 5. HTTP Connection (+10)
    if url_analysis.get("has_http_links"):
        pts = 10
        raw_points += pts
        breakdown.append({
            "factor": "Insecure HTTP Protocol",
            "points": pts,
            "description": "Message includes unencrypted HTTP hyperlink(s) instead of secure HTTPS."
        })

    # 6. Urgency Language (+10)
    urg_score = language_analysis.get("urgency_score", 0)
    if urg_score >= 50 or language_analysis.get("account_suspension_warning"):
        pts = 10
        raw_points += pts
        breakdown.append({
            "factor": "Urgency & Psychological Pressure",
            "points": pts,
            "description": "Text creates artificial urgency threatening account suspension or immediate deadline."
        })

    # 7. Suspicious Keywords (+5)
    if len(language_analysis.get("detected_keywords", [])) >= 2:
        pts = 5
        raw_points += pts
        breakdown.append({
            "factor": "Suspicious Keywords",
            "points": pts,
            "description": f"Detected suspicious phishing keywords: {', '.join(language_analysis.get('detected_keywords', [])[:4])}."
        })

    # 8. Suspicious Attachment (+15)
    if attachment_analysis.get("has_high_risk_attachment"):
        pts = 15
        raw_points += pts
        breakdown.append({
            "factor": "Suspicious Attachment",
            "points": pts,
            "description": "High-risk attachment present (executable payload, double extension, or macro script)."
        })

    # Normalize score range
    if raw_points >= 90:
        final_score = min(98, max(91, raw_points))
    elif raw_points >= 70:
        final_score = min(89, raw_points)
    elif raw_points >= 40:
        final_score = min(69, raw_points)
    elif raw_points >= 20:
        final_score = min(39, raw_points)
    else:
        final_score = min(18, raw_points)

    # Determine Severity & Verdict
    if final_score >= 81:
        severity = "CRITICAL"
        verdict = "LIKELY PHISHING"
        confidence = 96
    elif final_score >= 61:
        severity = "HIGH"
        verdict = "LIKELY PHISHING"
        confidence = 91
    elif final_score >= 41:
        severity = "MEDIUM"
        verdict = "SUSPICIOUS"
        confidence = 85
    elif final_score >= 21:
        severity = "LOW"
        verdict = "SAFE"
        confidence = 88
    else:
        severity = "SAFE"
        verdict = "SAFE"
        confidence = 95

    # Consolidate all triggered indicators into a unified list
    all_indicators = []

    # Helper to add indicator items
    def add_ind(cat, sev, title, desc, ev, impact):
        all_indicators.append({
            "category": cat,
            "severity": sev,
            "title": title,
            "description": desc,
            "evidence": ev,
            "impact_score": impact
        })

    if is_brand_imp:
        add_ind(
            "Domain", "CRITICAL", "Brand Impersonation",
            f"The domain closely resembles '{detected_brand or 'known brand'}' and uses character substitution.",
            f"Domain: {domain_analysis.get('domain')} | Target Brand: {detected_brand} | Similarity: {domain_analysis.get('brand_similarity_score', 94)}%",
            25
        )

    if sender_analysis.get("indicators"):
        for ind_str in sender_analysis["indicators"]:
            add_ind("Sender", sender_analysis.get("risk_level", "HIGH"), "Suspicious Sender Profile", ind_str, f"Sender: {sender_analysis.get('sender_email')}", 15)

    if url_analysis.get("indicators"):
        for ind_str in url_analysis["indicators"]:
            add_ind("URL", url_analysis.get("risk_level", "HIGH"), "Suspicious Link", ind_str, f"Detected URLs: {url_analysis.get('total_urls')}", 15)

    if language_analysis.get("indicators"):
        for ind_str in language_analysis["indicators"]:
            add_ind("Language", language_analysis.get("risk_level", "MEDIUM"), "Urgency Language", ind_str, f"Keywords: {', '.join(language_analysis.get('detected_keywords', []))}", 10)

    if attachment_analysis.get("indicators"):
        for ind_str in attachment_analysis["indicators"]:
            add_ind("Attachment", attachment_analysis.get("risk_level", "CRITICAL"), "Dangerous Attachment", ind_str, f"Total Attachments: {attachment_analysis.get('total_attachments')}", 15)

    # Mitigation recommendations
    recommendations = []
    if severity in ["CRITICAL", "HIGH"]:
        recommendations = [
            "Do NOT click any URLs or open attachments contained in this email.",
            "Do NOT enter credentials or personal billing information.",
            "Block the suspicious domain at the perimeter firewall / DNS resolver.",
            "Block the sender email address in security gateway settings.",
            "Initiate automated mailbox search and purge for similar incoming emails across the organization.",
            "Notify potentially targeted employees and enforce password reset if credentials were compromised.",
            "Export IOCs and update Threat Intelligence feeds (SIEM / EDR / SOAR)."
        ]
    elif severity == "MEDIUM":
        recommendations = [
            "Exercise caution with links or attachments in this email.",
            "Verify the authenticity of the sender via an independent communication channel.",
            "Do not provide sensitive passwords or financial credentials.",
            "Flag email for Tier-2 SOC Analyst manual review."
        ]
    else:
        recommendations = [
            "No immediate threat detected. Email appears safe.",
            "Standard security hygiene applies: always check sender address before opening attachments."
        ]

    return {
        "risk_score": final_score,
        "severity": severity,
        "verdict": verdict,
        "confidence": confidence,
        "detected_brand": detected_brand,
        "indicators": all_indicators,
        "score_breakdown": breakdown,
        "recommendation": recommendations
    }
