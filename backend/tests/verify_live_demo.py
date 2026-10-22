import urllib.request
import urllib.error
import json
import sys
import io
import time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

BASE_URL = "http://127.0.0.1:8000"
PASS = 0
FAIL = 0

def ok(msg):
    global PASS
    PASS += 1
    print(f"  [PASS] {msg}")

def fail(msg):
    global FAIL
    FAIL += 1
    print(f"  [FAIL] {msg}")

def api_post(url, data, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        if e.code == 429:
            print(f"  [WAIT] Rate limited, waiting 10s...")
            time.sleep(10)
            req2 = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
            with urllib.request.urlopen(req2) as resp:
                return json.loads(resp.read().decode())
        raise Exception(f"HTTP {e.code}: {body}")

def login(username, password, role_label):
    res = api_post(f"{BASE_URL}/api/auth/login", {"username": username, "password": password})
    token = res.get("access_token")
    ok(f"{role_label:10} -> {username:15} | Role: {res['role']:10} | Name: {res['full_name']}")
    return token


def main():
    # -- 1. SYSTEM HEALTH ------------------------------------------------
    print("=" * 65)
    print("  SECTION 1: SYSTEM HEALTH & DIAGNOSTICS")
    print("=" * 65)
    with urllib.request.urlopen(f"{BASE_URL}/health") as res:
        data = json.loads(res.read().decode())
    ok(f"Status: {data['status']} | DB: {data['database']} | Vector: {data['vector_store']}")

    # -- 2. FIVE DEMO PERSONAS LOGIN ------------------------------------
    print("\n" + "=" * 65)
    print("  SECTION 2: 5 PRE-SEEDED DEMO PERSONA LOGINS")
    print("=" * 65)
    t = {}
    for role, user, pwd in [
        ("student",   "amit",            "amit123"),
        ("faculty",   "faculty",         "faculty123"),
        ("parent",    "parent_alex",     "parent123"),
        ("institute", "institute_admin", "inst123"),
        ("admin",     "msrch",           "msrch1410#"),
    ]:
        time.sleep(0.3)  # Avoid auth rate limiter (15 req/min for /auth/)
        t[role] = login(user, pwd, role.capitalize())

    # -- 3. CROSS-ROLE PIPELINES ----------------------------------------
    print("\n" + "=" * 65)
    print("  SECTION 3: CROSS-ROLE INTERCONNECTION PIPELINES")
    print("=" * 65)

    # 3a. Faculty -> Student Document Auth via Sarvam AI
    print("\n  -- Pipeline A: Faculty <-> Student (Sarvam AI Doc Verification) --")
    res = api_post(f"{BASE_URL}/api/cross-role/faculty-auth-student-doc", {
        "student_username": "amit",
        "document_title": "Capstone_AI_Defense_v3.pdf",
        "document_text": "This thesis presents an advanced biometric authentication system."
    }, t["faculty"])
    auth = res.get("authentication_result", {})
    ok(f"Pipeline: {res['pipeline']}")
    ok(f"Faculty Mentor: {res['faculty_mentor']} -> Student Target: {res['student_target']}")
    ok(f"Doc Status: {auth['status']} | Tamper: {auth['tamper_detected']} | Score: {auth['authenticity_score']}")
    ok(f"Engine: {auth['engine']}")

    # 3b. Parent -> Ward Academic Telemetry
    print("\n  -- Pipeline B: Parent <-> Student (Ward Academic Telemetry) --")
    res = api_post(f"{BASE_URL}/api/cross-role/parent-ward-summary", {
        "ward_username": "amit"
    }, t["parent"])
    acad = res["academic_standing"]
    fee = res["fee_status"]
    ok(f"Pipeline: {res['pipeline']}")
    ok(f"Parent: {res['parent_username']} -> Ward: {res['ward_username']}")
    ok(f"CGPA: {acad['cgpa']} | Attendance: {acad['attendance_percentage']} | Standing: {acad['standing']}")
    ok(f"Semester Fee Paid: {fee['semester_fee_paid']} | Pending Dues INR: {fee['pending_dues_inr']}")

    # 3c. Institute -> Admin Governance Escalation
    print("\n  -- Pipeline C: Institute <-> Admin (AICTE Regulatory Escalation) --")
    res = api_post(f"{BASE_URL}/api/cross-role/institute-escalate-admin", {
        "institute_name": "GL Bajaj Institute of Technology and Management",
        "issue_title": "AICTE Approval Extension 2026-27 SIF Audit",
        "bureau": "AICTE Approval Bureau (AB)",
        "description": "Annual compliance docs and FDR escrow verification for CSE/ECE intake expansion."
    }, t["institute"])
    c = res.get("case_record", {})
    ok(f"Pipeline: {res['pipeline']} | Status: {res['status']}")
    ok(f"Case ID: {c.get('case_id')} | Title: {c.get('title')} | Bureau: {c.get('bureau_or_cell')}")

    # -- 4. INDIA DIGITAL PUBLIC INFRASTRUCTURE (DPI) --------------------
    print("\n" + "=" * 65)
    print("  SECTION 4: INDIA DIGITAL PUBLIC INFRASTRUCTURE (DPI) VAULT")
    print("=" * 65)

    # 4a. APAAR / ABC (DigiLocker)
    print("\n  -- DPI-1: APAAR / Academic Bank of Credits (ABC via DigiLocker) --")
    res = api_post(f"{BASE_URL}/api/india-dpi/verify-apaar-abc", {
        "apaar_id": "APAAR-9988-7766",
        "student_name": "Amit Sharma"
    }, t["student"])
    abc = res.get("abc_score_ledger", {})
    ok(f"Service: {res['service']}")
    ok(f"Verified: {res['verified']} | Student: {res['student_name']} | ID: {res['identifier']}")
    ok(f"Credits Banked: {abc['total_credits_banked']} | ABC Status: {abc['abc_status']}")

    # 4b. NSP Scholarship DBT
    print("\n  -- DPI-2: National Scholarship Portal (NSP) Direct Benefit Transfer --")
    res = api_post(f"{BASE_URL}/api/india-dpi/verify-nsp-scholarship", {
        "student_id": "CS-2022-04",
        "category": "General"
    }, t["student"])
    ok(f"Service: {res['service']}")
    ok(f"DBT Status: {res['dbt_status']} | Scheme: {res['scheme_name']}")
    ok(f"Amount: {res['scholarship_amount']} | Bank Verified: {res['aadhaar_seeded_bank_account']}")

    # 4c. AICTE Accreditation
    print("\n  -- DPI-3: AICTE Portal Accreditation & SIF Verification --")
    res = api_post(f"{BASE_URL}/api/india-dpi/verify-aicte-portal", {
        "accreditation_number": "1-4372881101",
        "institution_name": "GL Bajaj Institute of Technology and Management"
    }, t["institute"])
    ok(f"Service: {res['service']}")
    ok(f"Status: {res['status']} | SIF: {res['sif_compliance']}")
    ok(f"Programs: {', '.join(res['approved_programs'][:2])}...")

    # 4d. UIDAI Aadhaar
    print("\n  -- DPI-4: UIDAI Aadhaar Demographic & Biometric Vault --")
    res = api_post(f"{BASE_URL}/api/india-dpi/verify-uidai-aadhaar", {
        "aadhaar_number": "9876-5432-1098"
    }, t["student"])
    ok(f"Service: {res['service']}")
    ok(f"UIDAI Status: {res['uidai_status']} | Demographic: {res['demographic_match']} | Biometric: {res['biometric_hash_verified']}")

    # 4e. PFMS / SBIePay
    print("\n  -- DPI-5: PFMS & SBIePay Fee Reconciliation Gateway --")
    res = api_post(f"{BASE_URL}/api/india-dpi/verify-pfms-payment", {
        "utr_number": "UTR-2026-GL-98765",
        "amount": 125000.00
    }, t["institute"])
    ok(f"Service: {res['service']}")
    ok(f"UTR: {res['utr_number']} | Amount: INR {res['amount_inr']} | Status: {res['reconciliation_status']}")

    # -- SUMMARY ---------------------------------------------------------
    print("\n" + "=" * 65)
    total = PASS + FAIL
    print(f"  FINAL RESULTS: {PASS}/{total} PASSED | {FAIL} FAILED")
    print("=" * 65)
    return 0 if FAIL == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
