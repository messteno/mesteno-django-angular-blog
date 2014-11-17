import json
from django.contrib.auth import login
from rest_framework.views import APIView
from django.views.generic.base import View
from django.views.generic.edit import FormView
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import logout
from django.http import HttpResponse, HttpResponseRedirect
from .serializers import ProfileSerializer
from utils.mixins import AjaxCapableProcessFormViewMixin
from rest_framework.response import Response


class ProfileView(APIView):
    model = User

    def get(self, request, format=None):
        response = {
            'is_logged_in': False,
            'user': None,
        }
        if request.user.is_authenticated():
            serializer = ProfileSerializer(request.user, many=False)
            response['is_logged_in'] = True
            response['user'] = serializer.data

        return Response(response)


class LogoutView(View):
    def get(self, request):
        logout(request)
        response = {'status': 'ok'}
        return HttpResponse(json.dumps(response),
                            content_type='application/json')


class LoginView(AjaxCapableProcessFormViewMixin, FormView):
    form_class = AuthenticationForm
    template_name = 'mesteno/login.html'
    success_url = '/'

    def form_valid(self, form):
        login(self.request, form.get_user())
        return HttpResponseRedirect(self.get_success_url())
