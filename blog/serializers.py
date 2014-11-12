from django.contrib.auth.models import User
from rest_framework import serializers
from blog.models import Article
from django.db import models


class ArticleSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True)
    content = serializers.CharField(required=True)
    published = serializers.DateTimeField(required=True)

    class Meta:
        model = Article
        fields = ('id', 'title', 'content', 'published')
