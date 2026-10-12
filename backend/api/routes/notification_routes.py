from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime, timezone

from backend.services.db import get_db
from backend.models.student import CounselingNoticeModel, CounselingNoticeCreate, CounselingNoticeResponse, UserModel
from backend.api.dependencies import get_current_user

router = APIRouter(prefix="/notifications", tags=["Inter-Role Counseling & Notifications"])

@router.get("/notices/{student_id}", response_model=List[CounselingNoticeResponse])
def get_student_notices(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    notices = db.query(CounselingNoticeModel).filter(CounselingNoticeModel.student_id == student_id).order_by(CounselingNoticeModel.timestamp.desc()).all()
    return notices

@router.get("/notices", response_model=List[CounselingNoticeResponse])
def get_all_notices(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    notices = db.query(CounselingNoticeModel).order_by(CounselingNoticeModel.timestamp.desc()).all()
    return notices

@router.post("/notices", response_model=CounselingNoticeResponse, status_code=status.HTTP_201_CREATED)
def create_counseling_notice(
    notice_in: CounselingNoticeCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    notice_id = f"notice_{uuid.uuid4().hex[:10]}"
    notice = CounselingNoticeModel(
        id=notice_id,
        student_id=notice_in.student_id,
        student_name=notice_in.student_name,
        faculty_username=current_user.username,
        notice_type=notice_in.notice_type,
        message=notice_in.message,
        timestamp=datetime.now(timezone.utc),
        status="DISPATCHED"
    )
    db.add(notice)
    db.commit()
    db.refresh(notice)
    return notice
