'use strict';

app.controller('MainCtrl', function($scope, $routeSegment, $modal, $window, $location, loader, Profile) {
    $scope.$routeSegment = $routeSegment;
    $scope.loader = loader;
    $scope.profile = Profile.get();

    $scope.$on('routeSegmentChange', function() {
        loader.show = false;
    });

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
    $scope.form = new Form($scope, '/api/login/', function() {
        $modalInstance.close();
        $location.path('/');
        $scope.$apply();
        $window.location.reload();
    });
});
