from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Vendor
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

#Registration view
@api_view(['POST'])
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
        return Response({'message':'User Created Successfully'},status=status.HTTP_201_CREATED)

@api_view(['PUT'])
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
        "date_joined":user.date_joined  , 
        "id":user.id  
    })

#vendor form
@api_view(["POST"])
@permission_classes([AllowAny])
def vendor_form(request):
    if request.method=="POST":
        store_name= request.data.get("store_name")

    if Vendor.objects.filter(store_name=store_name).exists():
                return Response({'message':'Name already taken'},status=status.HTTP_400_BAD_REQUEST)
    

    Vendor.objects.create(store_name=store_name)
    return Response({'message':'User Created Successfully'},status=status.HTTP_201_CREATED)
