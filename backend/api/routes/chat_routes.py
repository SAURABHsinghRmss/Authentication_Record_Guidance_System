from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime, timezone

from backend.services.db import get_db
from backend.models.student import MentorChatModel, ChatMessageCreate, ChatMessageResponse, UserModel
from backend.api.dependencies import get_current_user

router = APIRouter(prefix="/chat", tags=["Mentor-Student Direct Chat"])

@router.get("/messages/{student_id}", response_model=List[ChatMessageResponse])
def get_chat_messages(
    student_id: str,
    mentor_username: str = "faculty",
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    query = db.query(MentorChatModel).filter(MentorChatModel.student_id == student_id)
    if mentor_username:
        query = query.filter(MentorChatModel.mentor_username == mentor_username)
    messages = query.order_by(MentorChatModel.timestamp.asc()).all()
    return messages

@router.post("/messages", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
def send_chat_message(
    msg_in: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    msg_id = f"msg_{uuid.uuid4().hex[:10]}"
    chat_msg = MentorChatModel(
        id=msg_id,
        student_id=msg_in.student_id,
        mentor_username=msg_in.mentor_username,
        sender_role=msg_in.sender_role,
        sender_name=msg_in.sender_name,
        message=msg_in.message,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(chat_msg)
    db.commit()
    db.refresh(chat_msg)
    return chat_msg
