import json
import os
import math
from typing import List, Dict, Any

class VectorStoreManager:
    def __init__(self, json_path: str = "backend/models/sample_students.json"):
        self.json_path = json_path
        self.kb = []
        self.load_data()

    def load_data(self):
        if os.path.exists(self.json_path):
            with open(self.json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.kb = data.get("knowledge_base", [])
        else:
            self.kb = [
                {
                    "id": "kb_01",
                    "topic": "Credit Transfer Policy",
                    "content": "Students can transfer up to 20% of total degree credits (32 credits for 160) via SWAYAM/NPTEL."
                },
                {
                    "id": "kb_02",
                    "topic": "Attendance Requirements",
                    "content": "Minimum 75% attendance is mandatory in all theory and practical courses to appear for exams."
                }
            ]

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        query_lower = query.lower()
        results = []
        for item in self.kb:
            score = 0.5
            content_lower = item["content"].lower()
            topic_lower = item["topic"].lower()
            
            # Simple keyword overlap scoring
            for word in query_lower.split():
                if len(word) > 3 and word in content_lower:
                    score += 0.2
                if len(word) > 3 and word in topic_lower:
                    score += 0.3
            
            score = min(score, 0.99)
            results.append({
                "id": item["id"],
                "topic": item["topic"],
                "content": item["content"],
                "score": round(score, 2)
            })
        
        # Sort by score descending
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

vector_store = VectorStoreManager()
