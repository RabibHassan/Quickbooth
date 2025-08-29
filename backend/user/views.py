from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Vendor, Product, Role, Cart, Transaction, Order
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
import time
from django.db.models import Q

from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter



#Registration view
@api_view(['POST'])
@permission_classes([AllowAny]) #VVI-> eta chara 401 error
def register_user(request):
    if request.method== "POST":
        username= request.data.get('username')
        email= request.data.get('email')
        password=request.data.get('password')
        
        #check is username already exists or not
        #by filtering the username from built in User model
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already taken'}, status=status.HTTP_400_BAD_REQUEST)
        
        #create new user
        user= User.objects.create_user(username=username,email=email,password=password)
        Role.objects.create(user_id=user.id)
        return Response({'message':'User Created Successfully'},status=status.HTTP_201_CREATED)

#Update user profile
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_user(request):
    id=request.data.get('id')
    username=request.data.get('username')
    email=request.data.get('email')
    password=request.data.get('password')

    try:
        user=User.objects.get(id=id)
    except User.DoesNotExist:
        return Response({'message':'User not found'},status=status.HTTP_404_NOT_FOUND)

    if User.objects.filter(username=username).exclude(id=id).exists():
        return Response({'message':'Username already taken'},status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exclude(id=id).exists():
        return Response({'message':'Email already taken'},status=status.HTTP_400_BAD_REQUEST)
    
    #update if all ok
    if username:
        user.username=username
    if email:
        user.email=email
    if password:
        user.set_password(password)
    
    user.save()

    return Response({"message":"User updated Successfully"},status=status.HTTP_200_OK)
    
#Login View
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    if request.method=="POST":
        email= request.data.get('email')
        password= request.data.get('password')
        
        # Try to find the user by email
        try:
            user=User.objects.get(email=email)  # Find the user by email
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        
    #Authenticate using username and password only, not email
    user=authenticate(request,username=user.username,password=password)
    
    if user is None:
        return Response({'error':'Invalid Credentials'},status=status.HTTP_401_UNAUTHORIZED)
    
    #Create JWT token
    refresh= RefreshToken.for_user(user)
    return Response({
        'access':str(refresh.access_token),
        'refresh':str(refresh),
    })
    
    
#Logout User
@api_view(['POST'])
def logout_user(request):
    # The logout logic is handled on the frontend 
    # (clear JWT token from localStorage)
    return Response({'message':'Logout successful!'},status=status.HTTP_200_OK)

#view profile       
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def view_profile(request):
    user=request.user
    return Response({
        "username":user.username,
        "email":user.email,
        "password":user.password,
        "date_joined":user.date_joined, 
        "id":user.id  
    })

#view vendor products
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def view_vendor_products(request):
    user=request.user
    
    try:
        vendor=Vendor.objects.get(vendor_id=user.id)
        store=vendor.store_name
        products=Product.objects.filter(store_name=store)
        
        products_list= list(products.values(
            'product_id',
            'product_name',
            'product_type',
            'store_name',
            'price',
            'quantity',
            'image',
            'brand'
        ))
        
        return Response({
            "data": products_list, #frontend expects 'data' key
            "store_name":store,
            "count":len(products_list)
        })
    except Vendor.DoesNotExist:
        return Response({'error': 'Store not found for user'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#View user Products
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_products(request):
    user=request.user
    products=Product.objects.all()
    
    try:
        products_list=list(products.values(
                'product_id',
                'product_name',
                'product_type',
                'store_name',
                'price',
                'quantity',
                'image',
                'brand'
        ))
        return Response({
            "data": products_list, #frontend expects 'data' key
            "count":len(products_list)
        })
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#View New Arrivals
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_new_arrivals(request):
    user=request.user
    products= Product.objects.order_by('-product_id')[:8]
    
    try:
        products_list= list(products.values(
                'product_id',
                'product_name',
                'product_type',
                'store_name',
                'price',
                'quantity',
                'image',
                'brand'
        ))
        
        return Response({
            "data":products_list,
            "count":len(products_list)
        })
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#View Hot Items
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_items(request):
    user=request.user
    products= Product.objects.filter(flag="Hot")
    
    try:
        products_list= list(products.values(
                'product_id',
                'product_name',
                'product_type',
                'store_name',
                'price',
                'quantity',
                'image',
                'brand'
        ))
        
        return Response({
            "data":products_list,
            "count":len(products_list)
        })
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#view Limited Items
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def view_limited(request):
    user=request.user
    products= Product.objects.filter(flag="Limited")
    
    try:
        products_list=list(products.values(
            'product_id',
            'product_name',
            'product_type',
            'store_name',
            'price',
            'quantity',
            'image',
            'brand'
        ))
        
        for i in products_list:
            i['original_price'] = i['price']
            i['price']=int(float(i['price'])*0.7)
            
                    
        return Response({
            "data":products_list,
            "count":len(products_list)
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

#get user role
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_role(request):
    user=request.user
    
    try:
        role=Role.objects.get(user_id=user.id)
        return Response({"role":role.role,"shop_type":role.shop_type})
    except Role.DoesNotExist:
        return Response({'error': 'User role not found'}, status=status.HTTP_404_NOT_FOUND)
        

#vendor form
@api_view(["POST"])
@permission_classes([AllowAny])
def vendor_form(request):
    if request.method=="POST":
        vendor_id=request.data.get("vendor_id")
        store_name= request.data.get("store_name")
        store_type=request.data.get("store_type")            
        
    if Vendor.objects.filter(store_name=store_name).exists():
                return Response({'message':'Name already taken'},status=status.HTTP_400_BAD_REQUEST)
    
    Vendor.objects.create(vendor_id=vendor_id,store_name=store_name,store_type=store_type)
    
    try:
        role_obj= Role.objects.get(user_id=vendor_id)
        role_obj.role="vendor"
        role_obj.shop_type=store_type
        role_obj.save()
    except Role.DoesNotExist:
            return Response({'error': 'User role not found'}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({'message':'User Created Successfully'},status=status.HTTP_201_CREATED)

#Vendor adds product to shop
@api_view(["POST"])
@permission_classes([AllowAny])
def add_product(request):
    if request.method=="POST":
        product_id = request.data.get("uid")
        product_name = request.data.get("product_name")
        product_type = request.data.get("product_type")
        price_str = request.data.get("price")
        quantity_str = request.data.get("quantity") 
        image=request.data.get("image") 
        brand=request.data.get("brand")
        
        if not all([product_id, product_name, product_type, price_str, quantity_str]):
            return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            price = int(str(price_str).replace(',', '')) 
            quantity = int(str(quantity_str).replace(',', ''))
        except (ValueError, TypeError):
            return Response({'error': 'Price and quantity must be valid numbers'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            vendor = Vendor.objects.get(vendor_id=product_id)
            store_name_of_vendor = vendor.store_name
        except Vendor.DoesNotExist:
            return Response({"error": "Vendor not found. Please register as vendor first."}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            product = Product.objects.create(
                product_name=product_name,
                product_type=product_type,
                price=price,
                quantity=quantity,
                store_name=store_name_of_vendor,
                image=image,
                brand=brand
            )
            vendor = Vendor.objects.get(vendor_id=product_id)
            vendor.total_products_online+=quantity
            vendor.save()
            return Response({'message':'Product added successfully'}, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': f'Failed to create product: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        
#Add to cart
@api_view(["POST"])
@permission_classes([AllowAny])
def add_to_cart(request):
    if request.method=="POST":
        user_id=request.data.get("user_id")
        product_id=request.data.get("product_id")
        product_name=request.data.get("product_name")  
        price=request.data.get("price")
        image=request.data.get("image")
        store_name=request.data.get("store_name")
        quantity=request.data.get("quantity")
    
    price= int(str(price).replace(',', ''))
    quantity= int(str(quantity).replace(',', ''))
    user_id= int(str(user_id).replace(',', ''))
    product_id= int(str(product_id).replace(',', ''))
    try:
        cart=Cart.objects.create(
            user_id=user_id,
            product_id=product_id,
            product_name=product_name,
            price=price,
            image=image,
            store_name=store_name,
            quantity=quantity
        )
        
        return Response({'message':'Product added to cart successfully!'},status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Failed to add to cart: {str(e)}'},status=status.HTTP_400_BAD_REQUEST)
    
#get cart details
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_cart_details(request):
    user= request.user
    
    cart_user=Cart.objects.filter(user_id=user.id)
    
    try:
        cart_list=list(cart_user.values(
            'user_id',
            'product_id',
            'product_name',
            'price',
            'image',
            'store_name',
            'quantity'
        ))
        
        return Response({
            "data":cart_list,
            "count":len(cart_list)
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#remove from cart
@api_view(["DELETE"])
@permission_classes([AllowAny])
def remove_from_cart(request):
    if request.method=="DELETE":
        product_id=request.data.get("product_id")
        
    try:
        cart=Cart.objects.filter(product_id=product_id)
        cart.delete()
        return Response({'message':'Item removed from cart successfully!'},status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({'error': 'Item not found in cart'}, status=status.HTTP_404_NOT_FOUND)
    
#get current orders
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_current_orders(request):
    user= request.user
    
    orders=Order.objects.filter(user_id=user.id)
    try:
        orders_list=list(orders.values(
            'order_id',
            'product_id',
            'transaction_id',
            'amount',
            'phone',
            'address',
            'city',
            'postalCode',
            'status',
            'image',
            'product_name'
        ))
        
        return Response({
            "data":orders_list,
            "count":len(orders_list)
        })
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    try:
        amount = request.data.get('amount')
        product_name = request.data.get('product_name')

        # Mock payment data response
        mock_payment_data = {
            'transaction_id': f'MOCK_TRANS_{int(time.time())}',
            'amount': amount,
            'status': 'pending',
            'payment_url': 'http://localhost:5173/payment-success', 
            'message': 'Payment initiated successfully'
        }

        return Response(mock_payment_data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_transaction(request):
    try:
        Transaction.objects.create(
            user=request.user,
            transaction_id=f'MOCK_TRANS_{int(time.time())}',
            amount=request.data.get('amount', 0),
            status='completed'
        )
        
        return Response({'message': 'Transaction saved successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def add_orders(request):
    if request.method=="POST":
        user_id=request.data.get("user_id")
        product_id=request.data.get("product_id")
        transaction_id=request.data.get("transaction_id")
        amount=request.data.get("amount")
        phone=request.data.get("phone")
        address=request.data.get("address")
        city=request.data.get("city")
        postalCode=request.data.get("postalCode")
        
    try:
        user_id= int(str(user_id).replace(',', ''))
        product_id= int(str(product_id).replace(',', ''))
        amount= float(str(amount).replace(',', ''))
        
        if Order.objects.filter(transaction_id=transaction_id).exists():
            return Response(
                {'message': 'Order already exists for this transaction'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        product=Product.objects.get(product_id=product_id)
        image=product.image
        name=product.product_name
        order=Order.objects.create(
            user_id=user_id,
            product_id=product_id,
            transaction_id=transaction_id,
            amount=amount,
            phone=phone,
            address=address,
            city=city,
            postalCode=postalCode,
            status="on-going",
            image=image,
            product_name=name
        )
        
        # Get user and product details
        user = User.objects.get(id=user_id)
        product = Product.objects.get(product_id=product_id)
        
        # Generate PDF
        pdf_buffer = generate_order_pdf(order, user, product)
        
        # Send email with PDF attachment
        email = EmailMessage(
            'Order Confirmation',
            f'Thank you for your order! Your order ID is {order.order_id}',
            'quickboothbd@gmail.com',
            [user.email]
        )
        email.attach(f'order_{order.order_id}.pdf', pdf_buffer.getvalue(), 'application/pdf')
        email.send()
        
        # Clear the user's cart after order is placed
        if Cart.objects.filter(user_id=user_id,product_id=product_id).exists():
            Cart.objects.filter(user_id=user_id,product_id=product_id).delete()
        
        product=Product.objects.get(product_id=product_id)
        product.quantity-=1
        product.save()
        
        return Response({'message':'Order placed successfully!'},status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Failed to place order: {str(e)}'},status=status.HTTP_400_BAD_REQUEST)
    
#search
@api_view(['GET'])
@permission_classes([AllowAny])
def search_products(request):
    query = request.GET.get('query', '')
    
    try:
        # Search product name, type, and brand
        products = Product.objects.filter(
            Q(product_name__icontains=query) |
            Q(product_type__icontains=query) |
            Q(brand__icontains=query)
        )
        
        products_list = list(products.values(
            'product_id',
            'product_name',
            'product_type',
            'store_name',
            'price',
            'quantity',
            'image',
            'brand'
        ))
        
        return Response({
            "data": products_list,
            "count": len(products_list)
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

def generate_order_pdf(order, user, product):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Add company header
    p.setFont("Helvetica-Bold", 24)
    p.drawString(250, 750, "QuickBooth")
    
    # Add decorative lines
    p.setStrokeColorRGB(0.2, 0.2, 0.2)
    p.setLineWidth(2)
    p.line(50, 740, 550, 740)
    
    # Order confirmation header
    p.setFont("Helvetica-Bold", 18)
    p.drawString(200, 700, "Order Confirmation")
    
    # Order details section
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, 650, "Order Details")
    p.setFont("Helvetica", 12)
    p.drawString(70, 630, f"Order ID:")
    p.drawString(200, 630, f"#{order.order_id}")
    p.drawString(70, 610, f"Transaction ID:")
    p.drawString(200, 610, f"{order.transaction_id}")
    
    # Product details section
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, 570, "Product Information")
    p.setFont("Helvetica", 12)
    p.drawString(70, 550, f"Product Name:")
    p.drawString(200, 550, f"{product.product_name}")
    p.drawString(70, 530, f"Brand:")
    p.drawString(200, 530, f"{product.brand}")
    p.drawString(70, 510, f"Amount:")
    p.drawString(200, 510, f"BDT {order.amount:,.2f}")
    
    # Shipping details section
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, 470, "Shipping Information")
    p.setFont("Helvetica", 12)
    p.drawString(70, 450, f"Name:")
    p.drawString(200, 450, f"{user.username}")
    p.drawString(70, 430, f"Address:")
    p.drawString(200, 430, f"{order.address}")
    p.drawString(70, 410, f"City:")
    p.drawString(200, 410, f"{order.city}")
    p.drawString(70, 390, f"Postal Code:")
    p.drawString(200, 390, f"{order.postalCode}")
    p.drawString(70, 370, f"Phone:")
    p.drawString(200, 370, f"{order.phone}")
    
    # Footer
    p.setFont("Helvetica-Bold", 10)
    p.drawString(200, 100, "Thank you for shopping with QuickBooth!")
    p.setFont("Helvetica", 10)
    p.drawString(150, 80, "For any queries, please contact us at quickboothbd@gmail.com")
    
    # Bottom line
    p.line(50, 60, 550, 60)
    
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return buffer

