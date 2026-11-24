from sqlmodel import SQLModel, Session, create_engine
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, connect_args={'check_same_thread': False}
                       if settings.DATABASE_URL.startswith('sqlite') else {}, pool_pre_ping=True)


def create_all_tables():
    SQLModel.metadata.create_all(engine)


def session_factory():
    return Session(engine)


def get_session():
    with session_factory() as session:
        yield session
