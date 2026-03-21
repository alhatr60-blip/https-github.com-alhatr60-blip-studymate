from django.db import models

class Quiz(models.Model):
    topic = models.CharField(max_length=200)
    subject = models.CharField(max_length=100, blank=True)
    difficulty = models.CharField(max_length=20, choices=[('easy','Easy'),('medium','Medium'),('hard','Hard')], default='medium')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Quiz: {self.topic}"

    class Meta:
        verbose_name_plural = 'Quizzes'

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    option_a = models.CharField(max_length=300)
    option_b = models.CharField(max_length=300)
    option_c = models.CharField(max_length=300)
    option_d = models.CharField(max_length=300)
    correct_answer = models.CharField(max_length=1, choices=[('A','A'),('B','B'),('C','C'),('D','D')])
    explanation = models.TextField(blank=True)

    def __str__(self):
        return self.question_text[:60]
