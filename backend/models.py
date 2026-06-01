from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean,
    ForeignKey, DateTime, Enum as SAEnum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from database import Base


class UserRole(str, enum.Enum):
    entrepreneur = "entrepreneur"
    investor = "investor"


class PitchStage(str, enum.Enum):
    idea = "idea"
    seed = "seed"
    growth = "growth"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SAEnum(UserRole), nullable=False)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)

    pitches = relationship("Pitch", back_populates="owner")
    investor_profile = relationship("InvestorProfile", back_populates="user", uselist=False)
    community_posts = relationship("CommunityPost", back_populates="author")
    sent_messages = relationship("Message", foreign_keys="Message.sender_id", back_populates="sender")
    received_messages = relationship("Message", foreign_keys="Message.receiver_id", back_populates="receiver")
    led_spvs = relationship("SPV", foreign_keys="SPV.lead_investor_id", back_populates="lead_investor")
    spv_commitments = relationship("SPVCommitment", back_populates="investor")


class Pitch(Base):
    __tablename__ = "pitches"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    industry = Column(String, nullable=False)
    funding_goal = Column(Float, nullable=False)
    stage = Column(SAEnum(PitchStage), nullable=False, default=PitchStage.idea)
    deck_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="pitches")
    interests = relationship("InvestorInterest", back_populates="pitch")


class InvestorProfile(Base):
    __tablename__ = "investor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    firm_name = Column(String, nullable=True)
    industry_focus = Column(String, nullable=False)       # comma-separated or JSON string
    investment_min = Column(Float, nullable=False, default=25000.0)
    investment_max = Column(Float, nullable=False, default=500000.0)
    preferred_stages = Column(String, nullable=False, default="idea,seed")
    location = Column(String, nullable=True)
    website = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="investor_profile")
    interests = relationship("InvestorInterest", back_populates="investor_profile")


class InvestorInterest(Base):
    __tablename__ = "investor_interests"

    id = Column(Integer, primary_key=True, index=True)
    investor_profile_id = Column(Integer, ForeignKey("investor_profiles.id"), nullable=False)
    pitch_id = Column(Integer, ForeignKey("pitches.id"), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    investor_profile = relationship("InvestorProfile", back_populates="interests")
    pitch = relationship("Pitch", back_populates="interests")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    instructor_name = Column(String, nullable=False)
    duration_hours = Column(Float, nullable=False, default=1.0)
    level = Column(String, nullable=False, default="Beginner")
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lessons = relationship("Lesson", back_populates="course", order_by="Lesson.order_index")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    video_url = Column(String, nullable=True)
    order_index = Column(Integer, nullable=False, default=0)
    duration_minutes = Column(Integer, nullable=False, default=10)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    course = relationship("Course", back_populates="lessons")


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    body = Column(Text, nullable=False)
    category = Column(String, nullable=False, default="General")
    upvotes = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    author = relationship("User", back_populates="community_posts")
    replies = relationship("CommunityReply", back_populates="post")


class CommunityReply(Base):
    __tablename__ = "community_replies"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    body = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    post = relationship("CommunityPost", back_populates="replies")
    author = relationship("User")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    body = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")


class SPVStatus(str, enum.Enum):
    forming = "forming"
    active = "active"
    closed = "closed"


class SPV(Base):
    __tablename__ = "spvs"

    id               = Column(Integer, primary_key=True, index=True)
    pitch_id         = Column(Integer, ForeignKey("pitches.id"), nullable=False)
    lead_investor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title            = Column(String, nullable=False)
    description      = Column(Text, nullable=True)
    target_amount    = Column(Float, nullable=False)
    committed_amount = Column(Float, nullable=False, default=0.0)
    carry_pct        = Column(Float, nullable=False, default=20.0)
    mgmt_fee_pct     = Column(Float, nullable=False, default=2.0)
    min_check        = Column(Float, nullable=False, default=5000.0)
    deadline         = Column(DateTime(timezone=True), nullable=True)
    status           = Column(SAEnum(SPVStatus), default=SPVStatus.forming)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    pitch         = relationship("Pitch")
    lead_investor = relationship("User", foreign_keys=[lead_investor_id])
    commitments   = relationship("SPVCommitment", back_populates="spv")


class SPVCommitment(Base):
    __tablename__ = "spv_commitments"

    id          = Column(Integer, primary_key=True, index=True)
    spv_id      = Column(Integer, ForeignKey("spvs.id"), nullable=False)
    investor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount      = Column(Float, nullable=False)
    status      = Column(String, nullable=False, default="committed")
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    spv      = relationship("SPV", back_populates="commitments")
    investor = relationship("User")
