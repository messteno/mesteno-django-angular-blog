# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='article',
            name='article_text',
        ),
        migrations.AddField(
            model_name='article',
            name='content',
            field=models.TextField(default='Content'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='article',
            name='title',
            field=models.TextField(default='Title'),
            preserve_default=True,
        ),
    ]
