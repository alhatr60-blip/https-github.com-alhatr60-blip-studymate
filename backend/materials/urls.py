from django.urls import path
from . import views

urlpatterns = [
    path('subjects/', views.list_subjects, name='subject-list'),
    path('subjects/<int:subject_id>/materials/', views.subject_materials, name='subject-materials'),
]
