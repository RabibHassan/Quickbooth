from django.shortcuts import render
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view
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
        
        
        
        