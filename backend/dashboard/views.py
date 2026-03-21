from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import StudentProfile
from materials.models import Subject, Material
from quiz.models import Quiz
from summarizer.models import Note
from chatbot.models import ChatSession
import random

@csrf_exempt
@require_http_methods(["GET"])
def get_stats(request):
    # Ensure profile exists
    profile, created = StudentProfile.objects.get_or_create(id=1, defaults={'name': 'Student'})
    
    # Refresh stats from DB
    profile.quizzes_taken = Quiz.objects.count()
    profile.notes_summarized = Note.objects.count()
    profile.chat_sessions = ChatSession.objects.count()
    profile.materials_viewed = random.randint(10, 50) # Demo random
    profile.streak_days = random.randint(3, 12) # Demo random
    profile.save()

    return JsonResponse({
        'name': profile.name,
        'stats': {
            'quizzes_taken': profile.quizzes_taken,
            'notes_summarized': profile.notes_summarized,
            'chat_sessions': profile.chat_sessions,
            'materials_viewed': profile.materials_viewed,
            'streak_days': profile.streak_days,
        },
        'recent_activity': [
            {"id": 1, "type": "quiz", "title": "Completed Python Basics Quiz", "time": "2 hours ago"},
            {"id": 2, "type": "chat", "title": "Asked about Calculus derivatives", "time": "5 hours ago"},
            {"id": 3, "type": "note", "title": "Summarized Physics lecture notes", "time": "1 day ago"},
        ]
    })
