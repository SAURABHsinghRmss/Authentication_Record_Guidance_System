from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.models.models import AuditLogORM
import uuid

class AuditRepository:
    @staticmethod
    async def log_event(db: AsyncSession, username: str, role: str, action: str, details: str, severity: str = "INFO") -> AuditLogORM:
        log_entry = AuditLogORM(
            id=str(uuid.uuid4()),
            username=username,
            role=role,
            action=action,
            details=details,
            severity=severity
        )
        db.add(log_entry)
        await db.flush()
        await db.refresh(log_entry)
        return log_entry

    @staticmethod
    async def get_audit_trails(db: AsyncSession, limit: int = 50) -> list[AuditLogORM]:
        result = await db.execute(select(AuditLogORM).order_by(AuditLogORM.timestamp.desc()).limit(limit))
        return list(result.scalars().all())
