from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from app.modules.categorias.models import Categoria

if TYPE_CHECKING:
    from app.modules.pedidos.models import DetallePedido


class Producto(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    categoria_id: int = Field(foreign_key='categoria.id', index=True)
    nombre: str
    descripcion: str = ''
    precio_base: float  # >= 0, validado en schemas y Service
    imagen_url: str = ''
    stock: int = Field(default=0)  # >= 0
    disponible: bool = Field(default=True)
    activo: bool = Field(default=True)  # baja lógica

    categoria: Categoria = Relationship(back_populates='productos')
    detalles: list['DetallePedido'] = Relationship(back_populates='producto')
