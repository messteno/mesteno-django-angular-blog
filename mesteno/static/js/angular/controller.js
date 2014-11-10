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
});

app.controller('ArticleAddCtrl', function($scope, $location, Form) {
    $scope.form = new Form($scope, '/api/articles/add/', function(data) {
        $location.path(data.location);
    });
});
