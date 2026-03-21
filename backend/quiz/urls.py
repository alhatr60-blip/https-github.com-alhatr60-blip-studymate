from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.generate_quiz, name='quiz-generate'),
    path('history/', views.quiz_history, name='quiz-history'),
]
