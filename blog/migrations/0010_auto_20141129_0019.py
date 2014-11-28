# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import taggit.managers


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0009_article_tags'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='tags',
            field=taggit.managers.TaggableManager(blank=True, through='taggit.TaggedItem', help_text='A comma-separated list of tags.', to='taggit.Tag', verbose_name='Tags'),
            preserve_default=True,
        ),
    ]
