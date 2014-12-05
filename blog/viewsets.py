from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User, AnonymousUser
from blog.serializers import (
    ArticleSerializer,
    CategorySerializer,
    CommentSerializer,
)
from rest_framework import viewsets
from rest_framework import status
from rest_framework import filters
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import exception_handler
from blog.models import Article, Category, Comment
from blog.permissions import (
    IsOwnerOrReadOnly,
    IsDraftOwner,
    IsDraftOwnerFilterBackend,
)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]


class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    queryset = Article.objects.all().order_by('-published')
    permission_classes = [IsOwnerOrReadOnly, IsAuthenticatedOrReadOnly,
                          IsDraftOwner]
    filter_backends = [IsDraftOwnerFilterBackend, filters.DjangoFilterBackend]
    paginate_by = 10
    filter_fields = ('category', )

    def pre_save(self, obj):
        if self.request.user.is_authenticated():
            obj.user = self.request.user

    def post_save(self, obj, *args, **kwargs):
        saved = Article.objects.get(pk=obj.pk)
        if type(obj.tags) is list:
            saved.tags.clear()
            for tag in obj.tags:
                saved.tags.add(tag)
        else:
            saved.tags.clear()


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all().order_by('submit_date')
    permission_classes = [IsOwnerOrReadOnly]

    def pre_save(self, obj):
        # TODO: remove possibility to create comment for unpublished articles
        if self.request.user.is_authenticated():
            obj.user = self.request.user
