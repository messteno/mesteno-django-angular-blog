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

TEST_PEP8_DIRS = [os.path.dirname(PROJECT_PATH), ]
TEST_PEP8_EXCLUDE = ['.env', 'migrations', 'static', 'bower', ]

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
    'test_pep8',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # 'debug_toolbar',
    'blog',
    'utils',
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
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mdj',
        'USER': 'root',
        'PASSWORD': 'password',
        'HOST': '',
        'PORT': '',
    }
}

LANGUAGE_CODE = 'ru-Ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_L10N = True

USE_TZ = True

COMPRESS_ENABLED = True

STATIC_URL = '/static/'

STATIC_ROOT = BASE_PATH + '/static'

STATICFILES_DIRS = (
    path('static'),
    path('templates'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'djangobower.finders.BowerFinder',
    'compressor.finders.CompressorFinder',
)

BOWER_COMPONENTS_ROOT = BASE_PATH + '/bower'

BOWER_INSTALLED_APPS = (
    'angular-highlightjs#0.3.2',
    'angular-sanitize#1.3.2',
    'angular-django-rest-resource#1.0.3',
    'angular-animate#1.3.1',
    'angular-ui-ace#0.1.1',
    'ace-builds#1.1.8',
    'bootstrap#3.3.0',
    'angular-cookies#1.3.2',
    'angular-loading-bar#0.6.0',
    'angular-route#1.3.1',
    'angular-ui-router#0.2.11',
    'angular#1.3.2',
    'highlightjs#8.3.0',
    'angular-bootstrap#0.11.2',
    'ace#1.1.8',
    'angular-ui#0.4.0',
    'angular-resource#1.3.1',
    'angular-route-segment#1.3.3')

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
    ],
    'EXCEPTION_HANDLER': 'utils.exceptions.rest_exception_handler'
}

if not DEBUG:
    REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = (
        'rest_framework.renderers.JSONRenderer',
    )

DEBUG_TOOLBAR_PATCH_SETTINGS = False

try:
    from .local_settings import *
except ImportError:
    pass
