'use strict';

app.controller('MainCtrl', function($scope, $modal, $window, $location, loader, Profile) {
    $scope.loader = loader;
    $scope.profile = Profile.get();

    $scope.logout = function() {
        $scope.profile.$logout(function() {
            $location.path('/');
            $scope.$apply();
            $window.location.reload();
        });
    };

    $scope.login = function() {
        var modalInstance = $modal.open({
            templateUrl: '/static/mesteno/login.html',
            controller: 'LoginModalCtrl',
            windowClass: 'login-modal',
            scope: $scope,
        });
    };

    $scope.aceLoaded = function(editor) {
        editor.setDisplayIndentGuides(false)
        editor.setHighlightActiveLine(false);
        editor.setShowPrintMargin(false);
        editor.renderer.setShowGutter(false);
    };
});

app.controller('LoginModalCtrl', function($scope, $modalInstance, $location, $window, Form) {
    $scope.form = new Form($scope, '/api/login/', function(data) {
        $modalInstance.close();
        $location.path(data.location);
        $window.location.reload();
    });
    $scope.form.focus.username = true;
});

app.controller('ArticleCtrl', function($scope, Category, Tag) {
    $scope.categories = Category.query();

    // TODO: go-back update bug
    $scope.tags = Tag.query();
});

app.controller('ArticleListCtrl', function($scope, $modal, $state, $stateParams, Articles) {
    $scope.page = $stateParams.page;
    $scope.categoryId = 0;
    $scope.articles = new Articles($scope);
    $scope.pageChanged = function() {
        $state.go('articles.list', {page: $scope.page});
    };
});

app.controller('ArticleCategoryCtrl', function($scope, $modal, $state, $stateParams, Articles) {
    $scope.page = $stateParams.page;
    $scope.categoryId = $stateParams.categoryId;
    $scope.articles = new Articles($scope);
    $scope.pageChanged = function() {
        $state.go('articles.category', {category: $scope.categoryId, page: $scope.page});
    };
});

app.controller('ArticleTagCtrl', function($scope, $modal, $state, $stateParams, Articles) {
    $scope.page = $stateParams.page;
    $scope.tagId = $stateParams.tagId;
    $scope.articles = new Articles($scope);
    $scope.pageChanged = function() {
        $state.go('articles.tag', {tag: $scope.tagId, page: $scope.page});
    };
});

app.controller('ArticleItemCtrl', function($scope, $compile, $sce, $stateParams,
                                           $modal, $location, $filter, Article, 
                                           Category, Form) {
    $scope.article = Article.get({articleId: $stateParams.articleId}, function() {
        $scope.article.published = $filter('date')($scope.article.published, 'yyyy-MM-dd hh:mm:ss');
    }, function() {
        $location.path('404');
    });
    $scope.deleteArticle = function() {
        var modalInstance = $modal.open({
            templateUrl: '/static/mesteno/articles/delete.html',
            controller: 'ArticleDeleteFromDetailCtrl',
            windowClass: 'article-delete-modal',
            scope: $scope,
            resolve: {
                articleId: function() {
                    return $stateParams.articleId;
                }
            }
        });
    };
    $scope.form = new Form($scope, '/api/comments/', function(data) {
        $scope.article.comments = $scope.article.comments.concat(data);
    });
    $scope.form.data.name = $scope.profile.user ? $scope.profile.user.username : '';
    $scope.form.beforeSubmit = function() {
        var date = new Date();
        $scope.form.data.submit_date = $filter('date')(date, 'yyyy-MM-dd hh:mm:ss');
        $scope.form.data.article = $stateParams.articleId;
    };
});

app.controller('ArticleDeleteFromListCtrl', function($scope, $modalInstance, $state, Form, articleId) {
    $scope.form = new Form($scope, '/api/articles/' + articleId + '/', function(data) {
        $modalInstance.close();
        $scope.articles.reload();
    });
    $scope.form.method = 'DELETE';
    $scope.form.focus.delete = true;

    $scope.closeModal = function() {
        $modalInstance.close();
    };
});

app.controller('ArticleDeleteFromDetailCtrl', function($scope, $modalInstance, $stateParams, $state, Form, articleId) {
    $scope.form = new Form($scope, '/api/articles/' + articleId + '/', function(data) {
        $modalInstance.close();
        $state.go('articles.list', {page: 1});
    });
    $scope.form.method = 'DELETE';
    $scope.form.focus.delete = true;

    $scope.closeModal = function() {
        $modalInstance.close();
    };
});

app.controller('ArticleEditCtrl', function($scope, $state, $stateParams, Article, ImageUploader, Category, Form) {
    var articleId = $stateParams.articleId;
    $scope.form = new Form($scope, '/api/articles/' + articleId + '/', function(data, params) {
        if (params !== undefined && params.edit === true) {
            $scope.form.data = data;
        } else {
            $state.go('articles.item', {articleId: data.id});
        }
    });
    $scope.form.focus.title = true;
    $scope.form.action = 'Редактировать статью';
    $scope.form.method = 'PUT';

    $scope.form.beforeSubmit = function() {
        if ($scope.article.tags.length > 0) {
            var tags = [];
            for (var i in $scope.article.tags) {
                tags = tags.concat([$scope.article.tags[i].text]);
            }
            $scope.form.data.tags = tags.join();
        }
    };

    $scope.article = Article.get({articleId: $stateParams.articleId}, function() {
        $scope.form.data.title = $scope.article.title;
        $scope.form.data.description = $scope.article.description;
        $scope.form.data.content = $scope.article.content;
        $scope.form.data.published = $scope.article.published;
        $scope.form.data.category = $scope.article.category;
        $scope.form.data.tags = $scope.article.tags;
        $scope.form.data.draft = $scope.article.draft;
    }, function() {
        $location.path('404');
    });

    var imageUploader = new ImageUploader($scope);
    $scope.uploader = imageUploader.uploader;
});

app.controller('ArticleAddCtrl', function($scope, $state, $filter, $cookies, $route, Form, ImageUploader, Category) {
    $scope.categories = Category.query();
    $scope.form = new Form($scope, '/api/articles/add/', function(data, params) {
        if (params !== undefined && params.edit === true) {
            $state.go('articles.item.edit', {articleId: data.id});
        } else {
            $state.go('articles.item', {articleId: data.id});
        }
    });
    $scope.form.action = 'Новая статья';
    $scope.form.focus.title = true;
    $scope.form.data.draft = false;

    $scope.form.beforeSubmit = function() {
        if ($scope.article.tags && $scope.article.tags.length > 0) {
            var tags = [];
            for (var i in $scope.article.tags) {
                tags = tags.concat([$scope.article.tags[i].text]);
            }
            $scope.form.data.tags = tags.join();
        }
    };

    $scope.article = {};

    var date = new Date();
    $scope.form.data.published = $filter('date')(date, 'yyyy-MM-dd hh:mm:ss');

    var imageUploader = new ImageUploader($scope);
    $scope.uploader = imageUploader.uploader;
});

