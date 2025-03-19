from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import CustomUserCreationForm, CustomAuthenticationForm,UpdateUserForm
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib import messages
from .models import Contact
from products.models import Product
from orders.models import Order, CartItem
from django.db.models import Sum
from accounts.models import CustomUser
from django.contrib.auth.decorators import login_required

def register_view(request):
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, "Registration successful! You can now log in.")
            return redirect("login")
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = CustomUserCreationForm()
    return render(request, "accounts/register.html", {"form": form})

def login_view(request):
    if request.method == "POST":
        form = CustomAuthenticationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, "Login successful!")
            return redirect("home")
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = CustomAuthenticationForm()
    return render(request, "accounts/login.html", {"form": form})

def logout_view(request):
    logout(request)
    return redirect("home")


def contact(req):
    if req.method == "POST":
        name = req.POST.get('name')
        email = req.POST.get('email')
        message = req.POST.get('message')
        Contact.objects.create(name=name, email=email, message=message)
        messages.success(req, "Message sent successfully")
        return redirect('contact')
    return render(req, 'accounts/contact.html')


def admin_dash(req):
    orders = Order.objects.all()
    total_orders = orders.count()
    total_sales = orders.aggregate(Sum('total_price'))['total_price__sum']
    total_products = Product.objects.all().count()
    total_users = CustomUser.objects.all().count()
    context = {
        'total_orders': total_orders,
        'total_sales': total_sales,
        'total_products': total_products,
        'total_users': total_users
    }
    return render(req, 'accounts/admin_dash.html', context)

@login_required
def my_account(req):
    user = req.user
    form = UpdateUserForm(instance=user)
    if req.method == 'POST':
        form = UpdateUserForm(req.POST, instance=user)
        if form.is_valid():
            form.save()
            messages.success(req, 'Profile updated successfully!')
            return redirect('user_dashboard')
    context = {
        'form': form
    }
    return render(req, 'accounts/my_account.html', context)

@login_required
def change_password(req):
    if req.method == 'POST':
        form = PasswordChangeForm(user=req.user, data=req.POST)
        if form.is_valid():
            form.save()
            messages.success(req, 'Password updated successfully!')
            return redirect('login')
    else:
        form = PasswordChangeForm(user=req.user)
    
    for field in form.fields.values():
        field.widget.attrs['class'] = 'form-control'
    return render(req, 'accounts/change_password.html', {'form': form})
