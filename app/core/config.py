from cryptography.fernet import Fernet
import os

class Settings:
    SUPABASE_URL = "https://jqlczjccjkzxqobmiykd.supabase.co"
    SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxbGN6amNjamt6eHFvYm1peWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NjMzMzcsImV4cCI6MjA4ODEzOTMzN30.-O3GBags3Q-R-_zMgHIMdESqZwDu1NT1jslg5aDoZZA"
    
    # تأكدي إن السطر ده مفيهوش أي مسافات في أوله غير الـ 4 مسافات بتوع الكلاس
    # الرابط المعدل ليدعم Async وبورت الـ Pooler (6543)
    DATABASE_URL = "postgresql+asyncpg://postgres.jqlczjccjkzxqobmiykd:RWDGRRjyPAS8bQvL@aws-1-eu-west-1.pooler.supabase.com:6543/postgres"
    
    FERNET_KEY = "tO-7pM4Xva_NOW2i0qKnwH6vun5iI1nBsVVx9bctxTc="

def get_settings():
    settings = Settings()
    settings.fernet = Fernet(settings.FERNET_KEY.encode())
    return settings