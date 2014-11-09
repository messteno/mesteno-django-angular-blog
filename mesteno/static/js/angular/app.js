'use strict';

var baseSettings = function($httpProvider, $interpolateProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
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
        'ngCookies',
        'ngAnimate',
        'djangoRESTResources',
        'route-segment',
        'view-segment',
        'mestenoServices',
        'angular-loading-bar',
        'ui.bootstrap',
    ])
    .config(baseSettings)
    .config(routerSettings)
    .value('loader', {show: false});

