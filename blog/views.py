from django.shortcuts import render
from blog.forms import ArticleForm
from django.views.generic.edit import FormView
from django.http import HttpResponse, HttpResponseRedirect
from utils.mixins import AjaxCapableProcessFormViewMixin


class ArticleAddView(AjaxCapableProcessFormViewMixin, FormView):
    form_class = ArticleForm
    template_name = 'angular/articles/add.html'
    success_url = '/articles/list'

    def form_valid(self, form):
        form.save()
        return HttpResponseRedirect(self.get_success_url())
