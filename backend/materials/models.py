from django.db import models

class Subject(models.Model):
    ICON_CHOICES = [
        ('math', 'Mathematics'),
        ('science', 'Science'),
        ('history', 'History'),
        ('english', 'English'),
        ('programming', 'Programming'),
        ('physics', 'Physics'),
        ('chemistry', 'Chemistry'),
        ('biology', 'Biology'),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='book')
    color = models.CharField(max_length=20, default='#4F46E5')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Material(models.Model):
    TYPE_CHOICES = [
        ('note', 'Note'),
        ('video', 'Video'),
        ('article', 'Article'),
        ('exercise', 'Exercise'),
    ]
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='materials')
    title = models.CharField(max_length=200)
    content = models.TextField()
    material_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='note')
    difficulty = models.CharField(max_length=20, choices=[('beginner','Beginner'),('intermediate','Intermediate'),('advanced','Advanced')], default='beginner')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
