"""
Django settings for mesteno project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

import os
PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))
BASE_PATH = os.path.dirname(PROJECT_PATH)
path = lambda *args: os.path.join(PROJECT_PATH, *args)

SECRET_KEY = 'r7+9&jzcd^^g449gxnof*3-imjk25t$k(zq_wvtnr^!+-#ihg9'

DEBUG = False

TEMPLATE_DEBUG = False

ALLOWED_HOSTS = ['mesteno.ru']

INTERNAL_IPS = (
    'mesteno.ru',
)

# Application definition

INSTALLED_APPS = (
    'grappelli',
    'bootstrap3',
    'djangobower',
    'compressor',
    'rest_framework',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'mesteno.urls'

WSGI_APPLICATION = 'mesteno.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_PATH, 'db.sqlite3'),
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

COMPRESS_ENABLED = True

STATIC_URL = '/static/'

STATIC_ROOT = BASE_PATH + '/static'

STATICFILES_DIRS = (
    path('static'),
    path('templates', 'angular'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'djangobower.finders.BowerFinder',
    'compressor.finders.CompressorFinder',
)

BOWER_COMPONENTS_ROOT = BASE_PATH + '/bower'

BOWER_INSTALLED_APPS = (
    'jquery#2',
    'angular#1.3.1',
)

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_PATH + '/media'

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.request',
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
)

TEMPLATE_DIRS = (
    path('templates'),
)

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}

if not DEBUG:
    REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = (
        'rest_framework.renderers.JSONRenderer',
    )

try:
    from .local_settings import *
except ImportError:
    pass
