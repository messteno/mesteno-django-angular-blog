# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('blog', '0010_auto_20141129_0019'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user_name', models.CharField(max_length=50, blank=True)),
                ('comment', models.TextField(max_length=1024)),
                ('submit_date', models.DateTimeField(default=None)),
                ('article', models.ForeignKey(to='blog.Article')),
                ('user', models.ForeignKey(null=True, related_name='comment_user', to=settings.AUTH_USER_MODEL, blank=True)),
            ],
            options={
                'verbose_name_plural': 'комментарии',
                'verbose_name': 'комментарий',
                'ordering': ('submit_date',),
            },
            bases=(models.Model,),
        ),
        migrations.AlterModelOptions(
            name='article',
            options={'verbose_name_plural': 'статьи', 'verbose_name': 'статья'},
        ),
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name_plural': 'категории', 'verbose_name': 'категория'},
        ),
    ]
