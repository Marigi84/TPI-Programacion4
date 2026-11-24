from typing import Generic, TypeVar

from sqlmodel import Session, SQLModel, select

T = TypeVar('T', bound=SQLModel)


class BaseRepository(Generic[T]):
    """Operaciones comunes a todas las tablas. Sin reglas de negocio."""

    def __init__(self, session: Session, model: type[T]):
        self.session = session
        self.model = model

    def get_by_id(self, item_id: int) -> T | None:
        return self.session.get(self.model, item_id)

    def get_all(self) -> list[T]:
        return list(self.session.exec(select(self.model)).all())

    def add(self, item: T) -> T:
        """Agrega o actualiza y hace flush (sin commit) para obtener el id."""
        self.session.add(item)
        self.session.flush()
        return item

    def delete(self, item: T) -> None:
        self.session.delete(item)
