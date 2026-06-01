from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from auth import get_current_user
import models
import schemas

router = APIRouter(prefix="/education", tags=["education"])


# ── Courses ──────────────────────────────────────────────────────────────────

@router.get("/courses", response_model=List[schemas.CourseListOut])
def list_courses(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return (
        db.query(models.Course)
        .filter(models.Course.is_published == True)
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/courses/{course_id}", response_model=schemas.CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("/courses", response_model=schemas.CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    course_in: schemas.CourseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    course = models.Course(**course_in.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


# ── Lessons ──────────────────────────────────────────────────────────────────

@router.get("/courses/{course_id}/lessons", response_model=List[schemas.LessonOut])
def list_lessons(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return (
        db.query(models.Lesson)
        .filter(models.Lesson.course_id == course_id)
        .order_by(models.Lesson.order_index)
        .all()
    )


@router.get("/lessons/{lesson_id}", response_model=schemas.LessonOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(models.Lesson).filter(models.Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


@router.post("/courses/{course_id}/lessons", response_model=schemas.LessonOut, status_code=status.HTTP_201_CREATED)
def create_lesson(
    course_id: int,
    lesson_in: schemas.LessonCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    lesson = models.Lesson(**lesson_in.model_dump(), course_id=course_id)
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson
