from django.utils.encoding import force_text
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import models


class Article(models.Model):
    user = models.ForeignKey(User, null=True, related_name='user')
    title = models.TextField(null=False, blank=False, default='Title')
    content = models.TextField(null=False, blank=False, default='Content')
    published = models.DateTimeField(null=False, auto_now_add=True,
                                     default=timezone.now)

    def code_content(self):
        html = self.content
        out = ""
        old_start = 0
        start = html.find("<code", old_start)
        while start != -1:
            out += html[old_start:(start + 5)]
            old_start = start + 5

            start = html.find(">", old_start)
            if start != -1:
                out += html[old_start:(start + 1)]
                old_start = start + 1
            else:
                break

            start = html.find("</code>", old_start)
            if start != -1:
                out += force_text(html[old_start:start]).replace('<', '&lt;').replace('>', '&gt;')
                out += "</code>"
                old_start = start + 7

            start = html.find("<code", old_start)

        out += html[old_start:]
        return out
