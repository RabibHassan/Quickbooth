from django.db import models

# Create your models here.from django.db import models
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField

# Create your models here.
class Vendor(models.Model):
    vendor_id=models.BigIntegerField(null=True)
    store_id = models.AutoField(primary_key=True)
    store_name = models.CharField(max_length=255, unique=True)
    store_type=models.CharField(max_length=255,default="NN")
    total_products_online = models.BigIntegerField(default=0)
    subscription_date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"{self.store_name} - {self.store_id}"

class Product(models.Model):
    store_name= models.CharField(max_length=255, null=True)
    product_id=models.AutoField(primary_key=True)
    product_name=models.CharField(max_length=255)
    product_type=models.CharField(max_length=255)
    brand=models.CharField(max_length=255,default="NN")
    price=models.BigIntegerField(null=True)
    quantity=models.BigIntegerField(null=True)
    image = models.CharField(max_length=500, null=True, blank=True) 
    status=models.CharField(max_length=255,default="Active")
    flag=models.CharField(max_length=255,default="NN")
    
    def __str__(self):
        return f"{self.product_name} - {self.product_id}"
    
class Role(models.Model):
    role=models.CharField(max_length=20,default="user")
    shop_type=models.CharField(max_length=20,default="NN")
    user_id=models.BigIntegerField(null=True)
    
    def __str__(self):
        return f"{self.role}"
    
class Cart(models.Model):
    user_id=models.BigIntegerField()
    product_id=models.BigIntegerField()
    product_name=models.CharField(max_length=255)
    price=models.BigIntegerField()
    image=models.CharField(max_length=500, null=True, blank=True)
    store_name=models.CharField(max_length=255,null=True)
    quantity=models.BigIntegerField(null=True,default=1)
    
    def __str__(self):
        return f"{self.product_name} - {self.user_id}"
    
class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    
class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    product_id= models.BigIntegerField()
    user_id = models.BigIntegerField()
    transaction_id = models.CharField(max_length=100)
    amount = models.PositiveIntegerField()
    phone=models.CharField(max_length=100)
    address=models.CharField(max_length=100)
    city=models.CharField(max_length=100)
    postalCode=models.CharField(max_length=100)
    status=models.CharField(max_length=100,default="Processing")
    image=models.CharField(max_length=500,default="NN")
    product_name=models.CharField(max_length=255,default="NN")
    
    def __str__(self):
        return f"Order {self.order_id} by {self.user.username}"