import uuid
import os
from django.conf import settings


def get_uuid_file_path(*args):
    filename = args[-1]
    args = list(args[:-1])
    extension = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), extension)
    args.append(filename)
    return os.path.join(*args)


def get_media_url_path(path):
    path = path.replace(settings.MEDIA_ROOT, "")
    if path[0] == '/':
        path = path[1:]
    path = settings.MEDIA_URL + path
    return path
