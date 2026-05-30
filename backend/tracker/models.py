from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date

class User(AbstractUser):
    pass

class DailyLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_logs')
    date = models.DateField(default=date.today)
    
    mood = models.CharField(max_length=50, null=True, blank=True)
    sleep_hours = models.FloatField(default=0.0)
    calories = models.IntegerField(default=0)
    caffeine_mg = models.IntegerField(default=0)
    exercise_completed = models.BooleanField(default=False)
    water_glasses = models.IntegerField(default=0)
    
    well_being_score = models.IntegerField(null=True, blank=True)
    recommendations = models.JSONField(default=list, blank=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'date'], name='unique_user_date')
        ]

    def __str__(self):
        return f"{self.user.username}'s log for {self.date}"

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    task_date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} ({self.task_date})"