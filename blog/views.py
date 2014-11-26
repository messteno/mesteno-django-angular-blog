from rest_framework import views
from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from utils import get_uuid_file_path, get_media_url_path
from django.conf import settings


class ArticleImageUploadView(views.APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser,)

    def put(self, request, format=None):
        file_obj = request.FILES['file']
        new_path = get_uuid_file_path(settings.MEDIA_ROOT, 'img', file_obj.name)
        with open(new_path, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)
        result_path = get_media_url_path(new_path)
        content = {'result': result_path}
        return Response(content, status=200)
