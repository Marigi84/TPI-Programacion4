from sqlalchemy import func
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.productos.models import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)

    def search(self, skip: int, limit: int, search: str | None = None,
               categoria_id: int | None = None,
               disponible: bool | None = None) -> tuple[int, list[Producto]]:
        """Productos activos filtrados por nombre (sin distinguir mayúsculas), categoría y
        disponibilidad. Devuelve el total y la página pedida."""
        consulta = select(Producto).where(Producto.activo == True)  # noqa: E712
        if search:
            consulta = consulta.where(Producto.nombre.ilike(f'%{search}%'))
        if categoria_id is not None:
            consulta = consulta.where(Producto.categoria_id == categoria_id)
        if disponible is not None:
            consulta = consulta.where(Producto.disponible == disponible)
        total = self.session.exec(select(func.count()).select_from(consulta.subquery())).one()
        items = self.session.exec(consulta.order_by(Producto.id).offset(skip).limit(limit)).all()
        return total, list(items)

    def get_for_update(self, producto_id: int) -> Producto | None:
        """Bloquea la fila (SELECT ... FOR UPDATE en PostgreSQL) para que dos pedidos
        simultáneos no vendan más stock del que hay."""
        consulta = select(Producto).where(Producto.id == producto_id).with_for_update()
        return self.session.exec(consulta).first()
