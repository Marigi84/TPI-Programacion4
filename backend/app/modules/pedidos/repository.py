from datetime import date

from sqlalchemy import func
from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.models import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session):
        super().__init__(session, Pedido)

    def get_for_update(self, pedido_id: int) -> Pedido | None:
        consulta = select(Pedido).where(Pedido.id == pedido_id).with_for_update()
        return self.session.exec(consulta).first()

    def list_by_usuario(self, usuario_id: int | None, estado: str | None, skip: int,
                        limit: int) -> tuple[int, list[Pedido]]:
        """usuario_id=None lista los pedidos de todos los usuarios (uso del admin)."""
        consulta = select(Pedido)
        if usuario_id is not None:
            consulta = consulta.where(Pedido.usuario_id == usuario_id)
        if estado is not None:
            consulta = consulta.where(Pedido.estado == estado)
        total = self.session.exec(select(func.count()).select_from(consulta.subquery())).one()
        pedidos = self.session.exec(consulta.order_by(Pedido.id.desc()).offset(skip).limit(limit))
        return total, list(pedidos.all())

    def count_by_estado(self) -> dict[str, int]:
        filas = self.session.exec(select(Pedido.estado, func.count()).group_by(Pedido.estado))
        return {estado: cantidad for estado, cantidad in filas.all()}

    def count_del_dia(self, dia: date) -> int:
        consulta = select(func.count()).select_from(Pedido).where(func.date(Pedido.created_at) == dia)
        return self.session.exec(consulta).one()

    def sum_total_by_estado(self, estado: str) -> float:
        consulta = select(func.coalesce(func.sum(Pedido.total), 0)).where(Pedido.estado == estado)
        return float(self.session.exec(consulta).one())
