from typing import Annotated

from fastapi import Cookie, Depends, HTTPException
from sqlmodel import Session

from app.core.database import get_session
from app.core.security import TokenInvalido, decode_access_token
from app.modules.usuarios.models import Usuario

SESION_INVALIDA = 'Sesión inválida o vencida'


def get_current_user(access_token: Annotated[str | None, Cookie()] = None,
                     session: Session = Depends(get_session)) -> Usuario:
    """Lee la cookie HttpOnly, valida el JWT y carga el usuario."""
    if not access_token:
        raise HTTPException(401, detail=SESION_INVALIDA)
    try:
        usuario_id = decode_access_token(access_token)
    except TokenInvalido:
        raise HTTPException(401, detail=SESION_INVALIDA) from None
    usuario = session.get(Usuario, usuario_id)
    if usuario is None:
        raise HTTPException(401, detail=SESION_INVALIDA)
    return usuario


def get_current_active_user(usuario: Usuario = Depends(get_current_user)) -> Usuario:
    if usuario.disabled:
        raise HTTPException(400, detail='Cuenta de usuario desactivada')
    return usuario


def require_role(roles: list[str]):
    def check(usuario: Usuario = Depends(get_current_active_user)) -> Usuario:
        if usuario.role not in roles:
            raise HTTPException(403, detail='No tenés permiso para esta operación')
        return usuario
    return check
