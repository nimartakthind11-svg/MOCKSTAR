import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Environment Configuration
    ENVIRONMENT: str = "production"
    ALLOWED_ORIGINS: str = ""

    # Port configuration
    PORT: int = 8000

    # PostgreSQL Database URL
    DATABASE_URL: str

    # JWT Authentication settings
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # AI / LLM configuration
    GEMINI_API_KEY: str = ""

    # Pydantic Configuration to read from .env file
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore" # Ignore any extra environment variables
    )

settings = Settings()
