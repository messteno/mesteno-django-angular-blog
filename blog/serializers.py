from django.contrib.auth.models import User
from rest_framework import serializers
from blog.models import Article, Category
from django.db import models


class ArticleSerializer(serializers.ModelSerializer):
    user = serializers.RelatedField(many=False)
    title = serializers.CharField(required=True)
    content = serializers.CharField(required=True)
    code_content = serializers.CharField(required=False)
    published = serializers.DateTimeField(required=True)

    class Meta:
        model = Article
        fields = ('id', 'user', 'title', 'content',
                  'code_content', 'category', 'published')


class CategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)

    class Meta:
        model = Category
        fields = ('id', 'name')
