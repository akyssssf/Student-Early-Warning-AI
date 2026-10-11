import bcrypt
from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt

from .errors import ApiError


def hash_password(raw: str) -> str:
    return bcrypt.hashpw(raw.encode(), bcrypt.gensalt()).decode()


def check_password(raw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(raw.encode(), hashed.encode())
    except ValueError:
        return False


def roles_required(*roles):
    """RBAC: setiap endpoint menyatakan role yang diizinkan (Bagian 9)."""
    def deco(fn):
        @wraps(fn)
        def wrapper(*a, **kw):
            verify_jwt_in_request()
            if get_jwt().get("role") not in roles:
                raise ApiError("AKSES_DITOLAK", "Anda tidak memiliki akses ke fitur ini.", 403)
            return fn(*a, **kw)
        return wrapper
    return deco
