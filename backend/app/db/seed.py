"""Datos iniciales idempotentes: python -m app.db.seed."""
from sqlmodel import select
from app.core.database import create_all_tables, session_factory
from app.core.security import hash_password
from app.db.models import Categoria, Producto, Usuario

CATEGORIAS = ('Pizzas', 'Hamburguesas', 'Bebidas')
CATEGORIAS_DESCRIPCION = {
    'Pizzas': 'Pizzas a la piedra, de 8 porciones',
    'Hamburguesas': 'Hamburguesas caseras con papas fritas',
    'Bebidas': 'Bebidas frías',
}
PRODUCTOS = (
    ('Pizza muzzarella', 'Pizzas', 9500, 'Salsa de tomate, muzzarella y aceitunas'),
    ('Pizza especial', 'Pizzas', 11200, 'Muzzarella, jamón, morrones y huevo'),
    ('Pizza napolitana', 'Pizzas', 10800, 'Muzzarella, rodajas de tomate, ajo y albahaca'),
    ('Hamburguesa clásica', 'Hamburguesas', 7900, 'Medallón de carne, lechuga, tomate y queso'),
    ('Hamburguesa doble', 'Hamburguesas', 10200, 'Doble medallón, cheddar, panceta y cebolla'),
    ('Hamburguesa veggie', 'Hamburguesas', 8500, 'Medallón de lentejas, rúcula y tomate'),
    ('Gaseosa', 'Bebidas', 2800, 'Lata de 354 ml'),
    ('Agua mineral', 'Bebidas', 1900, 'Botella de 500 ml, con o sin gas'),
)


def main():
    create_all_tables()
    with session_factory() as session:
        if not session.exec(select(Usuario).where(Usuario.username == 'admin')).first():
            session.add(Usuario(username='admin', full_name='Administrador',
                email='admin@foodstore.local', hashed_password=hash_password('Admin1234!'),
                role='admin'))
        for nombre in CATEGORIAS:
            if not session.exec(select(Categoria).where(Categoria.nombre == nombre)).first():
                session.add(Categoria(nombre=nombre, descripcion=CATEGORIAS_DESCRIPCION[nombre]))
        session.flush()
        for nombre, categoria, precio, descripcion in PRODUCTOS:
            if not session.exec(select(Producto).where(Producto.nombre == nombre)).first():
                categoria_obj = session.exec(select(Categoria).where(Categoria.nombre == categoria)).one()
                session.add(Producto(nombre=nombre, categoria_id=categoria_obj.id, descripcion=descripcion,
                                     precio_base=precio, stock=20))
        session.commit()


if __name__ == '__main__':
    main()
