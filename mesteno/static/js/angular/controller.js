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
            templateUrl: '/static/login.html',
            controller: 'LoginModalCtrl',
            windowClass: 'login-modal',
            scope: $scope,
        });
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

app.controller('ArticleListCtrl', function($scope, Article) {
    $scope.articles = Article.query();
});

app.controller('ArticleItemCtrl', function($scope, $stateParams, $modal, $filter, Article, Form) {
    $scope.article = Article.get({articleId: $stateParams.articleId}, function() {
        $scope.article.published = $filter('date')($scope.article.published, 'yyyy-MM-dd hh:mm:ss');
    });
    $scope.deleteArticle = function() {
        var modalInstance = $modal.open({
            templateUrl: 'static/articles/delete.html',
            controller: 'ArticleDeleteCtrl',
            windowClass: 'article-delete-modal',
            scope: $scope,
        });
    };
});

app.controller('ArticleDeleteCtrl', function($scope, $stateParams, $modalInstance, $location, Form) {
    $scope.form = new Form($scope, '/api/articles/' + $stateParams.articleId + '/', function(data) {
        $modalInstance.close();
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
    $scope.form.method = 'PUT';

    $scope.article = Article.get({articleId: $stateParams.articleId}, function() {
        $scope.form.data.title = $scope.article.title;
        $scope.form.data.content = $scope.article.content;
        $scope.form.data.published = $scope.article.published;
    });
});

app.controller('ArticleAddCtrl', function($scope, $location, $filter, Form) {
    $scope.form = new Form($scope, '/api/articles/add/', function(data) {
        $location.path('/articles/list');
    });
    $scope.form.focus.title = true;
    var date = new Date();
    $scope.form.data.published = $filter('date')(date, 'yyyy-MM-dd hh:mm:ss');
});

