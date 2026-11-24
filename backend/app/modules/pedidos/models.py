from datetime import datetime

from sqlmodel import Field, Relationship, SQLModel

from app.core.utils import ahora_utc
from app.modules.productos.models import Producto
from app.modules.usuarios.models import Usuario


class Pedido(SQLModel, table=True):
    """No se borra: se cancela. total = suma de subtotales, fijo desde la creación (RN-05)."""
    id: int | None = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key='usuario.id', index=True)
    estado: str = Field(default='PENDIENTE')
    forma_pago: str  # EFECTIVO | TRANSFERENCIA
    direccion_entrega: str
    notas: str | None = None
    total: float = Field(default=0)
    created_at: datetime = Field(default_factory=ahora_utc)
    updated_at: datetime = Field(default_factory=ahora_utc)

    usuario: Usuario = Relationship(back_populates='pedidos')
    items: list['DetallePedido'] = Relationship(back_populates='pedido')


class DetallePedido(SQLModel, table=True):
    """Línea inmutable: copia nombre y precio del producto al momento de la compra."""
    id: int | None = Field(default=None, primary_key=True)
    pedido_id: int = Field(foreign_key='pedido.id', index=True)
    producto_id: int = Field(foreign_key='producto.id', index=True)
    cantidad: int  # >= 1
    nombre_producto: str
    precio_unitario: float
    subtotal: float

    pedido: Pedido = Relationship(back_populates='items')
    producto: Producto = Relationship(back_populates='detalles')
