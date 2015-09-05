#!/usr/bin/env python
# -*- coding: utf-8 -*-

from django.utils.encoding import force_text
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import models
from taggit.managers import TaggableManager


class Category(models.Model):
    name = models.CharField(null=False, blank=False, max_length=128,
                            verbose_name=u'Название')

    class Meta:
        verbose_name = u'категория'
        verbose_name_plural = u'категории'

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name


class Article(models.Model):
    user = models.ForeignKey(User, null=True, related_name='user')
    title = models.TextField(null=False, blank=False, default='Title',
                             verbose_name=u'Заголовок')
    description = models.TextField(null=True, blank=True,
                                   verbose_name=u'Описание')
    content = models.TextField(null=False, blank=False, default='Content',
                               verbose_name=u'Содержание')
    category = models.ForeignKey(Category, null=True, blank=True)
    tags = TaggableManager(blank=True)
    published = models.DateTimeField(null=False, auto_now_add=True,
                                     default=timezone.now,
                                     verbose_name=u'Дата публикации')
    draft = models.BooleanField(default=False)

    class Meta:
        verbose_name = u'статья'
        verbose_name_plural = u'статьи'

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

    def code_cut(self):
        html = self.code_content()
        stop = html.find('</cut>', 0)
        if stop == -1:
            return ''
        return html[:stop]

    def __str__(self):
        return self.title

    def __unicode__(self):
        return self.title


class Comment(models.Model):
    user = models.ForeignKey(User, blank=True, null=True)
    name = models.CharField(max_length=50, blank=True)
    comment = models.TextField(max_length=1024, blank=False, null=False)
    submit_date = models.DateTimeField(null=True, auto_now_add=True,
                                       default=timezone.now)
    article = models.ForeignKey(Article, blank=False, null=False,
                                related_name='comments')

    class Meta:
        ordering = ('submit_date',)
        verbose_name = u'комментарий'
        verbose_name_plural = u'комментарии'

    def __str__(self):
        return "%s: %s..." % (self.name, self.comment[:50])

    def save(self, *args, **kwargs):
        if self.submit_date is None:
            self.submit_date = timezone.now()
        super(Comment, self).save(*args, **kwargs)
