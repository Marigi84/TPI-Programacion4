"""Importa todos los modelos para que SQLModel registre las cinco tablas y sus relaciones
antes de crear las tablas o hacer la primera consulta."""

from app.modules.usuarios.models import Usuario
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto
from app.modules.pedidos.models import DetallePedido, Pedido

__all__ = ['Usuario', 'Categoria', 'Producto', 'Pedido', 'DetallePedido']
