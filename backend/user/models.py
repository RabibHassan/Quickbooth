from django.db import models

# Create your models here.from django.db import models
from datetime import timedelta
from django.utils import timezone

# Create your models here.
class Vendor(models.Model):
    store_id = models.AutoField(primary_key=True)
    store_name = models.CharField(max_length=255, unique=True)
    total_products_online = models.BigIntegerField(default=0)
    subscription_date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"{self.store_name} - {self.store_id}"

