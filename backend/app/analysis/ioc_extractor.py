import re
import hashlib
from app.analysis.url_analyzer import extract_urls

EMAIL_REGEX = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
IPV4_REGEX = r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
DOMAIN_REGEX = r'\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b'

def extract_iocs(sender: str, recipient: str, subject: str, body: str, url_items: list = [], attachments: list = [], detected_keywords: list = []) -> list:
    iocs = []
    seen = set()

    def add_ioc(ioc_type: str, value: str, context: str = ""):
        key = f"{ioc_type}:{value.lower()}"
        if key not in seen and value:
            seen.add(key)
            iocs.append({
                "type": ioc_type,
                "value": value.strip(),
                "context": context
            })

    # 1. Emails
    for text_src, ctx in [(sender, "Sender Address"), (recipient, "Recipient Address"), (body, "Email Body")]:
        emails = re.findall(EMAIL_REGEX, text_src or "")
        for email in emails:
            add_ioc("Email", email, ctx)

    # 2. URLs
    body_urls = extract_urls(body)
    for url in body_urls:
        add_ioc("URL", url, "Extracted Body Link")

    for url_obj in url_items:
        raw_u = url_obj.get("url") if isinstance(url_obj, dict) else url_obj
        if raw_u:
            add_ioc("URL", raw_u, "Analyzed URL Payload")

    # 3. Domains
    # From sender
    if "@" in sender:
        s_dom = sender.split("@")[-1].strip("> ")
        add_ioc("Domain", s_dom, "Sender Domain")

    # From extracted URLs
    for url in body_urls:
        clean_u = url if url.startswith("http") else f"http://{url}"
        m = re.search(r'https?://([^/]+)', clean_u)
        if m:
            host = m.group(1).split(":")[0]
            add_ioc("Domain", host, "Link Target Domain")

    # 4. IP Addresses
    ip_matches = re.findall(IPV4_REGEX, body)
    for ip in ip_matches:
        # Ignore localhost/internal 127.0.0.1 if unwanted, but retain all in SOC context
        add_ioc("IP Address", ip, "Embedded IPv4 Payload")

    # 5. Suspicious Keywords
    for kw in detected_keywords:
        add_ioc("Suspicious Keyword", kw, "NLP Threat Flag")

    # 6. File Hashes & Attachments
    for att in attachments:
        fname = att.get("filename") if isinstance(att, dict) else str(att)
        if fname:
            # Generate deterministic SHA256 simulation hash for file name in SOC report
            fake_hash = hashlib.sha256(fname.encode('utf-8')).hexdigest()
            add_ioc("File Attachment", fname, f"SHA-256: {fake_hash[:16]}...")

    return iocs
