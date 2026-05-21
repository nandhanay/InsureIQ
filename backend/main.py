from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.config import settings
from core.database import engine, Base, SessionLocal
from routers import auth
from routers import profile as profile_router
from routers import plans as plans_router
from routers import recommendations as reco_router
from routers import documents as docs_router
from routers import forecast as forecast_router
from routers import compare as compare_router
from routers import watchlist as watchlist_router

# Import all models so Base.metadata knows about them
import models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables if they do not exist
    Base.metadata.create_all(bind=engine)

    # Migrate columns if they don't exist
    db = SessionLocal()
    try:
        from sqlalchemy import text
        # Add columns if missing, transfer values from old columns, and set defaults
        db.execute(text("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS full_name VARCHAR(100);"))
        
        db.execute(text("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS smoking_status BOOLEAN;"))
        db.execute(text("UPDATE user_profiles SET smoking_status = smoking WHERE smoking_status IS NULL;"))
        db.execute(text("ALTER TABLE user_profiles ALTER COLUMN smoking_status SET DEFAULT FALSE;"))
        db.execute(text("UPDATE user_profiles SET smoking_status = FALSE WHERE smoking_status IS NULL;"))
        db.execute(text("ALTER TABLE user_profiles ALTER COLUMN smoking_status SET NOT NULL;"))

        db.execute(text("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS alcohol_consumption BOOLEAN;"))
        db.execute(text("UPDATE user_profiles SET alcohol_consumption = alcohol WHERE alcohol_consumption IS NULL;"))
        db.execute(text("ALTER TABLE user_profiles ALTER COLUMN alcohol_consumption SET DEFAULT FALSE;"))
        db.execute(text("UPDATE user_profiles SET alcohol_consumption = FALSE WHERE alcohol_consumption IS NULL;"))
        db.execute(text("ALTER TABLE user_profiles ALTER COLUMN alcohol_consumption SET NOT NULL;"))
        
        db.commit()
        print("✅ Database schema migrated for profile system")
    except Exception as e:
        print(f"⚠️ Migration error: {e}")
        db.rollback()
    finally:
        db.close()

    # Seed plans data
    db = SessionLocal()
    try:
        from db.seed import seed_plans, seed_judge_user
        seed_plans(db)
        seed_judge_user(db)
    except Exception as e:
        print(f"Seed error: {e}")
    finally:
        db.close()

    yield
    # Shutdown logic if needed
    pass

app = FastAPI(
    title="InsureIQ API",
    description="AI-Powered Insurance Intelligence Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# Expand allowed origins to avoid CORS issues on all standard Vite port choices
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth ──
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])

# ── Profile & Intake ──
app.include_router(profile_router.router, prefix="/api/profile", tags=["profile"])

# ── Plans ──
app.include_router(plans_router.router, prefix="/api/plans", tags=["plans"])

# ── Recommendations ──
app.include_router(reco_router.router, prefix="/api/recommendations", tags=["recommendations"])

# ── Documents ──
app.include_router(docs_router.router, prefix="/api/documents", tags=["documents"])

# ── Forecast ──
app.include_router(forecast_router.router, prefix="/api/forecast", tags=["forecast"])

# ── Compare ──
app.include_router(compare_router.router, prefix="/api/compare", tags=["compare"])

# ── Watchlist ──
app.include_router(watchlist_router.router, prefix="/api/watchlist", tags=["watchlist"])


@app.get("/")
async def root():
    return {"message": "InsureIQ API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}