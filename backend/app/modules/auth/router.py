from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm

from app.core.config import settings
from app.core.deps import get_current_active_user
from app.modules.auth.schemas import MensajeResponse, UserCreate, UserPublic
from app.modules.auth.service import AuthService
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix='/auth', tags=['Autenticación'])
COOKIE = 'access_token'


def get_auth_service() -> AuthService:
    return AuthService(UsuarioUnitOfWork())


@router.post('/register', status_code=201, response_model=UserPublic)
def register(datos: UserCreate, service: AuthService = Depends(get_auth_service)):
    return service.registrar(datos)


@router.post('/token', response_model=MensajeResponse)
def token(response: Response, datos: OAuth2PasswordRequestForm = Depends(),
          service: AuthService = Depends(get_auth_service)):
    jwt = service.login(datos.username, datos.password)
    response.set_cookie(COOKIE, jwt, httponly=True, samesite='lax',
                        secure=settings.COOKIE_SECURE, path='/',
                        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    return MensajeResponse(message='Login exitoso')


@router.post('/logout', response_model=MensajeResponse)
def logout(response: Response):
    response.delete_cookie(COOKIE, path='/', samesite='lax', secure=settings.COOKIE_SECURE)
    return MensajeResponse(message='Sesión cerrada')


@router.get('/me', response_model=UserPublic)
def me(usuario: Usuario = Depends(get_current_active_user)):
    return UserPublic.model_validate(usuario)
