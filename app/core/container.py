## search about it
from dependency_injector import containers, providers
from supabase import create_client
from cryptography.fernet import Fernet
from app.core.config import get_settings

class Container(containers.DeclarativeContainer):
    # 1. جلب الإعدادات من ملف الـ Config
    settings = providers.Singleton(get_settings)

    # 2. إعداد عميل سوبابيز (Supabase Client)
    # بيستخدم الـ URL والـ Key اللي متخزنين في الـ .env
    supabase_client = providers.Singleton(
        create_client,
        settings().SUPABASE_URL,
        settings().SUPABASE_KEY
    )

    # 3. إعداد أداة التشفير (Fernet)
    # بنمرر لها الـ Key اللي في الـ settings
    fernet_engine = providers.Singleton(
        Fernet,
        settings().FERNET_KEY.encode() if isinstance(settings().FERNET_KEY, str) else settings().FERNET_KEY
    )

#