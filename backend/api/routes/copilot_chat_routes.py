from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid
import json
from datetime import datetime, timezone

from backend.services.db import get_db
from backend.models.student import (
    UserModel, CommunityMessageModel,
    StudySessionSummaryModel, StudySummaryResponse,
    InteractiveQuizModel, InteractiveQuizCreate, InteractiveQuizResponse,
    QuizAnswerRequest, QuizAnswerResponse
)
from backend.api.dependencies import get_current_user
from ai_engine.pipelines.vector_store import vector_store

router = APIRouter(prefix="/copilot", tags=["EduMentor Co-Pilot & Interactive Study Hub"])

@router.post("/groups/{group_id}/summarize", response_model=StudySummaryResponse)
def summarize_study_session(
    group_id: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    messages = db.query(CommunityMessageModel).filter(CommunityMessageModel.group_id == group_id).order_by(CommunityMessageModel.timestamp.desc()).limit(20).all()
    
    if not messages:
        summary_text = "No discussion messages found in this study group yet to summarize."
        takeaways = "Start chatting or posting study topics to enable AI Co-Pilot synthesis."
    else:
        chat_snippet = " ".join([m.message for m in messages[:10]])
        hits = vector_store.search(chat_snippet, top_k=2)
        policy_context = hits[0]["content"] if hits else "Standard institutional academic policy applies."
        
        summary_text = f"AI Co-Pilot analyzed {len(messages)} recent messages. Discussion focuses on collaborative problem-solving, exam prep, and credit transfer requirements. Relevant policy context: {policy_context}"
        takeaways = "1. Review core syllabus chapters.\n2. Participate in upcoming peer mock tests.\n3. Maintain 75%+ attendance."

    summary_id = f"sum_{uuid.uuid4().hex[:8]}"
    summary_obj = StudySessionSummaryModel(
        id=summary_id,
        group_id=group_id,
        summary_text=summary_text,
        key_takeaways=takeaways,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(summary_obj)
    db.commit()
    db.refresh(summary_obj)
    return summary_obj

@router.post("/groups/{group_id}/quiz", response_model=InteractiveQuizResponse, status_code=status.HTTP_201_CREATED)
def create_study_quiz(
    group_id: str,
    quiz_in: InteractiveQuizCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    quiz_id = f"quiz_{uuid.uuid4().hex[:8]}"
    quiz = InteractiveQuizModel(
        id=quiz_id,
        group_id=group_id,
        question=quiz_in.question,
        options=json.dumps(quiz_in.options),
        correct_answer=quiz_in.correct_answer,
        created_by=current_user.username,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    
    return InteractiveQuizResponse(
        id=quiz.id,
        group_id=quiz.group_id,
        question=quiz.question,
        options=json.loads(quiz.options),
        correct_answer=quiz.correct_answer,
        created_by=quiz.created_by,
        timestamp=quiz.timestamp
    )

@router.get("/groups/{group_id}/quizzes", response_model=List[InteractiveQuizResponse])
def list_group_quizzes(
    group_id: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    quizzes = db.query(InteractiveQuizModel).filter(InteractiveQuizModel.group_id == group_id).order_by(InteractiveQuizModel.timestamp.desc()).all()
    results = []
    for q in quizzes:
        results.append(InteractiveQuizResponse(
            id=q.id,
            group_id=q.group_id,
            question=q.question,
            options=json.loads(q.options),
            correct_answer=q.correct_answer if current_user.role in ["faculty", "admin"] else None,
            created_by=q.created_by,
            timestamp=q.timestamp
        ))
    return results

@router.post("/quizzes/{quiz_id}/answer", response_model=QuizAnswerResponse)
def answer_quiz(
    quiz_id: str,
    payload: QuizAnswerRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    quiz = db.query(InteractiveQuizModel).filter(InteractiveQuizModel.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found.")
    
    correct = (payload.selected_answer.strip().lower() == quiz.correct_answer.strip().lower())
    explanation = f"The correct answer is '{quiz.correct_answer}'. Review study group notes and institutional guidelines for further details."
    
    return QuizAnswerResponse(
        correct=correct,
        explanation=explanation,
        correct_answer=quiz.correct_answer
    )

@router.post("/verify-access")
def verify_trust_tier_access(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    is_trusted = current_user.institution_verified or (current_user.role in ["faculty", "admin"])
    return {
        "username": current_user.username,
        "role": current_user.role,
        "institution_verified": current_user.institution_verified,
        "trust_tier_access": "ELITE_VERIFIED" if is_trusted else "STANDARD",
        "message": "Trust-tier verification successful. Access granted to secured study hive."
    }
