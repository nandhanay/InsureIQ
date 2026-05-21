from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.config import settings
from core.database import engine, Base
from routers import auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables if they do not exist
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown logic if needed
    pass

app = FastAPI(
    title="InsureIQ API",
    description="Insurance Intelligence Platform API",
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

# Include auth router
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])

@app.get("/")
async def root():
    return {"message": "InsureIQ API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}