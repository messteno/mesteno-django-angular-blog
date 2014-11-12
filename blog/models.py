from django.utils import timezone
from django.db import models


class Article(models.Model):
    title = models.TextField(null=False, blank=False, default='Title')
    content = models.TextField(null=False, blank=False, default='Content')
    published = models.DateTimeField(null=False, auto_now_add=True,
                                     default=timezone.now)
