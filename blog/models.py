from django.utils.encoding import force_text
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import models


class Article(models.Model):
    user = models.ForeignKey(User, null=True, related_name='user')
    title = models.TextField(null=False, blank=False, default='Title',
                             verbose_name=u'Заголовок')
    content = models.TextField(null=False, blank=False, default='Content',
                               verbose_name=u'Содержание')
    published = models.DateTimeField(null=False, auto_now_add=True,
                                     default=timezone.now,
                                     verbose_name=u'Дата публикации')

    class Meta:
        verbose_name = u'Статья'
        verbose_name_plural = u'Статьи'

    def code_content(self):
        html = self.content
        out = ''
        old_start = 0
        start = html.find('<code', old_start)
        while start != -1:
            out += html[old_start:(start + 5)]
            old_start = start + 5

            start = html.find('>', old_start)
            if start != -1:
                out += html[old_start:(start + 1)]
                old_start = start + 1
            else:
                break

            start = html.find('</code>', old_start)
            if start != -1:
                out += force_text(html[old_start:start]) \
                    .replace('<', '&lt;').replace('>', '&gt;')
                out += '</code>'
                old_start = start + 7

            start = html.find('<code', old_start)

        out += html[old_start:]
        return out

    def __unicode__(self):
        return self.title


class Category(models.Model):
    name = models.CharField(null=False, blank=False, max_length=128,
                            verbose_name=u'Название')

    class Meta:
        verbose_name = u'Категория'
        verbose_name_plural = u'Категории'

    def __unicode__(self):
        return self.name
