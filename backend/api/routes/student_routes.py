from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from backend.services.db import get_db
from backend.models.student import StudentModel, StudentCreate, StudentUpdate, StudentResponse, UserModel
from backend.api.dependencies import require_role

router = APIRouter(prefix="/students", tags=["Student Record Management"])

@router.get("/", response_model=List[StudentResponse])
def list_students(
    skip: int = 0,
    limit: int = 100,
    department: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(StudentModel)
    if department:
        query = query.filter(StudentModel.department.ilike(f"%{department}%"))
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(
    student_in: StudentCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(require_role(["admin", "faculty"]))
):
    existing = db.query(StudentModel).filter(StudentModel.roll_no == student_in.roll_no).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student roll number already exists")
    
    student_id = f"stu_{uuid.uuid4().hex[:8]}"
    student = StudentModel(id=student_id, **student_in.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter((StudentModel.id == student_id) | (StudentModel.roll_no == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: str,
    student_in: StudentUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(require_role(["admin", "faculty"]))
):
    student = db.query(StudentModel).filter((StudentModel.id == student_id) | (StudentModel.roll_no == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    update_data = student_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(student, key, value)
    
    db.commit()
    db.refresh(student)
    return student

@router.delete("/{student_id}")
def delete_student(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(require_role(["admin"]))
):
    student = db.query(StudentModel).filter((StudentModel.id == student_id) | (StudentModel.roll_no == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()
    return {"message": "Student record successfully deleted", "id": student_id}

@router.get("/{student_id}/guidance")
def get_student_guidance(student_id: str, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter((StudentModel.id == student_id) | (StudentModel.roll_no == student_id)).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    attendance = float(student.attendance_percentage or 0)
    cgpa = float(student.cgpa or 0)
    backlogs = student.backlogs or 0

    recommendations = []
    if attendance < 75.0:
        recommendations.append("Warning: Attendance is below 75% mandatory threshold. Immediate remedial classes required.")
    else:
        recommendations.append("Attendance is healthy and compliant with institutional norms.")

    if cgpa >= 8.5:
        recommendations.append("Eligible for Honors degree track and advanced research assistantships.")
    elif cgpa >= 7.0:
        recommendations.append("Performing well. Recommended to explore SWAYAM/NPTEL credit transfer electives.")
    else:
        recommendations.append("Academic counseling recommended with faculty mentor to improve grade trajectory.")

    if backlogs > 0:
        recommendations.append(f"Action Required: Clear {backlogs} active backlog(s) prior to campus placement registration.")
    else:
        recommendations.append("Zero backlogs: Fully eligible for upcoming tier-1 placement drives.")

    return {
        "student_id": student.id,
        "roll_no": student.roll_no,
        "name": student.name,
        "cgpa": cgpa,
        "attendance": attendance,
        "backlogs": backlogs,
        "recommendations": recommendations,
        "timestamp": "2026-10-06T12:00:00Z"
    }
