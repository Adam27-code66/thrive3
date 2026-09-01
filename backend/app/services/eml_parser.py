import email
from email import policy
from email.parser import BytesParser, Parser

def parse_email_file(file_content: bytes, filename: str = "") -> dict:
    text_content = ""
    try:
        text_content = file_content.decode('utf-8')
    except UnicodeDecodeError:
        try:
            text_content = file_content.decode('latin-1')
        except Exception:
            text_content = str(file_content)

    filename_lower = filename.lower()
    
    # If it's a plain .txt file
    if filename_lower.endswith('.txt'):
        lines = text_content.splitlines()
        sender = "unknown@external.com"
        subject = "Uploaded Text Email Analysis"
        body_lines = []
        
        for line in lines:
            if line.lower().startswith("from:"):
                sender = line[5:].strip()
            elif line.lower().startswith("subject:"):
                subject = line[8:].strip()
            else:
                body_lines.append(line)

        return {
            "sender": sender,
            "recipient": "employee@company.com",
            "subject": subject,
            "body": "\n".join(body_lines) if body_lines else text_content,
            "attachments": []
        }

    # EML / MIME parser using Python standard email module
    try:
        msg = BytesParser(policy=policy.default).parsebytes(file_content)
        sender = msg.get("From", "unknown@external.com")
        recipient = msg.get("To", "employee@company.com")
        subject = msg.get("Subject", "Suspicious Email")
        
        body_parts = []
        attachments = []

        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition"))

                if "attachment" in content_disposition:
                    fname = part.get_filename() or "unnamed_attachment"
                    att_bytes = part.get_payload(decode=True) or b""
                    attachments.append({
                        "filename": fname,
                        "file_type": content_type,
                        "size_bytes": len(att_bytes)
                    })
                elif content_type in ["text/plain", "text/html"]:
                    payload = part.get_content()
                    if payload:
                        body_parts.append(str(payload))
        else:
            body_parts.append(msg.get_content() or "")

        final_body = "\n".join(body_parts) if body_parts else text_content

        return {
            "sender": str(sender),
            "recipient": str(recipient),
            "subject": str(subject),
            "body": final_body,
            "attachments": attachments
        }
    except Exception:
        # Fallback if standard parsing fails
        return {
            "sender": "suspicious@external-domain.com",
            "recipient": "employee@company.com",
            "subject": f"Parsed File: {filename}",
            "body": text_content,
            "attachments": []
        }
