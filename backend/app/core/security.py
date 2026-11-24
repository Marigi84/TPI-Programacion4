from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

password_context = CryptContext(schemes=['bcrypt'], deprecated='auto')


class TokenInvalido(Exception):
    """El token falta, está mal firmado, venció o no tiene el formato esperado."""


def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return password_context.verify(password, hashed)


def create_access_token(usuario_id: int) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode({'sub': str(usuario_id), 'exp': expires}, settings.SECRET_KEY,
                      algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> int:
    """Valida firma y expiración y devuelve el id del usuario guardado en 'sub'."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return int(payload['sub'])
    except (JWTError, KeyError, TypeError, ValueError) as error:
        raise TokenInvalido('Token inválido o vencido') from error
