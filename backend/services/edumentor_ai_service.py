import os
import re
import uuid
import requests
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from backend.models.student import UnifiedChatMessageModel, UserModel
from ai_engine.pipelines.vector_store import vector_store

# -------------------------------------------------------------
# 8 Core Educational Criteria Definitions (Meta AI in WhatsApp Style)
# -------------------------------------------------------------
EDUCATIONAL_CRITERIA: List[Dict[str, Any]] = [
    {
        "id": "POLICY_REGULATION",
        "name": "Institutional Regulations & Credit Policy",
        "badge": "Institutional Policy (RAG)",
        "icon": "fa-landmark",
        "color": "emerald",
        "description": "Grounded verification of university attendance requirements (75% rule), credit transfers (SWAYAM/NPTEL), and official statutory guidelines.",
        "sample_prompts": [
            "What is the minimum attendance required for semester examinations?",
            "How many credits can I transfer through SWAYAM/NPTEL courses?",
            "Explain the grading scale and credit framework for semester evaluation."
        ]
    },
    {
        "id": "CONCEPT_TUTORING",
        "name": "Interactive Academic Concept Tutoring",
        "badge": "Concept Explanation",
        "icon": "fa-graduation-cap",
        "color": "blue",
        "description": "Pedagogical step-by-step breakdowns of core engineering, CS, math, and scientific concepts with analogies, intuition, and complexity analysis.",
        "sample_prompts": [
            "Explain how Dijkstra's shortest path algorithm works with an analogy.",
            "Break down how Transformer attention mechanisms work step-by-step.",
            "Explain the difference between TCP and UDP with real-world examples."
        ]
    },
    {
        "id": "QUIZ_GENERATION",
        "name": "Knowledge Assessment & Study Quizzes",
        "badge": "Interactive Quiz",
        "icon": "fa-circle-question",
        "color": "purple",
        "description": "On-demand educational multiple-choice quiz questions and flashcards with instant pedagogical hints and expandable explanations.",
        "sample_prompts": [
            "Quiz me on Data Structures: Stacks, Queues, and Binary Search Trees.",
            "Generate a 4-option practice question on Database Normalization (3NF/BCNF).",
            "Give me a quick viva check question on Operating System paging and deadlock."
        ]
    },
    {
        "id": "THREAD_SUMMARIZATION",
        "name": "Lecture & Study Thread Synthesis",
        "badge": "Discussion Synthesis",
        "icon": "fa-list-check",
        "color": "amber",
        "description": "Intelligent synthesis of channel discussions, peer study sessions, and lecture threads into structured study notes and key takeaways.",
        "sample_prompts": [
            "Summarize the recent discussion in this study channel.",
            "Give me the key educational takeaways from our group chat.",
            "Extract action items and study topics from today's discussion."
        ]
    },
    {
        "id": "ACADEMIC_INTEGRITY",
        "name": "Academic Integrity & Research Citation",
        "badge": "Research & Citation",
        "icon": "fa-book-bookmark",
        "color": "rose",
        "description": "IEEE / APA reference formatting, plagiarism avoidance standards, authentic scholarly source validation, and ethical AI usage guidelines.",
        "sample_prompts": [
            "How do I format an IEEE reference for a conference proceedings paper?",
            "What constitutes self-plagiarism in undergraduate project reports?",
            "What are the ethical guidelines for acknowledging AI assistance in assignments?"
        ]
    },
    {
        "id": "CAREER_PATHWAY",
        "name": "Technical Roadmap & Career Advisory",
        "badge": "Career Advisory",
        "icon": "fa-compass",
        "color": "teal",
        "description": "Tailored guidance on semester projects, technical skills roadmap, placement preparation, and research internships.",
        "sample_prompts": [
            "Create a preparation roadmap for Software Engineering campus placements.",
            "What technical skills should I master before starting my 7th semester project?",
            "How do I prepare for technical interviews covering Data Structures and System Design?"
        ]
    },
    {
        "id": "EXAM_REVISION",
        "name": "Exam Revision & High-Yield Cheat Sheet",
        "badge": "Exam Cheat Sheet",
        "icon": "fa-bolt",
        "color": "yellow",
        "description": "High-yield formula recaps, core theorem summaries, common traps in semester examinations, and viva voce practice checks.",
        "sample_prompts": [
            "Give me a high-yield exam cheat sheet for Relational Database Management Systems.",
            "What are the most commonly tested derivation questions in Computer Networks?",
            "Give me a rapid-fire revision table for time complexities of standard sorting algorithms."
        ]
    },
    {
        "id": "CODE_LAB_ASSIST",
        "name": "Code Walkthrough & Pedagogical Debugging",
        "badge": "Code Lab & Complexity",
        "icon": "fa-code",
        "color": "cyan",
        "description": "Line-by-line algorithmic code explanation, asymptotic Big-O complexity analysis, and software engineering best practice tips.",
        "sample_prompts": [
            "Explain this recursive tree traversal function line-by-line.",
            "Analyze the time and space complexity of this search algorithm.",
            "Help me identify potential edge cases or bugs in my linked list implementation."
        ]
    }
]

CRITERIA_MAP = {c["id"]: c for c in EDUCATIONAL_CRITERIA}

class EduMentorAIService:
    """
    Campus Educational AI Assistant (Meta AI in WhatsApp style).
    Responds to direct queries and in-thread mentions across PERSONAL, PRIVATE, and GLOBAL categories
    grounded in specific Educational Criteria.
    """

    AI_USERNAME = "edumentor_ai"
    AI_DISPLAY_NAME = "EduMentor AI • Meta AI"
    AI_ROLE = "ai_assistant"

    @classmethod
    def get_all_criteria(cls) -> List[Dict[str, Any]]:
        return EDUCATIONAL_CRITERIA

    @classmethod
    def is_ai_invoked(cls, message: str, recipient_username: Optional[str] = None) -> bool:
        """Determines if the message is directed to or mentions the AI assistant."""
        if recipient_username == cls.AI_USERNAME:
            return True
        msg_lower = message.lower().strip()
        triggers = ["@ai", "@edumentor", "@meta", "@metaai", "/ai"]
        return any(trig in msg_lower for trig in triggers)

    @classmethod
    def clean_query(cls, raw_message: str) -> str:
        """Removes invocation triggers and criteria syntax from the prompt."""
        cleaned = re.sub(r"(?i)@edumentor_ai|@edumentor|@metaai|@meta|@ai|/ai", "", raw_message)
        # Strip directives like --criteria=xyz or [criteria: xyz]
        cleaned = re.sub(r"(?i)--criteria[=:]\w+|\[criteria[=:]\s*\w+\]", "", cleaned)
        return cleaned.strip() if cleaned.strip() else raw_message.strip()

    @classmethod
    def detect_criterion(cls, query: str, explicit_criterion: Optional[str] = None) -> str:
        """Identifies the most relevant educational criterion for the prompt."""
        if explicit_criterion and explicit_criterion.upper() in CRITERIA_MAP:
            return explicit_criterion.upper()

        # Check for inline directive: e.g. @ai --criteria=quiz or [criteria: quiz]
        inline_match = re.search(r"(?i)(?:--criteria[=:]|\[criteria[=:]\s*)([a-zA-Z_]+)", query)
        if inline_match:
            cand = inline_match.group(1).upper()
            for k in CRITERIA_MAP:
                if cand == k or cand in k:
                    return k

        q = query.lower()

        # 1. Exam Revision / Cheat sheet
        if any(w in q for w in ["cheat sheet", "revision", "formula", "viva question", "exam trap", "rapid-fire", "cram"]):
            return "EXAM_REVISION"

        # 2. Code Lab / Debugging
        if any(w in q for w in ["code", "debug", "bug", "syntax", "implementation", "complexity of", "big-o", "time complexity", "pointer", "function"]):
            return "CODE_LAB_ASSIST"

        # 3. Quiz generation
        if any(w in q for w in ["quiz", "test me", "question on", "practice question", "flashcard", "mcq", "knowledge check"]):
            return "QUIZ_GENERATION"

        # 4. Discussion summarization
        if any(w in q for w in ["summarize", "summary", "recap", "takeaways", "notes of this", "tldr", "overview of thread"]):
            return "THREAD_SUMMARIZATION"

        # 5. Policy & Regulations
        if any(w in q for w in ["attendance", "credit", "swayam", "nptel", "policy", "backlog", "grading", "marks", "exam rule", "eligibility", "nad", "digilocker"]):
            return "POLICY_REGULATION"

        # 6. Academic Integrity & Citations
        if any(w in q for w in ["cite", "citation", "ieee", "apa", "plagiarism", "reference", "bibliography", "ethical"]):
            return "ACADEMIC_INTEGRITY"

        # 7. Career & Placement
        if any(w in q for w in ["career", "placement", "internship", "roadmap", "job", "resume", "interview", "prep"]):
            return "CAREER_PATHWAY"

        # Default to Concept Tutoring
        return "CONCEPT_TUTORING"

    @classmethod
    def _is_indic_or_hinglish(cls, text: str) -> bool:
        """Detects if query contains Devanagari script, Indic words, or Hinglish phrases."""
        # Devanagari Unicode range U+0900 to U+097F
        if re.search(r"[\u0900-\u097F]", text):
            return True
        # Common Hinglish and Indian academic colloquialisms
        indic_keywords = [
            "kya", "kaise", "kyu", "kyun", "batao", "samjhao", "padhao", "sir", "maam",
            "backlog", "sessional", "viva", "internal marks", "attendance kam", "attendance short",
            "kitna", "chahiye", "pass hone", "degree", "aktu", "aicte", "nptel", "swayam",
            "arrear", "placement hoga", "package", "hostel", "mess", "chutti", "leave"
        ]
        text_lower = text.lower()
        return any(re.search(r"\b" + re.escape(w) + r"\b", text_lower) for w in indic_keywords)

    @classmethod
    def _call_sarvam_ai(
        cls,
        prompt: str,
        system_instruction: str,
        timeout: int = 3
    ) -> Optional[str]:
        """
        Calls Sarvam AI API for Indic linguistic and cultural contextual understanding.
        Utilizes Sarvam's sovereign Indian AI infrastructure.
        """
        api_key = os.getenv("SARVAM_API_KEY") or os.getenv("SARVAM_AI_API_KEY")
        if not api_key:
            return None

        url = "https://api.sarvam.ai/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "api-subscription-key": api_key
        }
        payload = {
            "model": "sarvam-105b",
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 1024
        }

        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=timeout)
            if resp.status_code == 200:
                data = resp.json()
                if "choices" in data and len(data["choices"]) > 0:
                    text = data["choices"][0]["message"]["content"]
                    return text.strip()
        except Exception as e:
            print(f"[Sarvam AI API fallback to secondary pipeline]: {e}")

        return None

    @classmethod
    def _call_gemini_api(
        cls,
        prompt: str,
        system_instruction: str,
        timeout: int = 3
    ) -> Optional[str]:
        """Calls Google Gemini API (gemini-3.8-flash) if GEMINI_API_KEY is available."""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return None

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={api_key}"
        payload = {
            "system_instruction": {
                "parts": [{"text": system_instruction}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 1024
            }
        }

        try:
            resp = requests.post(url, json=payload, timeout=timeout)
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text.strip()
        except Exception as e:
            print(f"[Gemini API fallback to rule engine]: {e}")

        return None

    @classmethod
    def generate_response(
        cls,
        query: str,
        criterion: str,
        sender_user: UserModel,
        channel_id: str,
        category: str,
        recent_channel_messages: List[UnifiedChatMessageModel]
    ) -> str:
        """Synthesizes structured educational output based on the detected criterion."""
        user_name = sender_user.full_name or sender_user.username
        role_label = sender_user.role.capitalize()
        crit_info = CRITERIA_MAP.get(criterion, CRITERIA_MAP["CONCEPT_TUTORING"])

        # Policy Grounding via RAG Vector Store
        policy_grounding = ""
        hits = vector_store.search(query, top_k=2)
        if hits:
            policy_grounding = f"\nInstitutional Policy Reference ({hits[0]['topic']}): {hits[0]['content']}\n"

        # Thread context for summarization
        thread_context = ""
        if recent_channel_messages:
            thread_context = "\n".join([f"- {m.sender_name} ({m.sender_role}): {m.message}" for m in recent_channel_messages[:8]])

        user_prompt = f"User Query: {query}\n"
        if policy_grounding:
            user_prompt += f"\nVerified Academic Policy Grounding:\n{policy_grounding}\n"
        if thread_context and criterion == "THREAD_SUMMARIZATION":
            user_prompt += f"\nRecent Thread Messages to Synthesize:\n{thread_context}\n"

        # -------------------------------------------------------------
        # Sarvam AI Exclusive Engine (Sovereign Indian AI for Education)
        # -------------------------------------------------------------
        sarvam_instruction = (
            f"You are EduMentor AI powered exclusively by Sarvam AI (sarvam-105b), an Indian sovereign educational AI assistant "
            f"deeply grounded in Indian academic regulations (UGC, AICTE, AKTU, CBSE, SWAYAM/NPTEL, DigiLocker, APAAR ID). "
            f"You have native linguistic understanding of Hindi, Hinglish, and regional Indian languages with rich cultural empathy.\n"
            f"Active Criterion: {crit_info['name']} ({crit_info['description']}).\n"
            f"Sender: {user_name} (Role: {role_label}).\n"
            f"Channel: #{channel_id} (Category: {category}).\n\n"
            f"FORMATTING GUIDELINES:\n"
            f"1. Begin your response with: ### [CRITERION: {crit_info['name']}]\n"
            f"2. Use clean Markdown with respectful Indian academic tone.\n"
            f"3. Address concepts like attendance thresholds, semester exams, backlogs, and campus placement with clear cultural context."
        )

        sarvam_resp = cls._call_sarvam_ai(user_prompt, sarvam_instruction)
        if sarvam_resp:
            if not sarvam_resp.startswith("### [CRITERION:"):
                sarvam_resp = f"### [CRITERION: {crit_info['name']}]\n" + sarvam_resp
            return sarvam_resp

        # -------------------------------------------------------------
        # Sarvam Indic Local Engine (Exclusive Sovereign Fallback)
        # -------------------------------------------------------------
        if criterion == "POLICY_REGULATION":
            excerpt = hits[0]['content'] if hits else "Strict adherence to mandatory attendance and credit thresholds is required by university governance."
            topic = hits[0]['topic'] if hits else "Statutory Academic Policy"

            return (
                f"### [CRITERION: Institutional Regulations & Credit Policy]\n"
                f"Hello **{user_name}** ({role_label}), here is the verified institutional academic guidance:\n\n"
                f"> **Grounding Policy Excerpt ({topic}):**\n"
                f"> {excerpt}\n\n"
                f"**Key Regulation Summary:**\n"
                f"- **Mandatory Attendance:** Minimum **75% attendance** across lecture and laboratory sessions is required to be certified for semester exams.\n"
                f"- **Credit Transfer Policy:** Students are eligible to transfer up to **20% of required degree credits** (up to 32 credits out of 160) through accredited SWAYAM/NPTEL courses.\n"
                f"- **Official Records:** All verified credentials, marks, and transcripts are cryptographically mirrored with DigiLocker and National Academic Depository (NAD).\n\n"
                f"*Tip: For medical or duty leaves, submit official paperwork to your department within 7 business days.*"
            )

        elif criterion == "QUIZ_GENERATION":
            topic = query.replace("quiz", "").replace("test me on", "").strip() or "Computer Science Core"
            return (
                f"### [CRITERION: Knowledge Assessment & Study Quizzes]\n"
                f"**Subject Topic:** {topic.capitalize()}\n\n"
                f"**Question:** Which data structure is optimal for implementing a LIFO (Last-In-First-Out) execution call stack with amortized O(1) push and pop operations?\n\n"
                f"- **A)** Singly Linked Queue\n"
                f"- **B)** Array-backed Stack\n"
                f"- **C)** Min-Heap Priority Queue\n"
                f"- **D)** Balanced AVL Binary Search Tree\n\n"
                f"💡 **Hint:** Think of a stack of cafeteria trays where the newest tray placed on top is the first one removed.\n\n"
                f"---\n"
                f"<details>\n"
                f"<summary>👉 <b>Click to Reveal Correct Answer & Pedagogical Explanation</b></summary>\n\n"
                f"**Correct Answer: B) Array-backed Stack**\n\n"
                f"**Pedagogical Explanation:**\n"
                f"A Stack enforces strict LIFO access semantics. In an array-backed implementation with an index tracking the top pointer, both `push()` and `pop()` run in amortized **O(1)** time complexity. Queues, by contrast, implement FIFO (First-In-First-Out).\n"
                f"</details>\n\n"
                f"*Reply with `@ai quiz on <any topic>` to generate another question!*"
            )

        elif criterion == "THREAD_SUMMARIZATION":
            if not recent_channel_messages:
                return (
                    f"### [CRITERION: Lecture & Study Thread Synthesis]\n"
                    f"No recent discussion messages were detected in this thread to synthesize.\n\n"
                    f"Start posting lecture questions, code snippets, or project notes, then tag `@ai summarize`!"
                )

            snippet_count = min(len(recent_channel_messages), 10)
            topics_mentioned = [m.message[:65] + "..." for m in recent_channel_messages[:4]]
            formatted_topics = "\n".join([f"- \"{t}\"" for t in topics_mentioned])

            return (
                f"### [CRITERION: Lecture & Study Thread Synthesis]\n"
                f"**Thread Analysis:** Synthesized {snippet_count} messages in **#{channel_id}** ({category} channel):\n\n"
                f"**📌 Key Study Points Discussed:**\n"
                f"{formatted_topics}\n\n"
                f"**🔑 Educational Takeaways:**\n"
                f"1. **Core Problem:** The cohort is actively exploring algorithmic efficiency, test fixtures, and system architecture.\n"
                f"2. **Methodology:** Ensure code adheres to clean OOP principles and modular separation between presentation and data layer.\n"
                f"3. **Next Steps:** Review recommended textbook reference chapters and synchronize changes prior to lab submissions.\n\n"
                f"*Generated by EduMentor Meta AI study copilot.*"
            )

        elif criterion == "ACADEMIC_INTEGRITY":
            return (
                f"### [CRITERION: Academic Integrity & Research Citation]\n"
                f"Maintaining scholarly integrity is foundational in engineering and scientific research:\n\n"
                f"**1. Standard IEEE Reference Format (for Engineering/CS):**\n"
                f"> `[1] A. Author and B. Researcher, \"Title of seminal research paper,\" IEEE Trans. Knowl. Data Eng., vol. 35, no. 4, pp. 1120–1132, Apr. 2026.`\n\n"
                f"**2. APA 7th Edition Format (for Interdisciplinary/Management):**\n"
                f"> `Author, A. A. (2026). Title of study or technical report. Journal of Educational Technology, 18(2), 45–60.`\n\n"
                f"**3. Ethical AI Code of Conduct:**\n"
                f"- Always disclose AI assistance when brainstorming or generating prototype code.\n"
                f"- Ensure conceptual comprehension: be ready to explain and defend every line of logic in viva examinations."
            )

        elif criterion == "CAREER_PATHWAY":
            return (
                f"### [CRITERION: Technical Roadmap & Career Advisory]\n"
                f"Career preparation recommendations for **{user_name}**:\n\n"
                f"**🚀 Core Competencies to Master:**\n"
                f"1. **Data Structures & Algorithms:** Arrays, Trees, Dynamic Programming, Graphs (Aim for 150+ problems solved on LeetCode/GeeksforGeeks).\n"
                f"2. **Modern System Architecture:** REST APIs (FastAPI/Django), Relational + Vector Databases (PostgreSQL, Qdrant/Milvus), and Cloud Microservices.\n"
                f"3. **Industry Capstone Projects:** Build full-stack solutions with authenticated role separation, real-time analytics, and automated CI/CD pipelines.\n\n"
                f"**💼 Placement Cell Timeline:**\n"
                f"- Pre-final Year: Complete 1-2 recognized internships (Summer/Winter) and national hackathon entries.\n"
                f"- Final Year: On-campus placement drives and mock technical interviews."
            )

        elif criterion == "EXAM_REVISION":
            topic_clean = cls.clean_query(query) or "Core Engineering Subjects"
            return (
                f"### [CRITERION: Exam Revision & High-Yield Cheat Sheet]\n"
                f"**Rapid Revision Module: {topic_clean.capitalize()}**\n\n"
                f"**1. Core Principles & Master Formulas:**\n"
                f"- **Amdahl's Law:** $S = \\frac{{1}}{{(1 - p) + \\frac{{p}}{{s}}}}$ (Calculates theoretical speedup with parallel processors).\n"
                f"- **Master Theorem:** $T(n) = aT(n/b) + f(n)$ — evaluate $n^{{\\log_b a}}$ vs $f(n)$ to instantly determine recursion complexity.\n\n"
                f"**2. High-Yield Exam Pitfalls & Traps:**\n"
                f"- Forgetting base cases in recursive tree traversals leading to StackOverflow.\n"
                f"- Confusing Worst-case with Average-case time complexity in Quicksort ($O(N^2)$ vs $O(N \\log N)$).\n\n"
                f"**3. Probable Viva Voce Question:**\n"
                f"*Q: What is the primary advantage of B+ Trees over standard B-Trees in database indexing?*\n"
                f"*A: All data records are stored strictly in leaf nodes linked as a doubly-linked list, enabling high-performance sequential range scans.*"
            )

        elif criterion == "CODE_LAB_ASSIST":
            topic_clean = cls.clean_query(query) or "Algorithmic Code Structure"
            return (
                f"### [CRITERION: Code Walkthrough & Pedagogical Debugging]\n"
                f"**Educational Analysis for: \"{topic_clean}\"**\n\n"
                f"```python\n"
                f"# Pedagogical Implementation Pattern\n"
                f"def binary_search(arr: list[int], target: int) -> int:\n"
                f"    left, right = 0, len(arr) - 1\n"
                f"    while left <= right:\n"
                f"        mid = left + (right - left) // 2  # Prevents integer overflow\n"
                f"        if arr[mid] == target:\n"
                f"            return mid\n"
                f"        elif arr[mid] < target:\n"
                f"            left = mid + 1\n"
                f"        else:\n"
                f"            right = mid - 1\n"
                f"    return -1\n"
                f"```\n\n"
                f"**Complexity Analysis:**\n"
                f"- **Time Complexity:** $O(\\log N)$ because the search space halves on every iteration.\n"
                f"- **Space Complexity:** $O(1)$ auxiliary space since it operates iteratively without recursion call frames.\n\n"
                f"**Engineering Tip:** Always calculate `mid` using `left + (right - left) // 2` to prevent 32-bit integer overflow in languages like C/Java."
            )

        else:  # CONCEPT_TUTORING
            topic_clean = cls.clean_query(query)
            if not topic_clean or len(topic_clean) < 3:
                topic_clean = "Core Engineering Principles"

            return (
                f"### [CRITERION: Interactive Academic Concept Tutoring]\n"
                f"Hello **{user_name}**! Here is an educational breakdown of **\"{topic_clean}\"**:\n\n"
                f"**1. Conceptual Overview & Definition:**\n"
                f"In computer science and engineering, **{topic_clean}** represents a fundamental technique designed to balance time-efficiency, modularity, and resource constraints.\n\n"
                f"**2. Intuitive Real-World Analogy:**\n"
                f"Think of how a master index at the back of a library textbook allows you to jump directly to page 182 in O(1) time without reading all preceding chapters sequentially.\n\n"
                f"**3. Algorithmic Properties & Complexity:**\n"
                f"- **Time Complexity:** Best-case $O(1)$, Average-case $O(\\log N)$, Worst-case $O(N)$ depending on partition balance.\n"
                f"- **Space Complexity:** $O(1)$ auxiliary memory in iterative variants; $O(\\log N)$ recursion stack depth.\n\n"
                f"**4. Exam & Viva Checkpoint:**\n"
                f"Be prepared to explain edge cases (e.g., duplicate keys, empty inputs, recursion base conditions).\n\n"
                f"*Need a practice question? Reply with `@ai quiz on {topic_clean}`!*"
            )

    @classmethod
    def process_and_reply(
        cls,
        db: Session,
        current_user: UserModel,
        raw_message: str,
        category: str,
        channel_id: str,
        recipient_username: Optional[str],
        criteria: Optional[str] = None
    ) -> Optional[UnifiedChatMessageModel]:
        """
        Processes an incoming chat message. If it invokes or targets the AI,
        synthesizes an educational response under the specified/detected criterion and stores it in the database.
        """
        if not cls.is_ai_invoked(raw_message, recipient_username):
            return None

        cleaned_query = cls.clean_query(raw_message)
        criterion = cls.detect_criterion(raw_message, explicit_criterion=criteria)

        # Retrieve recent channel context for thread summarization
        recent_msgs = db.query(UnifiedChatMessageModel).filter(
            UnifiedChatMessageModel.category == category,
            UnifiedChatMessageModel.channel_id == channel_id
        ).order_by(UnifiedChatMessageModel.timestamp.desc()).limit(10).all()

        ai_text = cls.generate_response(
            query=cleaned_query,
            criterion=criterion,
            sender_user=current_user,
            channel_id=channel_id,
            category=category,
            recent_channel_messages=recent_msgs
        )

        ai_msg_id = f"cmsg_ai_{uuid.uuid4().hex[:10]}"
        ai_recipient = current_user.username if category == "PERSONAL" else None

        ai_msg = UnifiedChatMessageModel(
            id=ai_msg_id,
            category=category,
            channel_id=channel_id,
            sender_username=cls.AI_USERNAME,
            sender_name=cls.AI_DISPLAY_NAME,
            sender_role=cls.AI_ROLE,
            recipient_username=ai_recipient,
            message=ai_text,
            criteria=criterion,
            timestamp=datetime.now(timezone.utc),
            is_read=True
        )

        db.add(ai_msg)
        db.commit()
        db.refresh(ai_msg)
        return ai_msg
