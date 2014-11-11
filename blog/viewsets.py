from django.shortcuts import get_object_or_404
from blog.serializers import ArticleSerializer
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from blog.models import Article


class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    queryset = Article.objects.all()
    success_create_url = '/articles/list'
    permission_classes = []

    def create(self, request):
        serializer = self.get_serializer(data=request.DATA,
                                         files=request.FILES)

        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response({'location': self.success_create_url,
                             'data': serializer.data},
                            status=status.HTTP_201_CREATED,
                            headers=headers)

        return Response({'form_errors': serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)
