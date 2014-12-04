# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0011_auto_20141129_2119'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='user_name',
            new_name='name',
        ),
        migrations.AlterField(
            model_name='comment',
            name='article',
            field=models.ForeignKey(to='blog.Article', related_name='comments'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='comment',
            name='submit_date',
            field=models.DateTimeField(default=django.utils.timezone.now, null=True, auto_now_add=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='comment',
            name='user',
            field=models.ForeignKey(null=True, blank=True, to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
