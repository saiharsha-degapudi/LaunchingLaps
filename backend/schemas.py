from pydantic import BaseModel, ConfigDict, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    entrepreneur = "entrepreneur"
    investor = "investor"
    audit = "audit"


class PitchStage(str, Enum):
    idea = "idea"
    seed = "seed"
    growth = "growth"


# ── Auth ────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: UserRole
    bio: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class GoogleAuthRequest(BaseModel):
    credential: str  # Google ID token
    role: Optional[str] = "entrepreneur"  # used only when creating a new account


# ── Pitches ─────────────────────────────────────────────────────────────────

class PitchCreate(BaseModel):
    title: str
    description: str
    industry: str
    funding_goal: float = Field(gt=0)
    stage: PitchStage = PitchStage.idea
    deck_url: Optional[str] = None
    video_url: Optional[str] = None


class PitchUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None
    funding_goal: Optional[float] = None
    stage: Optional[PitchStage] = None
    deck_url: Optional[str] = None
    video_url: Optional[str] = None
    is_active: Optional[bool] = None


class PitchAuditUpdate(BaseModel):
    audit_status: str  # open | proceed | rejected
    audit_note: Optional[str] = None


class PitchOut(BaseModel):
    id: int
    title: str
    description: str
    industry: str
    funding_goal: float
    stage: PitchStage
    deck_url: Optional[str] = None
    video_url: Optional[str] = None
    is_active: bool
    audit_status: str = "open"
    owner_id: int
    owner: UserOut
    created_at: datetime

    class Config:
        from_attributes = True


# ── Investor Profiles ────────────────────────────────────────────────────────

class InvestorProfileCreate(BaseModel):
    firm_name: Optional[str] = None
    industry_focus: str
    investment_min: float = 25000.0
    investment_max: float = 500000.0
    preferred_stages: str = "idea,seed"
    location: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None


class InvestorProfileUpdate(BaseModel):
    firm_name: Optional[str] = None
    industry_focus: Optional[str] = None
    investment_min: Optional[float] = None
    investment_max: Optional[float] = None
    preferred_stages: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None


class InvestorProfileOut(BaseModel):
    id: int
    user_id: int
    firm_name: Optional[str] = None
    industry_focus: str
    investment_min: float
    investment_max: float
    preferred_stages: str
    location: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None
    user: UserOut

    class Config:
        from_attributes = True


class InvestorInterestCreate(BaseModel):
    pitch_id: int
    note: Optional[str] = None


class InvestorInterestOut(BaseModel):
    id: int
    investor_profile_id: int
    pitch_id: int
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Education ────────────────────────────────────────────────────────────────

class LessonCreate(BaseModel):
    title: str
    content: str
    video_url: Optional[str] = None
    order_index: int = 0
    duration_minutes: int = 10


class LessonOut(BaseModel):
    id: int
    course_id: int
    title: str
    content: str
    video_url: Optional[str] = None
    order_index: int
    duration_minutes: int

    class Config:
        from_attributes = True


class CourseCreate(BaseModel):
    title: str
    description: str
    thumbnail_url: Optional[str] = None
    instructor_name: str
    duration_hours: float = 1.0
    level: str = "Beginner"


class CourseOut(BaseModel):
    id: int
    title: str
    description: str
    thumbnail_url: Optional[str] = None
    instructor_name: str
    duration_hours: float
    level: str
    is_published: bool
    lessons: List[LessonOut] = []
    created_at: datetime

    class Config:
        from_attributes = True


class CourseListOut(BaseModel):
    id: int
    title: str
    description: str
    thumbnail_url: Optional[str] = None
    instructor_name: str
    duration_hours: float
    level: str
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ── Community ────────────────────────────────────────────────────────────────

class CommunityReplyCreate(BaseModel):
    body: str


class CommunityReplyOut(BaseModel):
    id: int
    post_id: int
    author_id: int
    body: str
    created_at: datetime
    author: UserOut

    class Config:
        from_attributes = True


class CommunityPostCreate(BaseModel):
    title: str
    body: str
    category: str = "General"


class CommunityPostOut(BaseModel):
    id: int
    author_id: int
    title: str
    body: str
    category: str
    upvotes: int
    created_at: datetime
    author: UserOut
    replies: List[CommunityReplyOut] = []

    class Config:
        from_attributes = True


class CommunityPostListOut(BaseModel):
    id: int
    author_id: int
    title: str
    body: str
    category: str
    upvotes: int
    created_at: datetime
    author: UserOut

    class Config:
        from_attributes = True


# ── Messages ─────────────────────────────────────────────────────────────────

class MessageCreate(BaseModel):
    receiver_id: int
    body: str


class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    body: str
    is_read: bool
    created_at: datetime
    sender: UserOut
    receiver: UserOut

    class Config:
        from_attributes = True


# ── SPV ──────────────────────────────────────────────────────────────────────

class SPVCreate(BaseModel):
    pitch_id: int
    title: str
    description: Optional[str] = None
    target_amount: float
    carry_pct: float = 20.0
    mgmt_fee_pct: float = 2.0
    min_check: float = 5000.0
    deadline: Optional[datetime] = None


class SPVCommitRequest(BaseModel):
    amount: float


class SPVCommitmentOut(BaseModel):
    id: int
    investor_id: int
    investor_name: str
    amount: float
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class SPVOut(BaseModel):
    id: int
    pitch_id: int
    lead_investor_id: int
    lead_investor_name: str
    lead_investor_firm: Optional[str]
    title: str
    description: Optional[str]
    target_amount: float
    committed_amount: float
    carry_pct: float
    mgmt_fee_pct: float
    min_check: float
    deadline: Optional[datetime]
    status: str
    created_at: datetime
    pct_funded: float
    backer_count: int
    pitch_title: str
    pitch_industry: str
    pitch_stage: str
    model_config = ConfigDict(from_attributes=True)
