"""
INDIA DIGITAL PUBLIC INFRASTRUCTURE (DPI) API ROUTES
=====================================================
Exposes endpoints for Indian governance verifications:
1. APAAR / ABC ID (DigiLocker)
2. National Scholarship Portal (NSP) DBT
3. AICTE Portal Accreditation & SIF
4. UIDAI Aadhaar Demographic & Biometric
5. PFMS & SBIePay Payment Gateway Reconciliation
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from backend.api.dependencies import get_current_user
from backend.services.india_dpi_integration_service import india_dpi_service

router = APIRouter(prefix="/india-dpi", tags=["India Digital Public Infrastructure (DPI)"])

class ApaarVerifyRequest(BaseModel):
    apaar_id: str
    student_name: str

class NspVerifyRequest(BaseModel):
    student_id: str
    category: str = "General"

class AicteVerifyRequest(BaseModel):
    accreditation_number: str
    institution_name: str

class AadhaarVerifyRequest(BaseModel):
    aadhaar_number: str

class PfmsPaymentVerifyRequest(BaseModel):
    utr_number: str
    amount: float

@router.post("/verify-apaar-abc")
def verify_apaar_abc(payload: ApaarVerifyRequest, current_user=Depends(get_current_user)):
    """Verify APAAR ID and Academic Bank of Credits (ABC) via DigiLocker."""
    try:
        return india_dpi_service.verify_apaar_abc_id(payload.apaar_id, payload.student_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-nsp-scholarship")
def verify_nsp_scholarship(payload: NspVerifyRequest, current_user=Depends(get_current_user)):
    """Verify National Scholarship Portal (NSP) Direct Benefit Transfer (DBT)."""
    try:
        return india_dpi_service.verify_nsp_scholarship(payload.student_id, payload.category)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-aicte-portal")
def verify_aicte_portal(payload: AicteVerifyRequest, current_user=Depends(get_current_user)):
    """Verify AICTE Accreditation and Statutory Inspection Format (SIF)."""
    try:
        return india_dpi_service.verify_aicte_accreditation(payload.accreditation_number, payload.institution_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-uidai-aadhaar")
def verify_uidai_aadhaar(payload: AadhaarVerifyRequest, current_user=Depends(get_current_user)):
    """Verify UIDAI Aadhaar demographic and biometric hash."""
    try:
        return india_dpi_service.verify_aadhaar_uidai(payload.aadhaar_number)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-pfms-payment")
def verify_pfms_payment(payload: PfmsPaymentVerifyRequest, current_user=Depends(get_current_user)):
    """Verify PFMS & SBIePay institutional fee transaction or scholarship grant."""
    try:
        return india_dpi_service.verify_pfms_sbi_payment(payload.utr_number, payload.amount)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
