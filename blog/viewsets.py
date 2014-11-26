from django.shortcuts import get_object_or_404
from blog.serializers import ArticleSerializer, CategorySerializer
from rest_framework import viewsets
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import exception_handler
from blog.models import Article, Category
from blog.permissions import IsOwnerOrReadOnly


class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    queryset = Article.objects.all()
    permission_classes = [IsOwnerOrReadOnly]
    filter_fields = ('category', )

    def pre_save(self, obj):
        obj.user = self.request.user


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
