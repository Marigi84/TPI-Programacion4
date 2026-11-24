from fastapi import APIRouter, Depends, HTTPException, Response

from app.core.deps import require_role
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.service import (CategoriaInvalida, CategoriaNoEncontrada,
                                            CategoriaService, NombreDuplicado)
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork
from app.modules.usuarios.models import Usuario

router = APIRouter(prefix='/categorias', tags=['Categorías'])
solo_admin = require_role(['admin'])


def get_categoria_service() -> CategoriaService:
    return CategoriaService(CategoriaUnitOfWork())


def traducir(error: Exception) -> HTTPException:
    """Traduce las excepciones de dominio a códigos HTTP."""
    if isinstance(error, CategoriaNoEncontrada):
        return HTTPException(404, detail=str(error))
    if isinstance(error, NombreDuplicado):
        return HTTPException(409, detail=str(error))
    return HTTPException(422, detail=str(error))  # CategoriaInvalida


@router.get('', response_model=list[CategoriaRead])
def listar(service: CategoriaService = Depends(get_categoria_service)):
    return service.listar()


@router.get('/{categoria_id}', response_model=CategoriaRead)
def obtener(categoria_id: int, service: CategoriaService = Depends(get_categoria_service)):
    try:
        return service.obtener(categoria_id)
    except CategoriaNoEncontrada as error:
        raise traducir(error) from error


@router.post('', response_model=CategoriaRead, status_code=201)
def crear(datos: CategoriaCreate, _admin: Usuario = Depends(solo_admin),
          service: CategoriaService = Depends(get_categoria_service)):
    try:
        return service.crear(datos)
    except (NombreDuplicado, CategoriaInvalida) as error:
        raise traducir(error) from error


@router.put('/{categoria_id}', response_model=CategoriaRead)
def actualizar(categoria_id: int, datos: CategoriaUpdate, _admin: Usuario = Depends(solo_admin),
               service: CategoriaService = Depends(get_categoria_service)):
    try:
        return service.actualizar(categoria_id, datos)
    except (CategoriaNoEncontrada, NombreDuplicado, CategoriaInvalida) as error:
        raise traducir(error) from error


@router.delete('/{categoria_id}', status_code=204)
def eliminar(categoria_id: int, _admin: Usuario = Depends(solo_admin),
             service: CategoriaService = Depends(get_categoria_service)):
    try:
        service.eliminar(categoria_id)
    except CategoriaNoEncontrada as error:
        raise traducir(error) from error
    return Response(status_code=204)
