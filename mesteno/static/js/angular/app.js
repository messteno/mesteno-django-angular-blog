'use strict';

var baseSettings = function() {
};

var routerSettings = function($routeSegmentProvider, $routeProvider) {
    $routeSegmentProvider.options.autoLoadTemplates = true;
    $routeSegmentProvider
        .when('/main', 'main')
        .segment('main', {
            templateUrl: '/static/main.html',
        });
    $routeProvider.otherwise({redirectTo: '/main'});
};

var app = angular
    .module('mesteno', [
        'ngRoute',
        'ngAnimate',
        'djangoRESTResources',
        'route-segment',
        'view-segment',
        'mestenoServices',
    ])
    .config(baseSettings)
    .config(routerSettings);

app.value('loader', {show: false});

