from pydantic import model_validator
from sqlmodel import Field, SQLModel


class CategoriaCreate(SQLModel):
    nombre: str = Field(min_length=2, max_length=100)
    descripcion: str = ''


class CategoriaUpdate(SQLModel):
    nombre: str | None = Field(default=None, min_length=2, max_length=100)
    descripcion: str | None = None

    @model_validator(mode='after')
    def campos_enviados_no_nulos(self):
        # Un PUT parcial permite omitir campos, pero no guardar NULL en columnas obligatorias.
        if any(getattr(self, campo) is None for campo in self.model_fields_set):
            raise ValueError('Los campos enviados no pueden ser nulos')
        return self


class CategoriaRead(CategoriaCreate):
    id: int
    activo: bool
