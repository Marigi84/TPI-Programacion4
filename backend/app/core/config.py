from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # El ejemplo de entrega usa PostgreSQL; la conexión real se configura en .env.
    DATABASE_URL: str = 'postgresql+psycopg2://postgres:TU_CONTRASENA@localhost:5432/foodstore_db'
    SECRET_KEY: str = 'cambiar-esta-clave-de-al-menos-32-caracteres'
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    FRONTEND_ORIGIN: str = 'http://localhost:5173'
    COOKIE_SECURE: bool = False
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')


settings = Settings()
