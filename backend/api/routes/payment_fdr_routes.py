"""
PAYMENT, SECURITY DEPOSIT & FDR ESCROW ROUTES
=============================================
Exposes API endpoints for:
1. Multi-mode fee, security deposit, and product payments
2. Fixed Deposit Receipt (FDR) escrow portal tracking and bond creation
3. Cross-role transaction ledger
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional

from backend.api.dependencies import get_current_user
from backend.services.payment_fdr_escrow_service import payment_fdr_escrow_service

router = APIRouter(prefix="/payments-fdr", tags=["Payments, Security Deposits & FDR Portal"])

class PaymentProcessRequest(BaseModel):
    beneficiary_name: str
    payment_type: str # SEMESTER_FEE, SECURITY_DEPOSIT, HOSTEL_FEE, PRODUCT_PURCHASE
    amount_inr: float
    mode: str # UPI, NetBanking, Credit/Debit Card, SBIePay, PFMS Treasury
    remarks: str

class FdrBondCreateRequest(BaseModel):
    institution_name: str
    issuing_bank: str
    fdr_number: str
    principal_amount_inr: float
    deposit_type: str = "AICTE Statutory Reserve FDR Escrow Bond"
    maturity_date: str
    interest_rate_percent: float = 7.5

@router.get("/ledger")
def get_payment_ledger(current_user=Depends(get_current_user)):
    """Retrieve transaction ledger for fee payments, security deposits, and product purchases."""
    try:
        # If student or parent, return user-specific or interconnected ledger; admin sees all
        if current_user.role in ["student", "parent"]:
            return payment_fdr_escrow_service.get_payment_ledger(username=current_user.username)
        return payment_fdr_escrow_service.get_payment_ledger()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/process", status_code=status.HTTP_201_CREATED)
def process_payment(payload: PaymentProcessRequest, current_user=Depends(get_current_user)):
    """Process fee payment, security deposit, or product purchase across multi-mode payment options."""
    try:
        tx = payment_fdr_escrow_service.process_payment(
            payer_username=current_user.username,
            payer_role=current_user.role,
            beneficiary_name=payload.beneficiary_name,
            payment_type=payload.payment_type,
            amount_inr=payload.amount_inr,
            mode=payload.mode,
            remarks=payload.remarks
        )
        return {
            "status": "SUCCESS",
            "message": f"Payment of ₹{payload.amount_inr} successfully processed via {payload.mode}.",
            "transaction": tx
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fdr-portal")
def get_fdr_escrow_portal(current_user=Depends(get_current_user)):
    """Get Fixed Deposit Receipt (FDR) Escrow Portal details and statutory reserves."""
    try:
        return payment_fdr_escrow_service.get_fdr_escrow_portal()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/fdr-portal/create", status_code=status.HTTP_201_CREATED)
def create_fdr_escrow_bond(payload: FdrBondCreateRequest, current_user=Depends(get_current_user)):
    """Create a new Fixed Deposit Receipt (FDR) escrow bond (Institute or Admin only)."""
    if current_user.role not in ["admin", "institute", "msrch"]:
        raise HTTPException(status_code=403, detail="Only Institute or Admin roles can create FDR escrow bonds.")
    try:
        fdr = payment_fdr_escrow_service.create_fdr_bond(
            institution_name=payload.institution_name,
            issuing_bank=payload.issuing_bank,
            fdr_number=payload.fdr_number,
            principal_amount_inr=payload.principal_amount_inr,
            deposit_type=payload.deposit_type,
            maturity_date=payload.maturity_date,
            interest_rate_percent=payload.interest_rate_percent
        )
        return {
            "status": "SUCCESS",
            "message": f"FDR escrow bond {payload.fdr_number} successfully created and pledged.",
            "fdr_record": fdr
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
