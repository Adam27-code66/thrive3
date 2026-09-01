DANGEROUS_EXTENSIONS = [
    "exe", "scr", "bat", "cmd", "vbs", "vbe", "js", "jse", 
    "wsf", "wsh", "ps1", "ps2", "iso", "img", "com", "pif", "hta"
]

MACRO_EXTENSIONS = ["docm", "xlsm", "pptm", "dotm", "xltm"]

ARCHIVE_EXTENSIONS = ["zip", "rar", "7z", "tar", "gz", "bz2"]

def analyze_attachments(attachments: list) -> dict:
    if not attachments:
        return {
            "total_attachments": 0,
            "attachments": [],
            "has_high_risk_attachment": False,
            "risk_level": "SAFE",
            "indicators": []
        }

    analyzed_list = []
    indicators = []
    has_high_risk = False
    max_risk = "SAFE"

    for att in attachments:
        filename = att.get("filename", "").strip()
        parts = filename.split(".")
        
        has_double_ext = False
        is_executable = False
        has_macros = False
        risk = "SAFE"

        if len(parts) > 2:
            # e.g., invoice.pdf.exe
            second_last = parts[-2].lower()
            last = parts[-1].lower()
            if last in DANGEROUS_EXTENSIONS or second_last in ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "png", "txt"]:
                has_double_ext = True

        ext = parts[-1].lower() if len(parts) > 1 else ""

        if ext in DANGEROUS_EXTENSIONS:
            is_executable = True
            risk = "CRITICAL"
            has_high_risk = True
        elif ext in MACRO_EXTENSIONS:
            has_macros = True
            risk = "HIGH"
            has_high_risk = True
        elif has_double_ext:
            risk = "CRITICAL"
            has_high_risk = True
        elif ext in ARCHIVE_EXTENSIONS:
            risk = "MEDIUM"

        item_indicators = []
        if has_double_ext:
            item_indicators.append(f"Double extension attack detected on attachment '{filename}'.")
            indicators.append(f"Double extension mask detected: '{filename}'.")
        if is_executable:
            item_indicators.append(f"Executable payload format (.{ext}) attached.")
            indicators.append(f"Dangerous executable attachment detected: '{filename}'.")
        if has_macros:
            item_indicators.append(f"Macro-enabled document format (.{ext}) attached.")
            indicators.append(f"Macro-enabled document attachment detected: '{filename}'.")

        if risk == "CRITICAL":
            max_risk = "CRITICAL"
        elif risk == "HIGH" and max_risk != "CRITICAL":
            max_risk = "HIGH"
        elif risk == "MEDIUM" and max_risk not in ["CRITICAL", "HIGH"]:
            max_risk = "MEDIUM"

        analyzed_list.append({
            "filename": filename,
            "file_type": att.get("file_type", ext),
            "size_bytes": att.get("size_bytes", 0),
            "is_executable": is_executable,
            "has_double_extension": has_double_ext,
            "has_macros": has_macros,
            "risk_level": risk,
            "indicators": item_indicators
        })

    return {
        "total_attachments": len(analyzed_list),
        "attachments": analyzed_list,
        "has_high_risk_attachment": has_high_risk,
        "risk_level": max_risk,
        "indicators": indicators
    }
