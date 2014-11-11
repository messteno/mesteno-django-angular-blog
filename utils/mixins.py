import json
from django.http import HttpResponse, HttpResponseRedirect, \
    HttpResponsePermanentRedirect


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
                data = form._errors
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
