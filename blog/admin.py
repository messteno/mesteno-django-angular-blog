from django.contrib import admin
from blog.models import Article, Category, Comment


class ArticleAdmin(admin.ModelAdmin):
    list_display_links = ('id', )
    list_display = ('id', 'title', 'description', 'content',
                    'published', 'category', )
    list_filter = ('category', )
    search_fields = ('title', 'description', 'content', 'category', )
    list_editable = ()
admin.site.register(Article, ArticleAdmin)


class CategoryAdmin(admin.ModelAdmin):
    list_display_links = ('id', )
    list_display = ('id', 'name', )
    search_fields = ('name', )
    list_editable = ()
admin.site.register(Category, CategoryAdmin)


class CommentAdmin(admin.ModelAdmin):
    list_display_links = ('id', )
    list_display = ('id', 'name', 'comment', )
    search_fields = ('name' 'comment', )
    list_editable = ()
admin.site.register(Comment, CommentAdmin)
