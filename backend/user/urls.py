from django.urls import path
from . import views

urlpatterns = [
    path('register/',views.register_user,name='register'),
    path('login/',views.login_user,name='login'),
    path('logout/',views.logout_user,name='logout'),
    path('update/',views.update_user,name='update'),
    path('view_profile/',views.view_profile,name="view_profile"),
    path('vendor_form/',views.vendor_form,name="vendor_form"),
    path('add_product/',views.vendor_form,name="add_product")
]
