"""En usuarios se admite lanzar HTTPException desde el Service (estilo del proyecto de seguridad)."""

from fastapi import HTTPException

from app.modules.usuarios.schemas import UserPublic
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class UsuarioService:
    def __init__(self, uow: UsuarioUnitOfWork):
        self.uow = uow

    def listar(self) -> list[UserPublic]:
        with self.uow as uow:
            return [UserPublic.model_validate(u) for u in uow.usuarios.list_ordenados()]

    def cambiar_estado(self, usuario_id: int, disabled: bool, admin_id: int) -> UserPublic:
        """Activar y desactivar son idempotentes: responden 200 aunque el estado no cambie."""
        with self.uow as uow:
            usuario = uow.usuarios.get_by_id(usuario_id)
            if usuario is None:
                raise HTTPException(404, detail='Usuario no encontrado')
            if disabled and usuario.id == admin_id:
                raise HTTPException(400, detail='No podés desactivarte a vos mismo')
            usuario.disabled = disabled
            uow.usuarios.add(usuario)
            return UserPublic.model_validate(usuario)
