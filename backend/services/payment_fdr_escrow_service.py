"""
PAYMENT, SECURITY DEPOSIT & FDR ESCROW SERVICE
==============================================
Provides institutional payment processing, security deposit management,
Fixed Deposit Receipt (FDR) portal automation, multi-mode payment gateways,
and inter-role financial tracking (Student, Parent, Institute, Admin).
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid

class PaymentFDREscrowService:
    # In-memory stores for financial transactions and FDR escrow bonds
    PAYMENTS_STORE = [
        {
            "tx_id": "tx_2026_9981",
            "payer_username": "amit",
            "payer_role": "student",
            "beneficiary_name": "GL Bajaj Institute of Technology and Management",
            "payment_type": "SEMESTER_FEE",
            "amount_inr": 65000.0,
            "mode": "UPI (GooglePay / PhonePe / Paytm)",
            "gateway_ref": "UPI/2026/998122334",
            "status": "SUCCESS",
            "timestamp": "2026-10-20T11:00:00Z",
            "remarks": "Semester 6 Tuition & Lab Fee paid via parent-student linked account."
        },
        {
            "tx_id": "tx_2026_9982",
            "payer_username": "parent_alex",
            "payer_role": "parent",
            "beneficiary_name": "GL Bajaj Institute of Technology and Management",
            "payment_type": "SECURITY_DEPOSIT",
            "amount_inr": 25000.0,
            "mode": "SBIePay NetBanking",
            "gateway_ref": "SBIEPAY/NET/8839201",
            "status": "SUCCESS",
            "timestamp": "2026-10-21T14:30:00Z",
            "remarks": "Hostel & Library Caution Security Deposit (Refundable on graduation)."
        }
    ]

    FDR_ESCROW_STORE = [
        {
            "fdr_id": "fdr_escrow_001",
            "institution_name": "GL Bajaj Institute of Technology and Management",
            "issuing_bank": "State Bank of India (SBI - Greater Noida Branch)",
            "fdr_number": "SBI/FDR/2026/99482",
            "principal_amount_inr": 3500000.0,
            "deposit_type": "AICTE Statutory Reserve FDR Escrow Bond",
            "maturity_date": "2031-10-22",
            "interest_rate_percent": 7.5,
            "status": "ACTIVE_PLEDGED_TO_AICTE",
            "created_at": "2026-01-15T10:00:00Z"
        }
    ]

    @classmethod
    def get_payment_ledger(cls, username: Optional[str] = None, role: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve payment and security deposit history, filterable by user."""
        if username:
            return [tx for tx in cls.PAYMENTS_STORE if tx["payer_username"] == username]
        return cls.PAYMENTS_STORE

    @classmethod
    def process_payment(
        cls,
        payer_username: str,
        payer_role: str,
        beneficiary_name: str,
        payment_type: str,
        amount_inr: float,
        mode: str,
        remarks: str
    ) -> Dict[str, Any]:
        """
        Process a fee, security deposit, or product payment across multiple modes:
        UPI, NetBanking, Credit/Debit Card, SBIePay, PFMS Treasury.
        """
        rand_hex = uuid.uuid4().hex[:6]
        gateway_ref = f"{mode.upper()[:3]}-{uuid.uuid4().hex[:10].upper()}"
        new_tx = {
            "tx_id": f"tx_{datetime.now().strftime('%Y')}_{rand_hex}",
            "payer_username": payer_username,
            "payer_role": payer_role,
            "beneficiary_name": beneficiary_name,
            "payment_type": payment_type,
            "amount_inr": amount_inr,
            "mode": mode,
            "gateway_ref": gateway_ref,
            "status": "SUCCESS",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "remarks": remarks
        }
        cls.PAYMENTS_STORE.insert(0, new_tx)
        return new_tx

    @classmethod
    def get_fdr_escrow_portal(cls) -> Dict[str, Any]:
        """Get Fixed Deposit Receipt (FDR) Escrow Portal details and statutory reserves."""
        total_escrow = sum(f["principal_amount_inr"] for f in cls.FDR_ESCROW_STORE)
        return {
            "portal_title": "AICTE Statutory Reserve & Security Deposit FDR Escrow Portal",
            "total_fdr_escrow_inr": total_escrow,
            "active_bonds_count": len(cls.FDR_ESCROW_STORE),
            "fdr_records": cls.FDR_ESCROW_STORE,
            "compliance_status": "VERIFIED_AND_PLEDGED"
        }

    @classmethod
    def create_fdr_bond(
        cls,
        institution_name: str,
        issuing_bank: str,
        fdr_number: str,
        principal_amount_inr: float,
        deposit_type: str,
        maturity_date: str,
        interest_rate_percent: float
    ) -> Dict[str, Any]:
        """Create a new Fixed Deposit Receipt (FDR) escrow bond for institutional compliance."""
        new_fdr = {
            "fdr_id": f"fdr_escrow_{uuid.uuid4().hex[:6]}",
            "institution_name": institution_name,
            "issuing_bank": issuing_bank,
            "fdr_number": fdr_number,
            "principal_amount_inr": principal_amount_inr,
            "deposit_type": deposit_type,
            "maturity_date": maturity_date,
            "interest_rate_percent": interest_rate_percent,
            "status": "ACTIVE_PLEDGED_TO_AICTE",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        cls.FDR_ESCROW_STORE.insert(0, new_fdr)
        return new_fdr

payment_fdr_escrow_service = PaymentFDREscrowService()
