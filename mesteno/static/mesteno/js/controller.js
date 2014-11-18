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

app.controller('ArticleListCtrl', function($scope, $modal, Article) {
    $scope.articleList = {};
    $scope.articleList.articles = Article.query();
    $scope.deleteArticle = function(articleId) {
        var modalInstance = $modal.open({
            templateUrl: '/static/mesteno/articles/delete.html',
            controller: 'ArticleDeleteCtrl',
            windowClass: 'article-delete-modal',
            scope: $scope,
            resolve: {
                articleId: function() {
                    return articleId;
                }
            }
        });
    };
});

app.controller('ArticleItemCtrl', function($scope, $compile, $sce, $stateParams, $modal, $location, $filter, Article, Form) {
    $scope.article = Article.get({articleId: $stateParams.articleId}, function() {
        $scope.article.published = $filter('date')($scope.article.published, 'yyyy-MM-dd hh:mm:ss');
    }, function() {
        $location.path('404');
    });
    $scope.deleteArticle = function() {
        var modalInstance = $modal.open({
            templateUrl: '/static/mesteno/articles/delete.html',
            controller: 'ArticleDeleteCtrl',
            windowClass: 'article-delete-modal',
            scope: $scope,
            resolve: {
                articleId: function() {
                    return $stateParams.articleId;
                }
            }
        });
    };
});

app.controller('ArticleDeleteCtrl', function($scope, $modalInstance, $location, Article, Form, articleId) {
    $scope.form = new Form($scope, '/api/articles/' + articleId + '/', function(data) {
        $modalInstance.close();
        $scope.articleList.articles = Article.query();
        $location.path('/articles/list');
    });
    $scope.form.method = 'DELETE';
    $scope.form.focus.delete = true;

    $scope.closeModal = function() {
        $modalInstance.close();
    };
});

app.controller('ArticleEditCtrl', function($scope, $state, $stateParams, $location, Article, Form) {
    var articleId = $stateParams.articleId;
    $scope.form = new Form($scope, '/api/articles/' + articleId + '/', function(data) {
        $location.path('/articles/' + articleId);
    });
    $scope.form.focus.title = true;
    $scope.form.action = 'Редактировать статью';
    $scope.form.method = 'PUT';

    $scope.article = Article.get({articleId: $stateParams.articleId}, function() {
        $scope.form.data.title = $scope.article.title;
        $scope.form.data.content = $scope.article.content;
        $scope.form.data.published = $scope.article.published;
    }, function() {
        $location.path('404');
    });
});

app.controller('ArticleAddCtrl', function($scope, $location, $filter, Form, FileUploader) {
    $scope.form = new Form($scope, '/api/articles/add/', function(data) {
        $location.path('/articles/list');
    });
    $scope.form.action = 'Новая статья';
    $scope.form.focus.title = true;
    var date = new Date();
    $scope.form.data.published = $filter('date')(date, 'yyyy-MM-dd hh:mm:ss');
    $scope.uploader = new FileUploader();
});
