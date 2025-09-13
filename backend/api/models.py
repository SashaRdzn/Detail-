from django.db import models
from django.utils import timezone


class Group(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Группа'
        verbose_name_plural = 'Группы'


class Detail(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новая'),
        ('in_progress', 'В работе'),
        ('completed', 'Завершена'),
        ('on_hold', 'Приостановлена'),
        ('cancelled', 'Отменена'),
    ]
    
    name = models.CharField(max_length=255)
    nomer = models.CharField(max_length=255)
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name='details')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.group.name if self.group else 'Без группы'}) - {self.get_status_display()}"


class Review(models.Model):
    who = models.CharField(max_length=255)
    text = models.CharField(max_length=255)
    detail = models.ForeignKey(Detail, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"Отзыв от {self.who} для {self.detail.name}"