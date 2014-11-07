from django.db import models


class Article(models.Model):
    article_text = models.TextField()
