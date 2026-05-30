from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, TaskListCreateView, TaskUpdateView, DailyLogTodayView, current_user

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('tasks/', TaskListCreateView.as_view(), name='task_list_create'),
    path('tasks/<int:pk>/', TaskUpdateView.as_view(), name='task_update'),
    path('tracker/today/', DailyLogTodayView.as_view(), name='tracker_today'),
    path('auth/me/', current_user, name='current_user'),
]