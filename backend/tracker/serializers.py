from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Task, DailyLog

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'task_date', 'start_time', 'end_time', 'is_completed']


class DailyLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = [
            'id', 'date', 'mood', 'sleep_hours', 'calories', 
            'caffeine_mg', 'exercise_completed', 'water_glasses', 
            'well_being_score', 'recommendations'
        ]
        read_only_fields = ['id', 'date', 'well_being_score', 'recommendations']