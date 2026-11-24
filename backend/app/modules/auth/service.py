"""Auth usa el modelo y el repositorio de usuarios. Se admite HTTPException en este Service."""

from fastapi import HTTPException

from app.core.security import create_access_token, hash_password, verify_password
from app.modules.auth.schemas import UserCreate, UserPublic
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class AuthService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def registrar(self, datos: UserCreate) -> UserPublic:
        """El registro público siempre crea usuarios con rol 'user'."""
        username, full_name = datos.username.strip(), datos.full_name.strip()
        if not username or not full_name:
            raise HTTPException(422, detail='Nombre de usuario y nombre son obligatorios')
        with self.uow as uow:
            if uow.usuarios.get_by_username(username) or uow.usuarios.get_by_email(datos.email):
                raise HTTPException(409, detail='Username o email ya registrado')
            usuario = uow.usuarios.add(Usuario(username=username, full_name=full_name,
                                               email=datos.email,
                                               hashed_password=hash_password(datos.password)))
            return UserPublic.model_validate(usuario)

    def login(self, username: str, password: str) -> str:
        """Devuelve el JWT; el router lo pone en la cookie, nunca en el cuerpo."""
        with self.uow as uow:
            usuario = uow.usuarios.get_by_username(username.strip())
            if usuario is None or not verify_password(password, usuario.hashed_password):
                raise HTTPException(401, detail='Credenciales incorrectas')
            if usuario.disabled:
                raise HTTPException(400, detail='Cuenta de usuario desactivada')
            return create_access_token(usuario.id)
