from django.apps import AppConfig

class ProductConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'product'

    def ready(self):
        import product.signals  # або інший шлях, якщо signals.py в іншому місці
