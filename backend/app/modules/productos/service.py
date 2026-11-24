from app.modules.productos.models import Producto
from app.modules.productos.schemas import (ProductoCreate, ProductoRead, ProductosPaginados,
                                           ProductoStockUpdate, ProductoUpdate)
from app.modules.productos.unit_of_work import ProductoUnitOfWork


class ProductoNoEncontrado(Exception):
    pass


class CategoriaNoEncontrada(Exception):
    pass


class ProductoService:
    def __init__(self, uow: ProductoUnitOfWork):
        self.uow = uow

    @staticmethod
    def _activo(uow: ProductoUnitOfWork, item_id: int) -> Producto:
        producto = uow.productos.get_by_id(item_id)
        if producto is None or not producto.activo:
            raise ProductoNoEncontrado('Producto no encontrado')
        return producto

    @staticmethod
    def _verificar_categoria(uow: ProductoUnitOfWork, categoria_id: int) -> None:
        categoria = uow.categorias.get_by_id(categoria_id)
        if categoria is None or not categoria.activo:
            raise CategoriaNoEncontrada('Categoría no encontrada')

    def listar(self, skip: int, limit: int, search: str | None, categoria_id: int | None,
               disponible: bool | None) -> ProductosPaginados:
        with self.uow as uow:
            total, items = uow.productos.search(skip, limit, search, categoria_id, disponible)
            return ProductosPaginados(total=total,
                                      items=[ProductoRead.model_validate(p) for p in items])

    def obtener(self, item_id: int) -> ProductoRead:
        with self.uow as uow:
            return ProductoRead.model_validate(self._activo(uow, item_id))

    def crear(self, datos: ProductoCreate) -> ProductoRead:
        with self.uow as uow:
            self._verificar_categoria(uow, datos.categoria_id)
            producto = uow.productos.add(Producto(**datos.model_dump()))
            return ProductoRead.model_validate(producto)

    def actualizar(self, item_id: int, datos: ProductoUpdate) -> ProductoRead:
        """PUT parcial: actualiza solo los campos enviados."""
        with self.uow as uow:
            producto = self._activo(uow, item_id)
            cambios = datos.model_dump(exclude_unset=True)
            if 'categoria_id' in cambios:
                self._verificar_categoria(uow, cambios['categoria_id'])
            for campo, valor in cambios.items():
                setattr(producto, campo, valor)
            uow.productos.add(producto)
            return ProductoRead.model_validate(producto)

    def cambiar_stock(self, item_id: int, datos: ProductoStockUpdate) -> ProductoRead:
        with self.uow as uow:
            producto = self._activo(uow, item_id)
            producto.stock = datos.stock
            producto.disponible = datos.disponible
            uow.productos.add(producto)
            return ProductoRead.model_validate(producto)

    def eliminar(self, item_id: int) -> None:
        """Baja lógica."""
        with self.uow as uow:
            producto = self._activo(uow, item_id)
            producto.activo = False
            uow.productos.add(producto)
