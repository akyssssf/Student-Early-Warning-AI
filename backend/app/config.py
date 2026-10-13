import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

# Secret bawaan HANYA untuk development; production wajib mengisi JWT_SECRET_KEY sendiri.
_DEV_SECRET = "dev-only-jangan-dipakai-di-produksi-0123456789"
APP_ENV = os.getenv("APP_ENV", "production").lower()  # development | production | testing


class Config:
    APP_ENV = APP_ENV
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///sew.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY") or (_DEV_SECRET if APP_ENV != "production" else "")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)   # NFR-01
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)      # NFR-01

    CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
    ALLOW_SELF_REGISTER = os.getenv("ALLOW_SELF_REGISTER", "true").lower() == "true"
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URI = os.getenv("RATELIMIT_STORAGE_URI", "memory://")
    LOGIN_RATE_LIMIT = "10 per minute"
    REGISTER_RATE_LIMIT = "5 per minute"
    REFRESH_RATE_LIMIT = "30 per minute"


def validate_config(config):
    """Gagal cepat kalau konfigurasi production tidak aman."""
    if config.get("APP_ENV") != "production" or config.get("TESTING"):
        return
    secret = config.get("JWT_SECRET_KEY") or ""
    if len(secret) < 32 or secret.startswith(("dev-only", "ganti")):
        raise RuntimeError(
            "JWT_SECRET_KEY belum diisi dengan benar. Isi dengan string acak minimal 32 karakter "
            "(contoh: python -c \"import secrets; print(secrets.token_urlsafe(48))\"), "
            "atau set APP_ENV=development untuk lingkungan lokal."
        )
