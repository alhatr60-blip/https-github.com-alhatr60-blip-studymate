from django.db import models

class StudentProfile(models.Model):
    name = models.CharField(max_length=100, default='Student')
    quizzes_taken = models.IntegerField(default=0)
    notes_summarized = models.IntegerField(default=0)
    chat_sessions = models.IntegerField(default=0)
    materials_viewed = models.IntegerField(default=0)
    streak_days = models.IntegerField(default=0)
    last_active = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
