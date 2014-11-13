from django.contrib.auth.models import User
from rest_framework import serializers
from blog.models import Article
from django.db import models


class ArticleSerializer(serializers.ModelSerializer):
    user = serializers.RelatedField(many=False)
    title = serializers.CharField(required=True)
    content = serializers.CharField(required=True)
    code_content = serializers.CharField(required=False)
    published = serializers.DateTimeField(required=True)

    class Meta:
        model = Article
        fields = ('id', 'user', 'title', 'content', 'code_content', 'published')
