from app.modules.categorias.models import Categoria
from app.modules.categorias.schemas import CategoriaCreate, CategoriaRead, CategoriaUpdate
from app.modules.categorias.unit_of_work import CategoriaUnitOfWork


class CategoriaNoEncontrada(Exception):
    pass


class NombreDuplicado(Exception):
    pass


class CategoriaInvalida(Exception):
    pass


class CategoriaService:
    def __init__(self, uow: CategoriaUnitOfWork):
        self.uow = uow

    @staticmethod
    def _activa(uow: CategoriaUnitOfWork, item_id: int) -> Categoria:
        """Una categoría dada de baja se trata como inexistente."""
        categoria = uow.categorias.get_by_id(item_id)
        if categoria is None or not categoria.activo:
            raise CategoriaNoEncontrada('Categoría no encontrada')
        return categoria

    @staticmethod
    def _validar_nombre(uow: CategoriaUnitOfWork, nombre: str, item_id: int | None = None) -> str:
        nombre = nombre.strip()
        if len(nombre) < 2:
            raise CategoriaInvalida('El nombre debe tener al menos 2 caracteres')
        existente = uow.categorias.get_by_nombre(nombre)
        if existente and existente.id != item_id:
            raise NombreDuplicado('Ya existe una categoría con ese nombre')
        return nombre

    def listar(self) -> list[CategoriaRead]:
        with self.uow as uow:
            return [CategoriaRead.model_validate(c) for c in uow.categorias.list_activas()]

    def obtener(self, item_id: int) -> CategoriaRead:
        with self.uow as uow:
            return CategoriaRead.model_validate(self._activa(uow, item_id))

    def crear(self, datos: CategoriaCreate) -> CategoriaRead:
        with self.uow as uow:
            nombre = self._validar_nombre(uow, datos.nombre)
            categoria = uow.categorias.add(Categoria(nombre=nombre, descripcion=datos.descripcion))
            return CategoriaRead.model_validate(categoria)

    def actualizar(self, item_id: int, datos: CategoriaUpdate) -> CategoriaRead:
        """PUT parcial: actualiza solo los campos enviados."""
        with self.uow as uow:
            categoria = self._activa(uow, item_id)
            cambios = datos.model_dump(exclude_unset=True)
            if 'nombre' in cambios:
                cambios['nombre'] = self._validar_nombre(uow, cambios['nombre'], item_id)
            for campo, valor in cambios.items():
                setattr(categoria, campo, valor)
            uow.categorias.add(categoria)
            return CategoriaRead.model_validate(categoria)

    def eliminar(self, item_id: int) -> None:
        """Baja lógica: no libera el nombre único ni oculta sus productos."""
        with self.uow as uow:
            categoria = self._activa(uow, item_id)
            categoria.activo = False
            uow.categorias.add(categoria)
