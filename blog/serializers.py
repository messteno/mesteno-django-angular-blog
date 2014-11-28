from django.contrib.auth.models import User
from rest_framework import serializers
from blog.models import Article, Category
from django.db import models
from rest_framework.exceptions import ParseError


class CategorySerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=True)

    class Meta:
        model = Category
        fields = ('id', 'name')


class TagListSerializer(serializers.WritableField):

    def from_native(self, data):
        if type(data) is not list:
            data = data.split(',')
            if type(data) is not list:
                raise ParseError("expected a list of data")
        return data

    def to_native(self, obj):
        if type(obj) is not list:
            return [tag.name for tag in obj.all()]
        return obj


class ArticleSerializer(serializers.ModelSerializer):
    user = serializers.RelatedField(many=False)
    title = serializers.CharField(required=True)
    description = serializers.CharField(required=False)
    content = serializers.CharField(required=True)
    code_content = serializers.CharField(required=False)
    code_cut = serializers.CharField(required=False)
    tags = TagListSerializer(required=False)
    published = serializers.DateTimeField(required=True)

    class Meta:
        model = Article
        fields = ('id', 'user', 'title', 'description', 'content',
                  'code_cut', 'code_content', 'category', 'tags', 'published')
