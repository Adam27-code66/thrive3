# PhishLens — Explainable Phishing Investigation & Incident Response Platform

> **"Detect. Explain. Respond."**  
> *"Don't Trust. Verify. Understand Why."*

PhishLens is a modern, production-grade Security Operations Center (SOC) full-stack web application built for cybersecurity threat investigation. It analyzes suspicious emails, computes explainable risk scores (0–100), extracts Indicators of Compromise (IOCs), generates automated incident reports, and visualizes real-time analytics on an interactive SOC dashboard.

---

## Features Overview

- **Explainable Phishing Analysis Engine**: Deterministic rule-based forensic engine written in Python (Zero AI API dependencies).
- **Brand Homoglyph & Typosquat Scan**: Fuzzy matching using Levenshtein distance against high-value target brands (PayPal, Microsoft, Amazon, Google, Apple, Netflix, LinkedIn, etc.).
- **URL & Payload Inspector**: Analyzes link protocols (HTTP/HTTPS), IP address URLs, path harvesting patterns (`/verify`, `/login`), and URL shorteners.
- **NLP Threat Detection**: Urgency scoring engine detecting account suspension threats, financial demands, and psychological pressure phrases.
- **Attachment Forensics**: Flags hazardous double extensions (`invoice.pdf.exe`), executables, and macro-enabled documents.
- **Automated Incident Dossiers**: Generates downloadable PDF reports and JSON exports.
- **Interactive SOC Dashboard**: Real-time Recharts analytics (Threat distribution pie chart, 7-day timeline trends, top suspicious domains, common indicators).
- **Incident Management Ledger**: Filterable, searchable SOC database with incident timelines.

---

## Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Glassmorphism Dark SOC Theme
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Reporting**: jsPDF

### Backend
- **Framework**: Python 3.14 + FastAPI
- **ORM / Database**: SQLAlchemy + MySQL (with out-of-the-box SQLite fallback)
- **Data Validation**: Pydantic v2
- **File Parser**: Python Standard Email / MIME Service

---

## Project Structure

```
d:\Thrive3\
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI Application Entry & Routers
│   │   ├── config.py                # Environment Configuration
│   │   ├── database.py              # SQLAlchemy Engine & Fallback Pool
│   │   ├── models.py                # Database ORM Schema (Incident model)
│   │   ├── schemas.py               # Pydantic Schemas
│   │   ├── seed.py                  # Demo Incident Generator
│   │   ├── analysis/                # Phishing Analysis Engine
│   │   │   ├── brand_similarity.py  # Homoglyph & Fuzzy Matching
│   │   │   ├── sender_analyzer.py   # Sender Verification & Display Mismatches
│   │   │   ├── domain_analyzer.py   # Domain Reputation & TLD Scanning
│   │   │   ├── url_analyzer.py      # Deceptive Link & Protocol Inspector
│   │   │   ├── language_analyzer.py # NLP Threat & Urgency Engine
│   │   │   ├── attachment_analyzer.py# Double Extension & Payload Flags
│   │   │   ├── ioc_extractor.py     # Regex IOC Extractor (Emails, Domains, URLs, IPs, Hashes)
│   │   │   └── risk_engine.py       # Normalized 0-100 Score & Mitigation Generator
│   │   ├── api/                     # REST API Endpoints
│   │   │   ├── analyze.py           # Email text & file analysis routes
│   │   │   ├── incidents.py         # Incident ledger & detail routes
│   │   │   ├── dashboard.py         # SOC analytics endpoints
│   │   │   └── reports.py           # JSON & PDF report generation
│   │   └── services/
│   │       └── eml_parser.py        # EML/MSG/TXT File Parser
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/              # Reusable UI Components
    │   ├── pages/                   # React Router Pages
    │   ├── context/                 # State Provider
    │   └── services/                # Axios Client
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

## Installation & Local Setup

### Prerequisites
- **Node.js**: v18+ (Node v22 installed)
- **Python**: 3.10+ (Python 3.14 installed)
- **MySQL** (Optional — defaults out-of-the-box to SQLite `./phishlens.db`)

---

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend server will start at: `http://localhost:8000`  
Swagger API Documentation available at: `http://localhost:8000/docs`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The frontend application will start at: `http://localhost:5173`

---

## Environment Variables (`backend/.env`)

Create a `.env` file inside `backend/` (or copy `.env.example`):

```env
# MySQL Database Connection (Replace with your credentials)
# DATABASE_URL=mysql+pymysql://username:password@localhost:3306/phishlens

# Default SQLite Out-of-the-Box Fallback
DATABASE_URL=sqlite:///./phishlens.db

SECRET_KEY=phishlens_hackathon_secret_key_2026
ENVIRONMENT=development
```

---

## API Endpoints Summary

| Method | Endpoint | Description |
| text | text | text |
| `POST` | `/api/analyze` | Analyze email JSON payload & generate incident |
| `POST` | `/api/analyze/file` | Upload `.eml`, `.msg`, or `.txt` file for analysis |
| `GET` | `/api/incidents` | Query incidents with search, severity, and verdict filters |
| `GET` | `/api/incidents/{id}` | Fetch complete forensic record for single incident |
| `PATCH` | `/api/incidents/{id}/status` | Update SOC status (`OPEN`, `INVESTIGATING`, `RESOLVED`) |
| `GET` | `/api/dashboard/stats` | Fetch real-time SOC metrics and chart data |
| `GET` | `/api/reports/{id}/json` | Export raw JSON forensic dossier |
| `POST` | `/api/reports/seed/reset` | Re-seed database with realistic demo incidents |

---

## Demo Step-by-Step Workflow

1. Open `http://localhost:5173`.
2. Click **"Analyze an Email"** or navigate to `/analyzer`.
3. Click the quick loader button **"🔴 PayPal Impersonation"** (or click **Load Demo Phishing Email**).
4. Click **"🔍 Analyze Email"**.
5. Observe the multi-stage animated scanner overlay:
   - *Extracting email indicators...*
   - *Analyzing sender...*
   - *Checking domain...*
   - *Scanning URLs...*
   - *Analyzing language...*
   - *Calculating risk...*
6. Review the resulting **Analysis Results Page (`/results`)**:
   - **Risk Score**: `94 / 100` (🔴 `CRITICAL RISK`, Verdict: `LIKELY PHISHING`, Confidence: `96%`).
   - **Indicator Cards**: Breakdown of Sender, Domain, URL, Language, Attachments.
   - **Why is this email suspicious?**: Brand similarity (`paypa1-login.com` ~94% PayPal match), urgency terms ("suspended", "verify", "immediately"), HTTP url `http://paypa1-login.com/verify`.
   - **IOC Section**: Copy individual IOCs or click **"Copy All IOCs"**.
   - **Mitigation Protocol**: Recommended security actions based on severity.
7. Click **"Download PDF Report"** to export the official forensic PDF document.
8. Navigate to **"SOC Dashboard" (`/dashboard`)** and view the newly logged incident in the charts and incident table!
