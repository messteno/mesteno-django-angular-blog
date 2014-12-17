from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.models import User
from django.views.generic.base import TemplateView
from rest_framework import routers
from .viewsets import UserViewSet
from .views import ProfileView, LogoutView, LoginView
from blog.viewsets import (
    ArticleViewSet,
    CategoryViewSet,
    CommentViewSet,
    TagViewSet
)
from blog.views import ArticleImageUploadView


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'articles', ArticleViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet, 'Tag')
router.register(r'comments', CommentViewSet)


urlpatterns = patterns(
    '',
    url(r'^$', TemplateView.as_view(template_name='mesteno/index.html'),
        name='index'),
    url(r'^grappelli/', include('grappelli.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/articles/add/', ArticleViewSet.as_view({'post': 'create'})),
    url(r'^api/article/imgupload/', ArticleImageUploadView.as_view()),
    url(r'^api/profile/', ProfileView.as_view()),
    url(r'^api/logout/', LogoutView.as_view()),
    url(r'^api/login/', LoginView.as_view()),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls',
        namespace='rest_framework')),
    url(r'^blog/', include('blog.urls')),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
