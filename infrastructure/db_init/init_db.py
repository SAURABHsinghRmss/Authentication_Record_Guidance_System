import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATABASES_DIR = os.path.join(BASE_DIR, "databases")

DB_FILES = [
    "academic_sis.db",
    "auth_iam.db",
    "career_pathways.db",
    "family_heritage.db",
    "institutions_governance.db",
    "notifications_events.db",
    "security_audit.db"
]

def init_databases():
    os.makedirs(DATABASES_DIR, exist_ok=True)
    print("[*] Initializing federated SQLite databases...")
    
    for db_file in DB_FILES:
        db_path = os.path.join(DATABASES_DIR, db_file)
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Enable foreign keys
        cursor.execute("PRAGMA foreign_keys = ON;")
        
        if db_file == "academic_sis.db":
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS students (
                    id TEXT PRIMARY KEY,
                    roll_no TEXT UNIQUE,
                    name TEXT,
                    email TEXT UNIQUE,
                    department TEXT,
                    semester TEXT,
                    cgpa REAL,
                    attendance_percentage REAL,
                    credits_earned INTEGER,
                    max_credits INTEGER DEFAULT 160,
                    backlogs INTEGER DEFAULT 0,
                    apaar_id TEXT UNIQUE,
                    digilocker_status TEXT DEFAULT 'VERIFIED',
                    dbt_status TEXT DEFAULT 'ACTIVE',
                    status TEXT DEFAULT 'VERIFIED'
                );
            """)
            cursor.execute("""
                INSERT OR IGNORE INTO students (id, roll_no, name, email, department, semester, cgpa, attendance_percentage, credits_earned, apaar_id)
                VALUES ('std-01', 'CS-2022-04', 'Amit Sharma', 'amit@uni.edu', 'Computer Science & Engineering', 'Semester 6', 8.92, 88.5, 124, '91-4458-9921-3412');
            """)
        elif db_file == "security_audit.db":
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id TEXT PRIMARY KEY,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    username TEXT,
                    role TEXT,
                    action TEXT,
                    details TEXT,
                    ip_address TEXT,
                    severity TEXT DEFAULT 'INFO'
                );
            """)
            cursor.execute("""
                INSERT OR IGNORE INTO audit_logs (id, username, role, action, details, severity)
                VALUES ('audit-init-01', 'admin@uni.edu', 'admin', 'SYSTEM_INIT', 'Federated database initialized successfully.', 'INFO');
            """)
            
        conn.commit()
        conn.close()
        print(f" [+] Initialized & seeded: {db_file}")

    print("[✓] All federated SQLite databases successfully initialized!")

if __name__ == "__main__":
    init_databases()
