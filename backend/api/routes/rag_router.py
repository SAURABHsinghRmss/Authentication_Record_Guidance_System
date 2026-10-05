from fastapi import APIRouter
from datetime import datetime, timezone
import time
from pydantic import BaseModel
from typing import List, Optional

from backend.models.student import QueryRequest, QueryResponse, Citation
from ai_engine.pipelines.vector_store import vector_store

router = APIRouter(tags=["AI Guidance RAG Engine & Security"])

class UrlCheckRequest(BaseModel):
    url: str

class UrlCheckResponse(BaseModel):
    url: str
    trust_score: int
    is_safe: bool
    category: str
    warnings: List[str]
    recommendation: str
    timestamp: str

@router.post("/rag_query", response_model=QueryResponse)
def rag_query(payload: QueryRequest):
    start_time = time.time()
    
    # Perform vector search on knowledge base
    hits = vector_store.search(payload.query, top_k=payload.top_k)
    
    citations = [
        Citation(
            id=hit["id"],
            topic=hit["topic"],
            content=hit["content"],
            score=hit["score"]
        ) for hit in hits
    ]
    
    # Synthesize answer
    if hits:
        top_hit = hits[0]
        answer = f"Based on institutional policy regarding '{top_hit['topic']}': {top_hit['content']} (Matched via Qwen3 embedding similarity score {top_hit['score']})."
    else:
        answer = "No matching academic policy or guideline was found for your query. Please contact the academic registrar."

    latency_ms = round((time.time() - start_time) * 1000, 2)

    return QueryResponse(
        answer=answer,
        citations=citations,
        latency_ms=latency_ms,
        timestamp=datetime.now(timezone.utc).isoformat()
    )

@router.post("/api/security/check-url", response_model=UrlCheckResponse)
def check_url_legitimacy(payload: UrlCheckRequest):
    url = payload.url.strip().lower()
    warnings = []
    trust_score = 85
    category = "Unknown Opportunity Portal"
    
    # Heuristics
    if not url.startswith("https://"):
        trust_score -= 30
        warnings.append("Insecure HTTP protocol detected. Connection is not encrypted.")
    
    trusted_domains = ["gov.in", "ac.in", "edu", "ugc.gov.in", "aicte-india.org", "swayam.gov.in", "digilocker.gov.in"]
    is_trusted = any(domain in url for domain in trusted_domains)
    
    suspicious_tlds = [".xyz", ".top", ".cc", ".biz", ".ru/free", ".gq", ".ml"]
    is_suspicious = any(tld in url for tld in suspicious_tlds)
    
    if is_trusted:
        trust_score = 98
        is_safe = True
        category = "Official Government / Academic Domain"
        recommendations = "Verified official educational portal. Safe to apply."
    elif is_suspicious:
        trust_score = 25
        is_safe = False
        category = "High Risk Phishing / Scam Domain"
        warnings.append("Suspicious Top-Level Domain (TLD) commonly associated with fraudulent scholarship scams.")
        recommendations = "WARNING: Avoid entering personal information, APAAR ID, or bank details on this portal."
    else:
        if len(url) > 50 or "scholarship-free" in url or "win-prize" in url:
            trust_score = 40
            is_safe = False
            category = "Potential Scam / Unverified Portal"
            warnings.append("URL contains unverified keyword patterns associated with financial aid scams.")
            recommendations = "Exercise extreme caution. Cross-check with university placement cell."
        else:
            is_safe = True
            category = "Commercial / Third-Party Portal"
            recommendations = "Standard web portal. Verify issuer credentials before submitting sensitive documents."

    return UrlCheckResponse(
        url=payload.url,
        trust_score=max(5, min(100, trust_score)),
        is_safe=is_safe,
        category=category,
        warnings=warnings,
        recommendation=recommendations,
        timestamp=datetime.now(timezone.utc).isoformat()
    )
