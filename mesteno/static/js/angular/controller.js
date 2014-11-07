'use strict';

app.controller('MainCtrl', function($scope, $routeSegment, loader, Profile) {
    $scope.$routeSegment = $routeSegment;
    $scope.loader = loader;
    $scope.profile = Profile.get();

    $scope.$on('routeSegmentChange', function() {
        loader.show = false;
    })
});

