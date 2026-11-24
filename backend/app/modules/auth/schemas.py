from sqlmodel import SQLModel

# El registro y el perfil reutilizan los schemas del módulo usuarios.
from app.modules.usuarios.schemas import UserCreate, UserPublic


class MensajeResponse(SQLModel):
    message: str


__all__ = ['UserCreate', 'UserPublic', 'MensajeResponse']
