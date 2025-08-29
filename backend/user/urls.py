from django.urls import path
from . import views

urlpatterns = [
    path('register/',views.register_user,name='register'),
    path('login/',views.login_user,name='login'),
    path('logout/',views.logout_user,name='logout'),
    path('update/',views.update_user,name='update'),
    path('view_profile/',views.view_profile,name="view_profile"),
    path('vendor_form/',views.vendor_form,name="vendor_form"),
    path('add_product/',views.add_product,name="add_product"),
    path('get_user_role/',views.get_user_role,name="get_user_role"),
    path('view_vendor_products/',views.view_vendor_products,name="view_vendor_products"),
    path('view_products/',views.view_products,name="view_products"),
    path('view_new_arrivals/',views.view_new_arrivals,name="view_new_arrivals"),
    path('view_items/',views.view_items,name="view_items"),
    path('view_limited/',views.view_limited,name="view_limited"),
    path('add_to_cart/',views.add_to_cart,name="add_to_cart"),
    path('get_cart_details/',views.get_cart_details,name="get_cart_details"),
    path('remove_from_cart/',views.remove_from_cart,name="remove_from_cart"),
    path('initiate_payment/', views.initiate_payment, name='initiate_payment'),
    path('save_transaction/', views.save_transaction, name='save_transaction'),
    path('add_orders/', views.add_orders, name='add_orders'),
    path('search_products/', views.search_products, name='search_products'),
    path('get_current_orders/', views.get_current_orders, name='get_current_orders'),
]
