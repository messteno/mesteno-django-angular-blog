'use strict';

var baseSettings = function($httpProvider, $interpolateProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $interpolateProvider.startSymbol('[[').endSymbol(']]');
};

var routerSettings = function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
        .otherwise('/main')
        .when('', '/main')
        .when('/articles', '/articles/list')
        .when('/articles/{articleId:[0-9]+}', '/articles/{articleId:[0-9]+}/detail');

    $stateProvider
        .state('main', {
            url: '/main',
            templateUrl: '/static/main.html',
        })
        .state('articles', {
            url: '/articles',
            templateUrl: 'static/articles.html',
        })
        .state('articles.list', {
            url: '/list',
            templateUrl: 'static/articles/index.html',
            controller: 'ArticleListCtrl',
        })
        .state('articles.item', {
            url: '/{articleId:[0-9]+}',
            templateUrl: 'static/articles/item.html',
            resolve:{
                articleId: ['$stateParams', function($stateParams){
                    return $stateParams.articleId;
                }]
            },
        })
        .state('articles.item.detail', {
            url: '/detail',
            templateUrl: 'static/articles/detail.html',
            controller: 'ArticleItemCtrl',
        })
        .state('articles.item.edit', {
            url: '/edit',
            templateUrl: 'static/articles/edit.html',
            controller: 'ArticleEditCtrl',
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
        'ngResource',
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

