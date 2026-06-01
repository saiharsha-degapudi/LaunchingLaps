from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from auth import get_current_user
import models
import schemas

router = APIRouter(prefix="/community", tags=["community"])


# ── Posts ─────────────────────────────────────────────────────────────────────

@router.get("/posts", response_model=List[schemas.CommunityPostListOut])
def list_posts(
    skip: int = 0,
    limit: int = 50,
    category: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.CommunityPost).order_by(models.CommunityPost.created_at.desc())
    if category:
        query = query.filter(models.CommunityPost.category == category)
    return query.offset(skip).limit(limit).all()


@router.post("/posts", response_model=schemas.CommunityPostOut, status_code=status.HTTP_201_CREATED)
def create_post(
    post_in: schemas.CommunityPostCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    post = models.CommunityPost(**post_in.model_dump(), author_id=current_user.id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get("/posts/{post_id}", response_model=schemas.CommunityPostOut)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.CommunityPost).filter(models.CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/posts/{post_id}/upvote")
def upvote_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    post = db.query(models.CommunityPost).filter(models.CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.upvotes += 1
    db.commit()
    return {"upvotes": post.upvotes}


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    post = db.query(models.CommunityPost).filter(models.CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your post")
    db.delete(post)
    db.commit()


# ── Replies ───────────────────────────────────────────────────────────────────

@router.post("/posts/{post_id}/replies", response_model=schemas.CommunityReplyOut, status_code=status.HTTP_201_CREATED)
def add_reply(
    post_id: int,
    reply_in: schemas.CommunityReplyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    post = db.query(models.CommunityPost).filter(models.CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    reply = models.CommunityReply(
        post_id=post_id,
        author_id=current_user.id,
        body=reply_in.body,
    )
    db.add(reply)
    db.commit()
    db.refresh(reply)
    return reply


# ── Messages ──────────────────────────────────────────────────────────────────

@router.get("/messages", response_model=List[schemas.MessageOut])
def get_messages(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Message)
        .filter(
            (models.Message.sender_id == current_user.id)
            | (models.Message.receiver_id == current_user.id)
        )
        .order_by(models.Message.created_at.desc())
        .all()
    )


@router.post("/messages", response_model=schemas.MessageOut, status_code=status.HTTP_201_CREATED)
def send_message(
    msg_in: schemas.MessageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    receiver = db.query(models.User).filter(models.User.id == msg_in.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    message = models.Message(
        sender_id=current_user.id,
        receiver_id=msg_in.receiver_id,
        body=msg_in.body,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.put("/messages/{message_id}/read")
def mark_read(
    message_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    message = db.query(models.Message).filter(models.Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    if message.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your message")
    message.is_read = True
    db.commit()
    return {"status": "read"}
