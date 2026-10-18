from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime, timezone

from backend.services.db import get_db
from backend.models.student import (
    CommunityGroupModel, CommunityMessageModel,
    CommunityGroupCreate, CommunityGroupResponse,
    CommunityMessageCreate, CommunityMessageResponse, UserModel
)
from backend.api.dependencies import get_current_user

router = APIRouter(prefix="/community", tags=["Community, Club & Group Chat"])

@router.get("/groups", response_model=List[CommunityGroupResponse])
def list_community_groups(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    # Seed default groups if empty
    if db.query(CommunityGroupModel).count() == 0:
        defaults = [
            CommunityGroupModel(
                id="grp_ai_club",
                name="AI & Machine Learning Coding Club",
                category="CLUB",
                role_access="all",
                description="Official campus club for AI research, LLM fine-tuning, and hackathons.",
                created_by="msrch"
            ),
            CommunityGroupModel(
                id="grp_placement",
                name="Placement & Career Prep Hub",
                category="STUDY_GROUP",
                role_access="all",
                description="DSA practice, mock interviews, and resume reviews for upcoming placement drives.",
                created_by="msrch"
            ),
            CommunityGroupModel(
                id="grp_faculty_board",
                name="Faculty Research & Mentorship Council",
                category="FACULTY_BOARD",
                role_access="faculty",
                description="Private faculty workspace for academic planning, grading rubrics, and student mentorship.",
                created_by="admin"
            ),
            CommunityGroupModel(
                id="grp_admin_sec",
                name="Campus Security & Threat Intelligence Taskforce",
                category="FACULTY_BOARD",
                role_access="admin",
                description="Admin command channel for auditing platform security, zero-trust scans, and tenant approvals.",
                created_by="msrch"
            )
        ]
        for g in defaults:
            db.add(g)
        db.commit()

    # Filter groups by user role access
    role = current_user.role
    if role == "admin":
        groups = db.query(CommunityGroupModel).all()
    elif role == "faculty":
        groups = db.query(CommunityGroupModel).filter(CommunityGroupModel.role_access.in_(["all", "faculty", "student"])).all()
    else:
        groups = db.query(CommunityGroupModel).filter(CommunityGroupModel.role_access.in_(["all", "student"])).all()
    return groups

@router.post("/groups", response_model=CommunityGroupResponse, status_code=status.HTTP_201_CREATED)
def create_community_group(
    group_in: CommunityGroupCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    group_id = f"grp_{uuid.uuid4().hex[:8]}"
    group = CommunityGroupModel(
        id=group_id,
        name=group_in.name,
        category=group_in.category,
        role_access=group_in.role_access,
        description=group_in.description,
        created_by=current_user.username,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(group)
    db.commit()
    db.refresh(group)
    return group

@router.get("/groups/{group_id}/messages", response_model=List[CommunityMessageResponse])
def get_community_messages(
    group_id: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    messages = db.query(CommunityMessageModel).filter(CommunityMessageModel.group_id == group_id).order_by(CommunityMessageModel.timestamp.asc()).all()
    return messages

@router.post("/groups/{group_id}/messages", response_model=CommunityMessageResponse, status_code=status.HTTP_201_CREATED)
def send_community_message(
    group_id: str,
    msg_in: CommunityMessageCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    msg_id = f"cmsg_{uuid.uuid4().hex[:10]}"
    msg = CommunityMessageModel(
        id=msg_id,
        group_id=group_id,
        sender_username=current_user.username,
        sender_name=current_user.full_name or current_user.username,
        sender_role=current_user.role,
        message=msg_in.message,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(msg)

    # Cross-sync to UnifiedChatMessageModel under PRIVATE category
    try:
        from backend.models.student import UnifiedChatMessageModel
        unified_msg = UnifiedChatMessageModel(
            id=f"cmsg_priv_{uuid.uuid4().hex[:10]}",
            category="PRIVATE",
            channel_id=group_id,
            sender_username=current_user.username,
            sender_name=current_user.full_name or current_user.username,
            sender_role=current_user.role,
            recipient_username=None,
            message=msg_in.message,
            timestamp=datetime.now(timezone.utc),
            is_read=True
        )
        db.add(unified_msg)
    except Exception:
        pass

    db.commit()
    db.refresh(msg)

    # In-club Meta AI Assistant trigger
    try:
        from backend.services.edumentor_ai_service import EduMentorAIService
        ai_resp = EduMentorAIService.process_and_reply(
            db=db,
            current_user=current_user,
            raw_message=msg_in.message,
            category="PRIVATE",
            channel_id=group_id,
            recipient_username=None
        )
        if ai_resp:
            ai_comm = CommunityMessageModel(
                id=f"cmsg_{uuid.uuid4().hex[:10]}",
                group_id=group_id,
                sender_username=EduMentorAIService.AI_USERNAME,
                sender_name=EduMentorAIService.AI_DISPLAY_NAME,
                sender_role=EduMentorAIService.AI_ROLE,
                message=ai_resp.message,
                timestamp=datetime.now(timezone.utc)
            )
            db.add(ai_comm)
            db.commit()
    except Exception as e:
        print(f"[COMMUNITY AI NOTICE] {e}")

    return msg
