from django.urls import path
from . import views

urlpatterns = [
    path('ask/', views.ask_chatbot, name='chatbot-ask'),
    path('history/<str:session_id>/', views.get_history, name='chatbot-history'),
    path('clear/<str:session_id>/', views.clear_history, name='chatbot-clear'),
]
