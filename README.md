# InsureIQ

AI-powered health insurance decision-support platform that helps users compare and evaluate insurance plans based on their medical profile, financial constraints, and coverage needs.

---

## Features

* AI-assisted medical report extraction using Gemini API
* Personalized insurance recommendations
* Risk analysis dashboard with explainable factors
* Plan comparison matrix
* 5-year premium forecasting & What-If simulator
* Secure JWT authentication with Redis session management

---

## Tech Stack

**Frontend:** React, TypeScript, Vite, TailwindCSS
**Backend:** FastAPI, SQLAlchemy, Pydantic
**Database:** PostgreSQL, Redis
**AI/ML:** Gemini API, Scikit-Learn

---

## Demo Credentials

Email:

```bash id="clyd4e"
judge@insureiq.ai
```

Password:

```bash id="ejok6e"
InsurIQ2026!
```

---

## Run Locally

### Start Backend

```bash id="x81pk7"
docker-compose up -d
```

Backend:

```bash id="yyg0ls"
http://localhost:5000
```

Swagger Docs:

```bash id="jlwmx6"
http://localhost:5000/docs
```

---

### Start Frontend

```bash id="jlwmx7"
npm install
npm run dev
```

Frontend:

```bash id="jlwmx8"
http://localhost:5173
```

---

## Project Structure

```bash id="jlwmx9"
backend/
src/
docker-compose.yml
```
