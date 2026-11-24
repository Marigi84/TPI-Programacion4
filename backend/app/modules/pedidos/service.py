from datetime import datetime, timezone

from app.core.utils import ahora_utc
from app.modules.pedidos.models import DetallePedido, Pedido
from app.modules.pedidos.schemas import PedidoCreate, PedidoRead, PedidosPaginados, ResumenPedidos
from app.modules.pedidos.unit_of_work import PedidoUnitOfWork


class ReglaPedidoError(Exception):
    """Base de las reglas de negocio de pedidos; el router la traduce a 400."""


class PedidoNoEncontrado(Exception):
    pass


class ProductoNoEncontrado(Exception):
    pass


class PedidoAjeno(Exception):
    pass


class ProductoNoDisponible(ReglaPedidoError):
    pass


class ProductoRepetido(ReglaPedidoError):
    pass


class StockInsuficiente(ReglaPedidoError):
    pass


class TransicionInvalida(ReglaPedidoError):
    pass


# Máquina de estados (RN-02). ENTREGADO y CANCELADO son terminales.
TRANSICIONES: dict[str, set[str]] = {
    'PENDIENTE': {'EN_PREPARACION', 'CANCELADO'},
    'EN_PREPARACION': {'ENTREGADO', 'CANCELADO'},
    'ENTREGADO': set(),
    'CANCELADO': set(),
}


class PedidoService:
    def __init__(self, uow: PedidoUnitOfWork):
        self.uow = uow

    def crear(self, datos: PedidoCreate, usuario_id: int) -> PedidoRead:
        """RN-01: todo en una transacción; si falla un ítem, no se persiste nada."""
        with self.uow as uow:
            ids = [item.producto_id for item in datos.items]
            if len(ids) != len(set(ids)):
                raise ProductoRepetido('Un producto no puede repetirse en el pedido')
            pedido = uow.pedidos.add(Pedido(usuario_id=usuario_id, forma_pago=datos.forma_pago,
                                            direccion_entrega=datos.direccion_entrega,
                                            notas=datos.notas))
            total = 0.0
            for item in datos.items:
                producto = uow.productos.get_for_update(item.producto_id)
                if producto is None or not producto.activo:
                    raise ProductoNoEncontrado(f'Producto {item.producto_id} no encontrado')
                if not producto.disponible:
                    raise ProductoNoDisponible(f'{producto.nombre} no está disponible')
                if producto.stock < item.cantidad:
                    raise StockInsuficiente(f'Stock insuficiente para {producto.nombre}')
                producto.stock -= item.cantidad
                subtotal = producto.precio_base * item.cantidad
                pedido.items.append(DetallePedido(
                    producto_id=producto.id, cantidad=item.cantidad,
                    nombre_producto=producto.nombre, precio_unitario=producto.precio_base,
                    subtotal=subtotal))
                total += subtotal
            pedido.total = total
            uow.pedidos.add(pedido)
            return PedidoRead.model_validate(pedido)

    def listar(self, usuario_id: int, es_admin: bool, skip: int, limit: int,
               estado: str | None) -> PedidosPaginados:
        """RN-04: el cliente ve solo sus pedidos; el admin ve todos."""
        with self.uow as uow:
            total, pedidos = uow.pedidos.list_by_usuario(None if es_admin else usuario_id,
                                                         estado, skip, limit)
            return PedidosPaginados(total=total,
                                    items=[PedidoRead.model_validate(p) for p in pedidos])

    def obtener(self, pedido_id: int, usuario_id: int, es_admin: bool) -> PedidoRead:
        with self.uow as uow:
            pedido = uow.pedidos.get_by_id(pedido_id)
            if pedido is None:
                raise PedidoNoEncontrado('Pedido no encontrado')
            if not es_admin and pedido.usuario_id != usuario_id:
                raise PedidoAjeno('No podés acceder a este pedido')
            return PedidoRead.model_validate(pedido)

    def cambiar_estado(self, pedido_id: int, nuevo: str) -> PedidoRead:
        """Uso del admin: avanza o cancela según la máquina de estados (RN-02, RN-03)."""
        with self.uow as uow:
            pedido = self._obtener_para_cambio(uow, pedido_id)
            self._aplicar_transicion(uow, pedido, nuevo)
            return PedidoRead.model_validate(pedido)

    def cancelar(self, pedido_id: int, usuario_id: int) -> PedidoRead:
        """Uso del dueño: solo cancela pedidos propios en PENDIENTE (RN-03, RN-04)."""
        with self.uow as uow:
            pedido = self._obtener_para_cambio(uow, pedido_id)
            if pedido.usuario_id != usuario_id:
                raise PedidoAjeno('No podés cancelar un pedido ajeno')
            if pedido.estado != 'PENDIENTE':
                raise TransicionInvalida('Solo podés cancelar un pedido pendiente')
            self._aplicar_transicion(uow, pedido, 'CANCELADO')
            return PedidoRead.model_validate(pedido)

    def resumen(self) -> ResumenPedidos:
        with self.uow as uow:
            por_estado = uow.pedidos.count_by_estado()
            return ResumenPedidos(
                pendientes=por_estado.get('PENDIENTE', 0),
                en_preparacion=por_estado.get('EN_PREPARACION', 0),
                entregados=por_estado.get('ENTREGADO', 0),
                cancelados=por_estado.get('CANCELADO', 0),
                pedidos_hoy=uow.pedidos.count_del_dia(datetime.now(timezone.utc).date()),
                ingresos_entregados=uow.pedidos.sum_total_by_estado('ENTREGADO'))

    @staticmethod
    def _obtener_para_cambio(uow: PedidoUnitOfWork, pedido_id: int) -> Pedido:
        pedido = uow.pedidos.get_for_update(pedido_id)
        if pedido is None:
            raise PedidoNoEncontrado('Pedido no encontrado')
        return pedido

    @staticmethod
    def _aplicar_transicion(uow: PedidoUnitOfWork, pedido: Pedido, nuevo: str) -> None:
        """Valida la transición antes de modificar el pedido. Al cancelar, restituye el stock
        de cada línea en la misma transacción (RN-03)."""
        if nuevo not in TRANSICIONES[pedido.estado]:
            raise TransicionInvalida(f'No se puede pasar de {pedido.estado} a {nuevo}')
        if nuevo == 'CANCELADO':
            for item in pedido.items:
                producto = uow.productos.get_for_update(item.producto_id)
                if producto is not None:
                    producto.stock += item.cantidad
                    uow.productos.add(producto)
        pedido.estado = nuevo
        pedido.updated_at = ahora_utc()
        uow.pedidos.add(pedido)
