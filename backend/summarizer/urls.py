from django.urls import path
from . import views

urlpatterns = [
    path('summarize/', views.summarize_text, name='summarizer-summarize'),
    path('history/', views.note_history, name='summarizer-history'),
]
