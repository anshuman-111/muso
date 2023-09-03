from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    AuthTokenObtainPairView,
    LogoutView,
    isUser,
    SetDashboard,
    GetDashboard,
    DeleteAccount
)

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path("register", RegisterView.as_view()),
    path("login", LoginView.as_view()),
    path("logout", LogoutView.as_view()),
    path("isUser", isUser.as_view()),
    path("delete/<username>", DeleteAccount.as_view()),
    path("setDashboard", SetDashboard.as_view()),
    path("getDashboard/<username>", GetDashboard.as_view()),
    path("token", AuthTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
]
