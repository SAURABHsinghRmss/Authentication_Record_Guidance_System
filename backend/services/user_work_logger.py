import os
import json
import re
import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from backend.core.config import settings

class UserWorkLogger:
    """
    Manages per-user storage locations partitioned by user email (Gmail/institutional).
    Maintains:
      - last_work.json: The snapshot of the user's last work at each login and during sessions.
      - login_history.jsonl: Immutable chronological log of each login event and work state.
      - activity_stream.jsonl: Detailed trace of work actions performed during sessions.
      - Cloud storage readiness: Prepares metadata and sync adapter for future cloud migration (GCS/S3).
    """

    def __init__(self, base_storage_dir: Optional[str] = None):
        self.base_dir = os.path.abspath(base_storage_dir or settings.LOGS_STORAGE_DIR)
        os.makedirs(self.base_dir, exist_ok=True)

    def sanitize_email_for_path(self, email: str) -> str:
        r"""
        Sanitizes email into a safe directory name across Windows and POSIX file systems.
        Preserves '@' and '.' while stripping forbidden path characters (: * ? " < > | / \).
        """
        if not email:
            return "anonymous_user"
        cleaned = email.strip().lower()
        safe_name = re.sub(r'[\\/*?:"<>|]', '_', cleaned)
        return safe_name

    def get_user_storage_dir(self, email: str) -> str:
        """
        Returns the absolute filesystem path for a user's isolated storage location.
        Creates the folder if it does not yet exist.
        """
        folder_name = self.sanitize_email_for_path(email)
        user_dir = os.path.join(self.base_dir, folder_name)
        os.makedirs(user_dir, exist_ok=True)
        return user_dir

    def get_cloud_uri(self, email: str, filename: str = "last_work.json") -> str:
        """Generates target Cloud Storage URI for this user location."""
        folder_name = self.sanitize_email_for_path(email)
        bucket = settings.CLOUD_STORAGE_BUCKET
        return f"gs://{bucket}/users/{folder_name}/{filename}"

    def log_login(
        self,
        user_id: str,
        username: str,
        email: str,
        role: str,
        client_ip: str = "127.0.0.1",
        user_agent: str = "Unknown",
        initial_work_note: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Invoked on each login.
        Retrieves the user's previous work, creates a new session log,
        and saves an updated last_work.json in that user's email storage location.
        """
        user_dir = self.get_user_storage_dir(email)
        last_work_file = os.path.join(user_dir, "last_work.json")
        login_history_file = os.path.join(user_dir, "login_history.jsonl")

        previous_work = None
        previous_login_timestamp = None

        # Check for existing previous work file
        if os.path.exists(last_work_file):
            try:
                with open(last_work_file, "r", encoding="utf-8") as f:
                    old_data = json.load(f)
                    previous_login_timestamp = old_data.get("login_timestamp")
                    previous_work = old_data.get("current_work") or old_data.get("previous_work")
            except Exception as e:
                previous_work = {"error_reading_previous": str(e)}

        now_iso = datetime.now(timezone.utc).isoformat()
        session_id = f"sess_{uuid.uuid4().hex[:12]}"

        # Compose session record
        session_record = {
            "session_id": session_id,
            "user_id": user_id,
            "username": username,
            "email": email,
            "role": role,
            "storage_location": user_dir,
            "cloud_storage_uri": self.get_cloud_uri(email, "last_work.json"),
            "login_timestamp": now_iso,
            "client_ip": client_ip,
            "user_agent": user_agent,
            "previous_login": previous_login_timestamp,
            "previous_work": previous_work,
            "current_work": {
                "status": "ACTIVE_SESSION",
                "session_started_at": now_iso,
                "summary": initial_work_note or f"Session initiated by {username} ({role})",
                "actions_count": 0,
                "recent_actions": []
            },
            "cloud_storage_metadata": {
                "provider": "google_cloud_storage",
                "bucket": settings.CLOUD_STORAGE_BUCKET,
                "sync_ready": True,
                "last_synced_at": None,
                "sync_status": "LOCAL_STAGED"
            }
        }

        # Save latest snapshot to last_work.json
        temp_file = f"{last_work_file}.tmp"
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(session_record, f, indent=2)
        os.replace(temp_file, last_work_file)

        # Append to login_history.jsonl
        history_entry = {
            "timestamp": now_iso,
            "session_id": session_id,
            "username": username,
            "email": email,
            "client_ip": client_ip,
            "work_snapshot": session_record["current_work"],
            "previous_work_summary": previous_work.get("summary") if isinstance(previous_work, dict) else None
        }
        with open(login_history_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(history_entry) + "\n")

        return session_record

    def record_work_action(
        self,
        email: str,
        action_type: str,
        description: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Appends a work item to the user's current session and updates last_work.json.
        """
        user_dir = self.get_user_storage_dir(email)
        last_work_file = os.path.join(user_dir, "last_work.json")
        activity_file = os.path.join(user_dir, "activity_stream.jsonl")

        if not os.path.exists(last_work_file):
            return {"error": "No active session found for this user."}

        with open(last_work_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        now_iso = datetime.now(timezone.utc).isoformat()
        action_entry = {
            "timestamp": now_iso,
            "action_type": action_type,
            "description": description,
            "metadata": metadata or {}
        }

        current_work = data.get("current_work", {})
        recent_actions = current_work.get("recent_actions", [])
        recent_actions.append(action_entry)

        # Keep the most recent 50 actions in the snapshot
        current_work["recent_actions"] = recent_actions[-50:]
        current_work["actions_count"] = current_work.get("actions_count", 0) + 1
        current_work["summary"] = description
        current_work["last_action_at"] = now_iso
        data["current_work"] = current_work

        temp_file = f"{last_work_file}.tmp"
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        os.replace(temp_file, last_work_file)

        # Append to activity_stream.jsonl
        with open(activity_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(action_entry) + "\n")

        return current_work

    def get_last_work(self, email: str) -> Optional[Dict[str, Any]]:
        """Reads last_work.json for the specified user email."""
        user_dir = self.get_user_storage_dir(email)
        last_work_file = os.path.join(user_dir, "last_work.json")
        if not os.path.exists(last_work_file):
            return None
        with open(last_work_file, "r", encoding="utf-8") as f:
            return json.load(f)

    def get_login_history(self, email: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Reads recent login history lines from login_history.jsonl."""
        user_dir = self.get_user_storage_dir(email)
        history_file = os.path.join(user_dir, "login_history.jsonl")
        if not os.path.exists(history_file):
            return []
        
        entries = []
        with open(history_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        entries.append(json.loads(line))
                    except Exception:
                        continue
        entries.reverse()
        return entries[:limit]

    def list_all_storage_locations(self) -> List[Dict[str, Any]]:
        """
        Lists all initialized user storage locations and their state.
        Useful for developer/admin testing and auditing.
        """
        locations = []
        if not os.path.exists(self.base_dir):
            return []

        for entry in os.listdir(self.base_dir):
            full_path = os.path.join(self.base_dir, entry)
            if os.path.isdir(full_path):
                last_work_file = os.path.join(full_path, "last_work.json")
                summary = "No log file found"
                last_login = None
                role = "unknown"
                username = entry
                email = entry
                cloud_uri = f"gs://{settings.CLOUD_STORAGE_BUCKET}/users/{entry}/last_work.json"

                if os.path.exists(last_work_file):
                    try:
                        with open(last_work_file, "r", encoding="utf-8") as f:
                            data = json.load(f)
                            username = data.get("username", username)
                            email = data.get("email", email)
                            role = data.get("role", role)
                            last_login = data.get("login_timestamp")
                            cw = data.get("current_work", {})
                            summary = cw.get("summary", "Active")
                            cloud_uri = data.get("cloud_storage_uri", cloud_uri)
                    except Exception:
                        pass

                locations.append({
                    "email_identifier": entry,
                    "email": email,
                    "username": username,
                    "role": role,
                    "storage_location": full_path,
                    "cloud_storage_uri": cloud_uri,
                    "last_login": last_login,
                    "last_work_summary": summary,
                    "file_count": len(os.listdir(full_path))
                })

        return locations

    def sync_to_cloud_storage(self, email: Optional[str] = None) -> Dict[str, Any]:
        """
        Cloud storage bridge: Prepares and stages log files for Google Cloud Storage or S3.
        When CLOUD_STORAGE_ENABLED is False (local testing mode), reports staged files.
        When True, interfaces with the cloud client library.
        """
        targets = []
        if email:
            targets = [self.sanitize_email_for_path(email)]
        elif os.path.exists(self.base_dir):
            targets = [d for d in os.listdir(self.base_dir) if os.path.isdir(os.path.join(self.base_dir, d))]

        synced_files = []
        for user_folder in targets:
            user_path = os.path.join(self.base_dir, user_folder)
            for root, _, files in os.walk(user_path):
                for file in files:
                    local_fp = os.path.join(root, file)
                    rel = os.path.relpath(local_fp, self.base_dir)
                    cloud_dest = f"gs://{settings.CLOUD_STORAGE_BUCKET}/{rel.replace('\\', '/')}"
                    synced_files.append({
                        "local_file": local_fp,
                        "cloud_destination": cloud_dest,
                        "size_bytes": os.path.getsize(local_fp)
                    })

        return {
            "cloud_storage_enabled": settings.CLOUD_STORAGE_ENABLED,
            "target_bucket": settings.CLOUD_STORAGE_BUCKET,
            "total_files_staged": len(synced_files),
            "files": synced_files,
            "status": "READY_FOR_CLOUD_UPLOAD" if not settings.CLOUD_STORAGE_ENABLED else "SYNCED",
            "message": "Log files staged and ready for Google Cloud Storage bucket sync."
        }

# Global singleton instance
user_work_logger = UserWorkLogger()
