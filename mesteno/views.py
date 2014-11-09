import json
from django.contrib.auth import login
from rest_framework.views import APIView
from django.views.generic.base import View
from django.views.generic.edit import FormView
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import logout
from django.http import HttpResponse, HttpResponseRedirect, \
    HttpResponsePermanentRedirect
from .serializers import ProfileSerializer
from rest_framework.response import Response


def _ajax_response(request, response, form=None):
    if request.is_ajax():
        if (isinstance(response, HttpResponseRedirect)
                or isinstance(response, HttpResponsePermanentRedirect)):
            redirect_to = response['Location']
        else:
            redirect_to = None

        data = {}
        if redirect_to:
            status = 200
            data['location'] = redirect_to
        if form:
            if form.is_valid():
                status = 200
            else:
                status = 400
                data['form_errors'] = form._errors
            if hasattr(response, 'render'):
                response.render()
        return HttpResponse(json.dumps(data),
                            status=status,
                            content_type='application/json')
    return response


class AjaxCapableProcessFormViewMixin(object):
    def post(self, request, *args, **kwargs):
        form_class = self.get_form_class()
        form = self.get_form(form_class)
        if form.is_valid():
            response = self.form_valid(form)
        else:
            response = self.form_invalid(form)
        return _ajax_response(self.request, response, form=form)


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
                            content_type="application/json")


class LoginView(AjaxCapableProcessFormViewMixin, FormView):
    form_class = AuthenticationForm
    template_name = 'angular/login.html'
    success_url = '/'

    def form_valid(self, form):
        login(self.request, form.get_user())
        return HttpResponseRedirect(self.get_success_url())
