from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.deps import get_current_active_user, require_role
from app.modules.pedidos.schemas import (CambioEstado, EstadoPedido, PedidoCreate, PedidoRead,
                                         PedidosPaginados, ResumenPedidos)
from app.modules.pedidos.service import (PedidoAjeno, PedidoNoEncontrado, PedidoService,
                                         ProductoNoEncontrado, ReglaPedidoError)
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork
from app.modules.usuarios.models import Usuario

router = APIRouter(prefix='/pedidos', tags=['Pedidos'])


def get_pedido_service() -> PedidoService:
    return PedidoService(PedidoUnitOfWork())


def traducir(error: Exception) -> HTTPException:
    if isinstance(error, (PedidoNoEncontrado, ProductoNoEncontrado)):
        return HTTPException(404, detail=str(error))
    if isinstance(error, PedidoAjeno):
        return HTTPException(403, detail=str(error))
    return HTTPException(400, detail=str(error))


ERRORES = (PedidoNoEncontrado, ProductoNoEncontrado, PedidoAjeno, ReglaPedidoError)


@router.post('', response_model=PedidoRead, status_code=201)
def crear(datos: PedidoCreate, usuario: Usuario = Depends(get_current_active_user),
          service: PedidoService = Depends(get_pedido_service)):
    try:
        return service.crear(datos, usuario.id)
    except ERRORES as error:
        raise traducir(error) from error


@router.get('', response_model=PedidosPaginados)
def listar(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100),
           estado: EstadoPedido | None = None,
           usuario: Usuario = Depends(get_current_active_user),
           service: PedidoService = Depends(get_pedido_service)):
    return service.listar(usuario.id, usuario.role == 'admin', skip, limit, estado)


# Se declara antes de /{pedido_id} para que "resumen" no se tome como un id.
@router.get('/resumen', response_model=ResumenPedidos)
def resumen(_admin: Usuario = Depends(require_role(['admin'])),
            service: PedidoService = Depends(get_pedido_service)):
    return service.resumen()


@router.get('/{pedido_id}', response_model=PedidoRead)
def obtener(pedido_id: int, usuario: Usuario = Depends(get_current_active_user),
            service: PedidoService = Depends(get_pedido_service)):
    try:
        return service.obtener(pedido_id, usuario.id, usuario.role == 'admin')
    except ERRORES as error:
        raise traducir(error) from error


@router.patch('/{pedido_id}/estado', response_model=PedidoRead)
def cambiar_estado(pedido_id: int, datos: CambioEstado,
                   _admin: Usuario = Depends(require_role(['admin'])),
                   service: PedidoService = Depends(get_pedido_service)):
    try:
        return service.cambiar_estado(pedido_id, datos.estado)
    except ERRORES as error:
        raise traducir(error) from error


@router.patch('/{pedido_id}/cancelar', response_model=PedidoRead)
def cancelar(pedido_id: int, usuario: Usuario = Depends(get_current_active_user),
             service: PedidoService = Depends(get_pedido_service)):
    try:
        return service.cancelar(pedido_id, usuario.id)
    except ERRORES as error:
        raise traducir(error) from error
