# InsureIQ — AI-Powered Insurance Decision-Support Platform

InsureIQ is a state-of-the-art AI-powered decision-support platform designed to help users evaluate, simulate, and select the optimal health insurance plans tailored to their demographic, financial, and clinical profiles. Built on a premium glassmorphic visual language, the application provides deep insights into underwriting, rejection risks, and future premium projections using custom Machine Learning models.

---

## 🚀 Key Features

1. **AI Intake Wizard**: Smart multi-step intake form with medical report OCR analysis powered by Gemini (with reliable mock fallbacks).
2. **Dynamic Risk Dashboard**: Explains health risk assessments, identifying key risk factors using SHAP explanations and visual risk meters.
3. **Plan Explorer**: Filter, search, and view plans from the extensive catalog, allowing instant watchlisting.
4. **Compare Matrix**: Compare health insurance plans side-by-side on room rent, co-pay, claim settlement ratios (CSR), and day-1 covered conditions.
5. **Premium Projections & What-If Simulator**: Interactive compound escalation projections over a 5-year outlook and a dynamic simulator adjusting premiums based on new medical conditions, coverage enhancements, and income brackets.
6. **JWT Token Rotation & Session Revocation**: Hardened authentication system powered by FastAPI, PostgreSQL, and Redis cache token revocation.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, React Query (`@tanstack/react-query`), Zustand, Chart.js, TailwindCSS (v3)
- **Backend**: FastAPI (Python), SQLAlchemy ORM, Pydantic (v2) input validation
- **Databases**: PostgreSQL (Relational Store), Redis (Cache & Session Store)
- **ML Systems**: Scikit-Learn (Gradient Boosting Classifier & Regressor), SHAP explanations, Gemini AI API document extraction

---

## 🔑 Judge Demo Credentials

To access the platform instantly:

- **Email**: `judge@insureiq.ai`
- **Password**: `InsurIQ2026!`

Alternatively, you can register a new account on the registration page to walk through the intake process.

---

## 📦 Getting Started & Setup

### Prerequisites

- **Node.js** (v18+)
- **Python** (v3.11+)
- **Docker & Docker Compose**

### Running the Complete Stack with Docker

We provide a Docker Compose configuration that orchestrates PostgreSQL, Redis, and the FastAPI backend.

1. **Start Backend & Database Services**:
   ```bash
   docker-compose up -d
   ```
   This will spin up:
   - PostgreSQL (port `5432`)
   - Redis (port `6379`)
   - FastAPI Backend (port `5000`)

2. **Verify Backend Status**:
   - Swagger Documentation: [http://localhost:5000/docs](http://localhost:5000/docs)
   - Health check endpoint: [http://localhost:5000/health](http://localhost:5000/health)

3. **Install Frontend & Start Vite Dev Server**:
   ```bash
   npm install
   npm run dev
   ```
   Open your browser to [http://localhost:5173](http://localhost:5173).

---

## 📁 File Structure & System Layout

```
InsureIQ/
├── backend/
│   ├── core/              # Database, Redis client, Config, Security utilities
│   ├── middleware/        # JWT Authentication interceptor
│   ├── models/            # SQLAlchemy Database Models (User, Profile, Plan, Watchlist)
│   ├── ml/                # Offline ML training scripts (Gradient Boosting & serializations)
│   ├── routers/           # FastAPI routers (Auth, Profile, Plans, Recommendations, Forecast, Watchlist)
│   ├── schemas/           # Pydantic validation schemas
│   ├── services/          # Business logic, Gemini OCR extraction, SHAP factor computation
│   └── main.py            # FastAPI App root entry
├── src/
│   ├── components/        # Glassmorphic UI library, layout shells, and helper widgets
│   ├── hooks/             # Query & mutation hooks wrapping axios services
│   ├── pages/             # App pages (Dashboard, Explorer, Intake, Compare, Forecast, Watchlist)
│   ├── stores/            # Zustand client state stores (recoStore, watchlistStore, profileStore)
│   ├── services/          # API Axios configuration and routes
│   └── main.tsx           # React entrypoint
```

---

## 🔒 Security Hardening

- **Sanitization & Input Validation**: Strict Pydantic schemas enforce type safety, bounds checks (e.g. valid age ranges, BMI constraints), and automatic string whitespace stripping.
- **JWT Token Security**: High-security token setup with access token expiry (30 mins) and automated refresh token rotation via Axios interceptors.
- **Session Revocation**: Redis blacklisting immediately invalidates refresh tokens on logout, preventing session hijacking.
