from fastapi import APIRouter, Depends

from app.core.deps import require_role
from app.modules.usuarios.models import Usuario
from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.service import UsuarioService
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork

router = APIRouter(prefix='/admin/usuarios', tags=['Usuarios'])
solo_admin = require_role(['admin'])


def get_usuario_service() -> UsuarioService:
    return UsuarioService(UsuarioUnitOfWork())


@router.get('', response_model=list[UserPublic])
def listar_usuarios(_admin: Usuario = Depends(solo_admin),
                    service: UsuarioService = Depends(get_usuario_service)):
    return service.listar()


@router.post('/{usuario_id}/activar', response_model=UserPublic)
def activar(usuario_id: int, admin: Usuario = Depends(solo_admin),
            service: UsuarioService = Depends(get_usuario_service)):
    return service.cambiar_estado(usuario_id, False, admin.id)


@router.post('/{usuario_id}/desactivar', response_model=UserPublic)
def desactivar(usuario_id: int, admin: Usuario = Depends(solo_admin),
               service: UsuarioService = Depends(get_usuario_service)):
    return service.cambiar_estado(usuario_id, True, admin.id)
