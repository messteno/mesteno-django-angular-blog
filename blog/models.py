from django.db import models


class Article(models.Model):
    title = models.TextField(null=False, blank=False, default='Title')
    content = models.TextField(null=False, blank=False, default='Content')
