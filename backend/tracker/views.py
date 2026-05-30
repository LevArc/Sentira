import os
import json
from google import genai
from google.genai import types  
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, TaskSerializer, DailyLogSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import date
from .models import DailyLog, Task
from rest_framework.decorators import api_view, permission_classes

User = get_user_model()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.filter(user=user)
        
        task_date = self.request.query_params.get('date', None)
        if task_date:
            queryset = queryset.filter(task_date=task_date)
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskUpdateView(generics.UpdateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)


class DailyLogTodayView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            log = DailyLog.objects.get(user=request.user, date=date.today())
            serializer = DailyLogSerializer(log)
            return Response(serializer.data)
        except DailyLog.DoesNotExist:
            return Response({
                "message": "No data logged for today yet."
            }, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        
        sleep = float(data.get('sleep_hours', 0))
        water = int(data.get('water_glasses', 0))
        mood = data.get('mood', 'Neutral')
        exercise = data.get('exercise_completed', False)
        
        prompt = f"""
        You are a supportive mental wellness AI. A user logged these metrics today:
        - Mood: {mood}
        - Sleep: {sleep} hours
        - Water: {water} glasses
        - Exercised: {exercise}
        
        Evaluate these metrics against the baseline of an average healthy adult. 
        
        Rules:
        1. Calculate an overall "well_being_score" from 0 to 100 based on how closely they align with an average healthy adult's ideal metrics.
        2. Provide between 0 and 3 brief, encouraging recommendations. If they are doing perfectly, 0 recommendations is fine.
        3. Create 0 to 3 highly specific, actionable tasks to put on their calendar today to help them achieve these recommendations.
        4. Use 24-hour format for times (HH:MM:SS). Assume the current time is evening. 
        
        You MUST respond using exactly this JSON structure:
        {{
            "well_being_score": 85,
            "recommendations": ["string1", "string2"],
            "suggested_tasks": [
                {{"title": "Drink a glass of water", "start_time": "19:00:00", "end_time": "19:05:00"}}
            ]
        }}
        """
        
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                ),
            )
            ai_data = json.loads(response.text)
            
            final_score = ai_data.get("well_being_score", 50) 
            recommendations = ai_data.get("recommendations", [])
            suggested_tasks = ai_data.get("suggested_tasks", [])
            
        except Exception as e:
            print(f"Gemini API Error: {e}")
            final_score = 50
            recommendations = ["Keep focusing on your healthy habits!"]
            suggested_tasks = []

        log, created = DailyLog.objects.update_or_create(
            user=request.user,
            date=date.today(),
            defaults={
                'mood': mood,
                'sleep_hours': sleep,
                'calories': data.get('calories', 0),
                'caffeine_mg': data.get('caffeine_mg', 0),
                'exercise_completed': exercise,
                'water_glasses': water,
                'well_being_score': final_score,
                'recommendations': recommendations
            }
        )
        
        for task_data in suggested_tasks:
            Task.objects.get_or_create(
                user=request.user,
                title=task_data.get("title"),
                task_date=date.today(),
                defaults={
                    'start_time': task_data.get("start_time"),
                    'end_time': task_data.get("end_time"),
                    'is_completed': False
                }
            )
        
        serializer = DailyLogSerializer(log)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Returns the profile data of the logged-in user."""
    return Response({
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email
    })