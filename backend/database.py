from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from backend.config import settings

Base = declarative_base()

# Create asynchronous engines for each federated database
engines = {
    db_key: create_async_engine(db_url, echo=False, future=True)
    for db_key, db_url in settings.DB_PATHS.items()
}

session_makers = {
    db_key: async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    for db_key, engine in engines.items()
}

async def get_db(db_name: str = "academic_sis"):
    """Dependency for getting database sessions for a specific federated domain."""
    if db_name not in session_makers:
        raise ValueError(f"Unknown database domain: {db_name}")
    async with session_makers[db_name]() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
