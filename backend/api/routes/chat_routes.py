from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from backend.services.db import get_db
from backend.models.student import (
    MentorChatModel, ChatMessageCreate, ChatMessageResponse, UserModel,
    UnifiedChatMessageModel, UnifiedChatSendRequest, UnifiedChatMessageResponse,
    ChatCategorySummary
)
from backend.api.dependencies import get_current_user

router = APIRouter(prefix="/chat", tags=["Role-Based Unified Chat (Personal, Private, Global)"])

# -------------------------------------------------------------
# 1. CATEGORY METADATA & OVERVIEW
# -------------------------------------------------------------
@router.get("/categories", response_model=List[ChatCategorySummary])
def get_chat_categories(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """
    Returns available categories:
    - PERSONAL: Direct peer-to-peer, mentor-mentee, or parent-ward messaging
    - PRIVATE: Enclosed group / club / faculty board channels with restricted access
    - GLOBAL: Campus-wide announcements, open forum, and inter-institution public agora
    """
    uname = current_user.username

    # Personal messages count
    personal_q = db.query(UnifiedChatMessageModel).filter(
        UnifiedChatMessageModel.category == "PERSONAL",
        or_(
            UnifiedChatMessageModel.sender_username == uname,
            UnifiedChatMessageModel.recipient_username == uname
        )
    )
    personal_total = personal_q.count()
    personal_unread = personal_q.filter(
        UnifiedChatMessageModel.recipient_username == uname,
        UnifiedChatMessageModel.is_read == False
    ).count()

    # Private messages count
    private_q = db.query(UnifiedChatMessageModel).filter(
        UnifiedChatMessageModel.category == "PRIVATE"
    )
    private_total = private_q.count()

    # Global messages count
    global_q = db.query(UnifiedChatMessageModel).filter(
        UnifiedChatMessageModel.category == "GLOBAL"
    )
    global_total = global_q.count()

    return [
        ChatCategorySummary(
            category="PERSONAL",
            description="Confidential 1-on-1 direct conversations between Students, Faculty Mentors, and Parents.",
            total_messages=personal_total,
            unread_count=personal_unread,
            active_channels=["mentor_consultation", "parent_ward_advisory", "peer_tutoring"]
        ),
        ChatCategorySummary(
            category="PRIVATE",
            description="Restricted-access channels for Study Groups, Research Teams, Clubs, and Faculty Councils.",
            total_messages=private_total,
            unread_count=0,
            active_channels=["study_groups", "clubs_societies", "faculty_council", "threat_intel_taskforce"]
        ),
        ChatCategorySummary(
            category="GLOBAL",
            description="Campus-wide broadcast agora, official institutional notices, and cross-department open discussions.",
            total_messages=global_total,
            unread_count=0,
            active_channels=["campus_global", "academic_bulletin", "hackathon_announcements"]
        ),
    ]

# -------------------------------------------------------------
# 1.1 EDUCATIONAL AI CRITERIA ENDPOINT (Meta AI Style)
# -------------------------------------------------------------
@router.get("/ai/criteria")
def get_educational_ai_criteria():
    """
    Returns the 6 educational criteria supported by EduMentor AI:
    - Institutional Policy & Regulations (RAG grounded)
    - Interactive Concept Tutoring & Pedagogical Explanations
    - Knowledge Assessment & Study Quizzes
    - Lecture & Study Thread Synthesis
    - Academic Integrity & Research Citation Standards
    - Technical Roadmap & Career Advisory
    """
    from backend.services.edumentor_ai_service import EDUCATIONAL_CRITERIA
    return EDUCATIONAL_CRITERIA

# -------------------------------------------------------------
# 2. SEED DEFAULT MESSAGES IF EMPTY
# -------------------------------------------------------------
def _seed_chat_messages_if_needed(db: Session):
    if db.query(UnifiedChatMessageModel).count() == 0:
        now = datetime.now(timezone.utc)
        seeds = [
            # GLOBAL Category Messages
            UnifiedChatMessageModel(
                id="cmsg_glob_1",
                category="GLOBAL",
                channel_id="campus_global",
                sender_username="msrch",
                sender_name="System Administrator (msrch)",
                sender_role="admin",
                recipient_username=None,
                message="Welcome to EduIdentityAI Campus Global Agora! All students, mentors, and partner institutions can communicate here.",
                timestamp=now,
                is_read=True
            ),
            UnifiedChatMessageModel(
                id="cmsg_glob_2",
                category="GLOBAL",
                channel_id="campus_global",
                sender_username="faculty",
                sender_name="Dr. Priya Sen",
                sender_role="faculty",
                recipient_username=None,
                message="Reminder to all students: The AI & Machine Learning Research Symposium registration is open.",
                timestamp=now,
                is_read=True
            ),
            UnifiedChatMessageModel(
                id="cmsg_glob_3",
                category="GLOBAL",
                channel_id="campus_global",
                sender_username="amit",
                sender_name="Amit Sharma",
                sender_role="student",
                recipient_username=None,
                message="Hello everyone! Excited to collaborate on our upcoming capstone projects.",
                timestamp=now,
                is_read=True
            ),
            # PRIVATE Category Messages
            UnifiedChatMessageModel(
                id="cmsg_priv_1",
                category="PRIVATE",
                channel_id="grp_ai_club",
                sender_username="amit",
                sender_name="Amit Sharma",
                sender_role="student",
                recipient_username=None,
                message="Has anyone started testing the new transformer model architecture for the hackathon?",
                timestamp=now,
                is_read=True
            ),
            UnifiedChatMessageModel(
                id="cmsg_priv_2",
                category="PRIVATE",
                channel_id="grp_ai_club",
                sender_username="faculty",
                sender_name="Dr. Priya Sen",
                sender_role="faculty",
                recipient_username=None,
                message="Check out the model checkpoint uploaded to the lab server. Let's sync tomorrow at 3 PM.",
                timestamp=now,
                is_read=True
            ),
            # PERSONAL Category Messages
            UnifiedChatMessageModel(
                id="cmsg_pers_1",
                category="PERSONAL",
                channel_id="direct_amit_faculty",
                sender_username="faculty",
                sender_name="Dr. Priya Sen",
                sender_role="faculty",
                recipient_username="amit",
                message="Hi Amit, your recent assignment submission on Vector Database indexing was exemplary. Keep up the high standard!",
                timestamp=now,
                is_read=True
            ),
            UnifiedChatMessageModel(
                id="cmsg_pers_2",
                category="PERSONAL",
                channel_id="direct_amit_faculty",
                sender_username="amit",
                sender_name="Amit Sharma",
                sender_role="student",
                recipient_username="faculty",
                message="Thank you, Dr. Priya! I am currently reading research papers on multi-database query federation.",
                timestamp=now,
                is_read=True
            ),
            UnifiedChatMessageModel(
                id="cmsg_pers_3",
                category="PERSONAL",
                channel_id="direct_amit_parent_alex",
                sender_username="parent_alex",
                sender_name="Mr. Rajesh Sharma",
                sender_role="parent",
                recipient_username="amit",
                message="Amit, checked your attendance record on the portal. Great job maintaining 85%+ attendance!",
                timestamp=now,
                is_read=True
            ),
        ]
        for s in seeds:
            db.add(s)
        db.commit()

# -------------------------------------------------------------
# 3. GET MESSAGES BY CATEGORY
# -------------------------------------------------------------
@router.get("/category/{category}", response_model=List[UnifiedChatMessageResponse])
def get_messages_by_category(
    category: str,
    channel_id: Optional[str] = None,
    peer_username: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """
    Fetch messages filtered by:
    - category in ('PERSONAL', 'PRIVATE', 'GLOBAL')
    - channel_id (e.g. 'campus_global', 'grp_ai_club', etc.)
    - peer_username (for PERSONAL direct messaging)
    """
    _seed_chat_messages_if_needed(db)
    cat_upper = category.upper()
    if cat_upper not in ["PERSONAL", "PRIVATE", "GLOBAL"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid category. Must be one of: 'PERSONAL', 'PRIVATE', 'GLOBAL'"
        )

    uname = current_user.username
    query = db.query(UnifiedChatMessageModel).filter(UnifiedChatMessageModel.category == cat_upper)

    if cat_upper == "GLOBAL":
        target_ch = channel_id or "campus_global"
        query = query.filter(UnifiedChatMessageModel.channel_id == target_ch)

    elif cat_upper == "PRIVATE":
        if channel_id:
            query = query.filter(UnifiedChatMessageModel.channel_id == channel_id)

    elif cat_upper == "PERSONAL":
        # Personal direct messaging: must involve current user
        if peer_username:
            peer = peer_username.strip().lower()
            query = query.filter(
                or_(
                    and_(UnifiedChatMessageModel.sender_username == uname, UnifiedChatMessageModel.recipient_username == peer),
                    and_(UnifiedChatMessageModel.sender_username == peer, UnifiedChatMessageModel.recipient_username == uname),
                    UnifiedChatMessageModel.channel_id == f"direct_{min(uname, peer)}_{max(uname, peer)}"
                )
            )
        else:
            query = query.filter(
                or_(
                    UnifiedChatMessageModel.sender_username == uname,
                    UnifiedChatMessageModel.recipient_username == uname
                )
            )

    messages = query.order_by(UnifiedChatMessageModel.timestamp.asc()).limit(limit).all()

    # Mark unread personal messages as read
    if cat_upper == "PERSONAL":
        for m in messages:
            if m.recipient_username == uname and not m.is_read:
                m.is_read = True
        db.commit()

    return messages

# -------------------------------------------------------------
# 4. SEND MESSAGE IN CATEGORY
# -------------------------------------------------------------
@router.post("/send", response_model=UnifiedChatMessageResponse, status_code=status.HTTP_201_CREATED)
def send_unified_message(
    payload: UnifiedChatSendRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """
    Send a message under PERSONAL, PRIVATE, or GLOBAL category.
    """
    cat_upper = payload.category.upper()
    if cat_upper not in ["PERSONAL", "PRIVATE", "GLOBAL"]:
        raise HTTPException(
            status_code=400,
            detail="Category must be one of: 'PERSONAL', 'PRIVATE', 'GLOBAL'"
        )

    msg_id = f"cmsg_{cat_upper[:4].lower()}_{uuid.uuid4().hex[:10]}"
    uname = current_user.username

    channel_id = payload.channel_id or "campus_global"
    recipient = payload.recipient_username

    if cat_upper == "PERSONAL":
        if not recipient:
            recipient = "faculty" if current_user.role != "faculty" else "amit"
        # Deterministic personal channel ID
        channel_id = f"direct_{min(uname, recipient)}_{max(uname, recipient)}"

    elif cat_upper == "GLOBAL":
        channel_id = "campus_global"
        recipient = None

    new_msg = UnifiedChatMessageModel(
        id=msg_id,
        category=cat_upper,
        channel_id=channel_id,
        sender_username=uname,
        sender_name=current_user.full_name or uname,
        sender_role=current_user.role,
        recipient_username=recipient,
        message=payload.message.strip(),
        timestamp=datetime.now(timezone.utc),
        is_read=False
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    # Cross-sync to legacy mentor_chats table if personal message involves student/faculty for backward compatibility
    if cat_upper == "PERSONAL" and recipient:
        try:
            legacy_msg = MentorChatModel(
                id=f"msg_{uuid.uuid4().hex[:10]}",
                student_id=uname if current_user.role == "student" else recipient,
                mentor_username=recipient if current_user.role == "student" else uname,
                sender_role=current_user.role,
                sender_name=current_user.full_name or uname,
                message=payload.message.strip(),
                timestamp=datetime.now(timezone.utc)
            )
            db.add(legacy_msg)
            db.commit()
        except Exception:
            pass

    # -------------------------------------------------------------
    # Meta AI in WhatsApp-style Educational Assistant Trigger
    # -------------------------------------------------------------
    try:
        from backend.services.edumentor_ai_service import EduMentorAIService
        EduMentorAIService.process_and_reply(
            db=db,
            current_user=current_user,
            raw_message=payload.message.strip(),
            category=cat_upper,
            channel_id=channel_id,
            recipient_username=recipient,
            criteria=payload.criteria
        )
    except Exception as e:
        print(f"[AI ASSISTANT NOTICE] {e}")

    return new_msg

# -------------------------------------------------------------
# 4.1 DIRECT EDUCATIONAL AI QUERY (Meta AI Standalone)
# -------------------------------------------------------------
class AiAskDirectRequest(ChatMessageCreate.__base__):
    query: str
    criteria: Optional[str] = None
    channel_id: Optional[str] = "campus_global"
    category: Optional[str] = "GLOBAL"

@router.post("/ai/ask")
def ask_edumentor_ai_direct(
    req: AiAskDirectRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    """
    Directly query EduMentor AI (Meta AI in WhatsApp style) grounded in
    the requested or auto-detected Educational Criteria.
    """
    from backend.services.edumentor_ai_service import EduMentorAIService, CRITERIA_MAP

    criterion = EduMentorAIService.detect_criterion(req.query, explicit_criterion=req.criteria)
    cleaned = EduMentorAIService.clean_query(req.query)

    recent_msgs = db.query(UnifiedChatMessageModel).filter(
        UnifiedChatMessageModel.category == req.category.upper(),
        UnifiedChatMessageModel.channel_id == req.channel_id
    ).order_by(UnifiedChatMessageModel.timestamp.desc()).limit(10).all()

    response_text = EduMentorAIService.generate_response(
        query=cleaned,
        criterion=criterion,
        sender_user=current_user,
        channel_id=req.channel_id or "campus_global",
        category=req.category.upper(),
        recent_channel_messages=recent_msgs
    )

    crit_meta = CRITERIA_MAP.get(criterion, {})

    return {
        "criterion": criterion,
        "criterion_name": crit_meta.get("name", criterion),
        "criterion_badge": crit_meta.get("badge", criterion),
        "criterion_icon": crit_meta.get("icon", "fa-graduation-cap"),
        "criterion_color": crit_meta.get("color", "blue"),
        "query": req.query,
        "cleaned_query": cleaned,
        "answer": response_text,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# -------------------------------------------------------------
# 5. LEGACY ENDPOINTS PRESERVED FOR FULL BACKWARD COMPATIBILITY
# -------------------------------------------------------------
@router.get("/messages/{student_id}", response_model=List[ChatMessageResponse])
def get_legacy_chat_messages(
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
def send_legacy_chat_message(
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
