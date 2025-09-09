from django.db import models



class Detail(models.Model):
    name = models.CharField(max_length=255)
    nomer = models.CharField(max_length=255)

class Review(models.Model):
    who = models.CharField(max_length=255)
    text = models.CharField(max_length=255)
    detail = models.ForeignKey(Detail, on_delete=models.CASCADE)