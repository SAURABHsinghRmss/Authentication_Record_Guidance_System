from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean, Text
from backend.database import Base
from datetime import datetime

class StudentORM(Base):
    __tablename__ = "students"
    
    id = Column(String, primary_key=True, index=True)
    roll_no = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    department = Column(String)
    semester = Column(String)
    cgpa = Column(Float)
    attendance_percentage = Column(Float)
    credits_earned = Column(Integer)
    max_credits = Column(Integer, default=160)
    backlogs = Column(Integer, default=0)
    apaar_id = Column(String, unique=True)
    digilocker_status = Column(String, default="VERIFIED")
    dbt_status = Column(String, default="ACTIVE")
    status = Column(String, default="VERIFIED")

class UserORM(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    name = Column(String)
    role = Column(String)
    email = Column(String, unique=True)
    mobile = Column(String)
    institution = Column(String)
    apaar_id = Column(String, nullable=True)
    roll_no = Column(String, nullable=True)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class PasskeyORM(Base):
    __tablename__ = "passkeys"
    
    id = Column(String, primary_key=True, index=True)
    username = Column(String, index=True)
    name = Column(String)
    role = Column(String)
    credential_id = Column(String, unique=True)
    public_key = Column(Text)
    counter = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLogORM(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    username = Column(String, index=True)
    role = Column(String)
    action = Column(String)
    details = Column(Text)
    ip_address = Column(String, nullable=True)
    severity = Column(String, default="INFO")
