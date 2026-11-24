from fastapi import APIRouter, Depends, HTTPException, Query, Response

from app.core.deps import require_role
from app.modules.productos.schemas import (ProductoCreate, ProductoRead, ProductosPaginados,
                                           ProductoStockUpdate, ProductoUpdate)
from app.modules.productos.service import (CategoriaNoEncontrada, ProductoNoEncontrado,
                                           ProductoService)
from app.modules.productos.unit_of_work import ProductoUnitOfWork
from app.modules.usuarios.models import Usuario

router = APIRouter(prefix='/productos', tags=['Productos'])
solo_admin = require_role(['admin'])


def get_producto_service() -> ProductoService:
    return ProductoService(ProductoUnitOfWork())


@router.get('', response_model=ProductosPaginados)
def listar(skip: int = Query(0, ge=0), limit: int = Query(20, ge=1, le=100),
           search: str | None = None, categoria_id: int | None = None,
           disponible: bool | None = None,
           service: ProductoService = Depends(get_producto_service)):
    return service.listar(skip, limit, search, categoria_id, disponible)


@router.get('/{producto_id}', response_model=ProductoRead)
def obtener(producto_id: int, service: ProductoService = Depends(get_producto_service)):
    try:
        return service.obtener(producto_id)
    except ProductoNoEncontrado as error:
        raise HTTPException(404, detail=str(error)) from error


@router.post('', status_code=201, response_model=ProductoRead)
def crear(datos: ProductoCreate, _admin: Usuario = Depends(solo_admin),
          service: ProductoService = Depends(get_producto_service)):
    try:
        return service.crear(datos)
    except CategoriaNoEncontrada as error:
        raise HTTPException(404, detail=str(error)) from error


@router.put('/{producto_id}', response_model=ProductoRead)
def actualizar(producto_id: int, datos: ProductoUpdate, _admin: Usuario = Depends(solo_admin),
               service: ProductoService = Depends(get_producto_service)):
    try:
        return service.actualizar(producto_id, datos)
    except (ProductoNoEncontrado, CategoriaNoEncontrada) as error:
        raise HTTPException(404, detail=str(error)) from error


@router.patch('/{producto_id}/stock', response_model=ProductoRead)
def cambiar_stock(producto_id: int, datos: ProductoStockUpdate,
                  _admin: Usuario = Depends(solo_admin),
                  service: ProductoService = Depends(get_producto_service)):
    try:
        return service.cambiar_stock(producto_id, datos)
    except ProductoNoEncontrado as error:
        raise HTTPException(404, detail=str(error)) from error


@router.delete('/{producto_id}', status_code=204)
def eliminar(producto_id: int, _admin: Usuario = Depends(solo_admin),
             service: ProductoService = Depends(get_producto_service)):
    try:
        service.eliminar(producto_id)
    except ProductoNoEncontrado as error:
        raise HTTPException(404, detail=str(error)) from error
    return Response(status_code=204)
