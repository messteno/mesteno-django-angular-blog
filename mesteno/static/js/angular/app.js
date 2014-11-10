'use strict';

var baseSettings = function($httpProvider, $interpolateProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
};

var routerSettings = function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
        .otherwise('/main')
        .when('', '/main')
        .when('/articles', '/articles/list');

    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: '/static/main.html',
        })
        .state('articles', {
            url: '/articles',
            templateUrl: 'static/articles.html'
        })
        .state('articles.list', {
            url: '/list',
            templateUrl: 'static/articles/index.html'
        })
        .state('articles.item', {
            url: '/{id:[0-9]*}',
            templateUrl: 'static/articles/item.html'
        })
        .state('article-add', {
            url: '/articles/add',
            templateUrl: 'static/articles/add.html',
            controller: 'ArticleAddCtrl',
        });
};

var app = angular
    .module('mesteno', [
        'ngRoute',
        'ngCookies',
        'ngAnimate',
        'djangoRESTResources',
        'mestenoServices',
        'angular-loading-bar',
        'ui.bootstrap',
        'ui.router',
    ])
    .config(baseSettings)
    .config(routerSettings)
    .value('loader', {show: false});

