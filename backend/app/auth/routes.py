"""Modul auth: login, refresh JWT, (opsional) pendaftaran mandiri mahasiswa. FR-01, NFR-01."""
import logging
from flask import current_app, jsonify, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required

from . import auth_bp
from ..extensions import db, limiter
from ..errors import ApiError
from ..models import User
from ..schemas import LoginIn, RegisterIn, parse
from ..security import burn_password_check, check_password, current_user
from ..services import create_user_with_profile

log = logging.getLogger("sew.auth")  # tidak mencatat password/token (NFR-09)


def _claims(user):
    return {"role": user.role, "nim": user.nim}


@auth_bp.post("/login")
@limiter.limit(lambda: current_app.config["LOGIN_RATE_LIMIT"])
def login():
    data = parse(LoginIn, request.get_json(silent=True))
    user = User.query.filter(
        (User.username == data.username) | (User.email == data.username)
    ).first()

    if not user:
        burn_password_check(data.password)
    if not user or not user.is_active or not check_password(data.password, user.password_hash):
        log.warning("login gagal")
        raise ApiError("KREDENSIAL_SALAH", "Username/email atau password salah.", 401)

    identity = str(user.id_user)
    log.info("login berhasil id_user=%s role=%s", user.id_user, user.role)
    return jsonify(
        access_token=create_access_token(identity, additional_claims=_claims(user)),
        refresh_token=create_refresh_token(identity),
        role=user.role,
        user=user.to_dict(),
    ), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    """Profil akun yang sedang login (dipakai frontend untuk memulihkan sesi)."""
    return jsonify(current_user().to_dict()), 200


@auth_bp.post("/refresh")
@limiter.limit(lambda: current_app.config["REFRESH_RATE_LIMIT"])
@jwt_required(refresh=True)
def refresh():
    user = db.session.get(User, int(get_jwt_identity()))
    if not user or not user.is_active:
        raise ApiError("AKUN_NONAKTIF", "Akun tidak aktif. Silakan login ulang.", 401)
    return jsonify(access_token=create_access_token(str(user.id_user), additional_claims=_claims(user))), 200


@auth_bp.post("/register")
@limiter.limit(lambda: current_app.config["REGISTER_RATE_LIMIT"])
def register():
    """Tambahan di luar dokumen: pendaftaran mandiri KHUSUS mahasiswa (matikan: ALLOW_SELF_REGISTER=false)."""
    if not current_app.config["ALLOW_SELF_REGISTER"]:
        raise ApiError("PENDAFTARAN_DITUTUP", "Pendaftaran mandiri dinonaktifkan. Hubungi Admin.", 403)
    data = parse(RegisterIn, request.get_json(silent=True))
    user = create_user_with_profile(
        role="mahasiswa", name=data.name, email=data.email, password=data.password,
        username=data.username, nim=data.nim, prodi=data.prodi, angkatan=data.angkatan,
    )
    log.info("register mahasiswa id_user=%s", user.id_user)
    return jsonify(user.to_dict()), 201
