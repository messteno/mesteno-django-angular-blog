from django.contrib.auth.models import User
from rest_framework import serializers
from blog.models import Article, Category
from django.db import models
from rest_framework.serializers import Serializer
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
    tags = TagListSerializer(required=False, blank=True)
    published = serializers.DateTimeField(required=True)

    class Meta:
        model = Article
        fields = ('id', 'user', 'title', 'description', 'content',
                  'code_cut', 'code_content', 'category', 'tags', 'published')

    def get_validation_exclusions(self, instance=None):
        """
        Return a list of field names to exclude from model validation.
        """
        cls = self.opts.model
        opts = cls._meta.concrete_model._meta
        exclusions = [field.name for field in opts.fields + opts.many_to_many]

        for field_name, field in self.fields.items():
            field_name = field.source or field_name
            if (
                field_name in exclusions
                and not field.read_only
                and field_name != 'tags'
                and (field.required or hasattr(instance, field_name))
                and not isinstance(field, Serializer)
            ):
                exclusions.remove(field_name)
        return exclusions
