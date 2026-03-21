from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/chatbot/', include('chatbot.urls')),
    path('api/materials/', include('materials.urls')),
    path('api/quiz/', include('quiz.urls')),
    path('api/summarizer/', include('summarizer.urls')),
    path('api/dashboard/', include('dashboard.urls')),
]
