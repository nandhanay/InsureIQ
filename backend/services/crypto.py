"""
Crypto Service — AES-256 + Fernet encryption for sensitive data.
Used for encrypting PII data at rest (medical records, personal details).
"""
import os
import base64
from cryptography.fernet import Fernet
from core.config import settings


def _get_fernet_key() -> bytes:
    """Derive a Fernet-compatible key from the app secret."""
    secret = settings.SECRET_KEY.encode("utf-8")
    # Pad or truncate to 32 bytes, then base64-encode for Fernet
    key_bytes = (secret * 2)[:32]
    return base64.urlsafe_b64encode(key_bytes)


_fernet = None


def _get_fernet() -> Fernet:
    global _fernet
    if _fernet is None:
        _fernet = Fernet(_get_fernet_key())
    return _fernet


def encrypt_value(plaintext: str) -> str:
    """Encrypt a string value. Returns base64-encoded ciphertext."""
    f = _get_fernet()
    return f.encrypt(plaintext.encode("utf-8")).decode("utf-8")


def decrypt_value(ciphertext: str) -> str:
    """Decrypt a Fernet-encrypted value."""
    f = _get_fernet()
    return f.decrypt(ciphertext.encode("utf-8")).decode("utf-8")
