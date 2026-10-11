import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///sew.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-only-ganti-di-produksi-minimal-32-karakter")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)   # NFR-01
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)      # NFR-01

    CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")]
    ALLOW_SELF_REGISTER = os.getenv("ALLOW_SELF_REGISTER", "true").lower() == "true"
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URI = "memory://"
    LOGIN_RATE_LIMIT = "10 per minute"
