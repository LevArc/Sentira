from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, DailyLog, Task

admin.site.register(User, UserAdmin)
admin.site.register(DailyLog)
admin.site.register(Task)