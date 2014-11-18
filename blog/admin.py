from django.contrib import admin
from blog.models import Article, Category


class ArticleAdmin(admin.ModelAdmin):
    list_display_links = ('id', )
    list_display = ('id', 'title', 'content', 'published', )
    search_fields = ('title', 'content', )
    list_editable = ()
admin.site.register(Article, ArticleAdmin)


class CategoryAdmin(admin.ModelAdmin):
    list_display_links = ('id', )
    list_display = ('id', 'name', )
    search_fields = ('name', )
    list_editable = ()
admin.site.register(Category, CategoryAdmin)
