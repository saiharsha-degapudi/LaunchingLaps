import os
from dotenv import load_dotenv
load_dotenv()  # loads .env file if present — env vars already set take priority

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from database import engine, get_db, Base
import models
import schemas
from auth import (
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_user,
    get_user_by_email,
)
from routers import pitches, investors, education, community, spvs

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LaunchingLaps API",
    description="Platform connecting entrepreneurs with US investors",
    version="1.0.0",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
# Set ALLOWED_ORIGINS in your environment as a comma-separated list, e.g.:
#   ALLOWED_ORIGINS=https://launchinglaps.com,https://www.launchinglaps.com
# Falls back to localhost for local development.
_raw_origins = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:5174,http://localhost:3000",
)
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(pitches.router)
app.include_router(investors.router)
app.include_router(education.router)
app.include_router(community.router)
app.include_router(spvs.router)


# ── Auth Routes ───────────────────────────────────────────────────────────────

@app.post("/auth/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered.",
        )
    hashed = get_password_hash(user_in.password)
    user = models.User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hashed,
        role=user_in.role,
        bio=user_in.bio,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.email})
    return schemas.Token(
        access_token=token,
        token_type="bearer",
        user=schemas.UserOut.model_validate(user),
    )


@app.post("/auth/login", response_model=schemas.Token)
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_in.email, user_in.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_access_token({"sub": user.email})
    return schemas.Token(
        access_token=token,
        token_type="bearer",
        user=schemas.UserOut.model_validate(user),
    )


@app.get("/auth/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.post("/auth/google", response_model=schemas.Token)
def google_auth(payload: schemas.GoogleAuthRequest, db: Session = Depends(get_db)):
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google login is not configured on this server.")
    try:
        info = id_token.verify_oauth2_token(
            payload.credential,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid Google token: {e}")

    email = info.get("email")
    full_name = info.get("name", email.split("@")[0])
    avatar_url = info.get("picture")

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email address.")

    user = get_user_by_email(db, email)
    if not user:
        role = payload.role if payload.role in ("entrepreneur", "investor") else "entrepreneur"
        user = models.User(
            email=email,
            full_name=full_name,
            hashed_password="",  # no password for OAuth users
            role=role,
            avatar_url=avatar_url,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": user.email})
    return schemas.Token(
        access_token=token,
        token_type="bearer",
        user=schemas.UserOut.model_validate(user),
    )


@app.get("/health")
def health():
    return {"status": "ok", "service": "LaunchingLaps API"}
