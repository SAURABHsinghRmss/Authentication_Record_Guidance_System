from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from backend.models.models import StudentORM

class SISRepository:
    @staticmethod
    async def get_student_by_roll_no(db: AsyncSession, roll_no: str) -> StudentORM | None:
        result = await db.execute(select(StudentORM).where(StudentORM.roll_no == roll_no))
        return result.scalars().first()

    @staticmethod
    async def get_all_students(db: AsyncSession) -> list[StudentORM]:
        result = await db.execute(select(StudentORM))
        return list(result.scalars().all())

    @staticmethod
    async def create_student(db: AsyncSession, student_data: dict) -> StudentORM:
        student = StudentORM(**student_data)
        db.add(student)
        await db.flush()
        await db.refresh(student)
        return student
