'use strict';

var baseSettings = function($httpProvider, $interpolateProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $interpolateProvider.startSymbol('[[').endSymbol(']]');

    $httpProvider.defaults.transformRequest = [function(data)
    {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */ 
        var param = function(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
};

var routerSettings = function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
        .when('', '/main')
        .when('/', '/main')
        .when('/articles', '/articles/list')
        .when('/articles/{articleId:[0-9]+}', '/articles/{articleId:[0-9]+}/detail')
        .otherwise('/404');

    $stateProvider
        .state('404', {
            url: '/404',
            templateUrl: '/static/404.html',
        })
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
            templateUrl: 'static/articles/add.html',
            controller: 'ArticleEditCtrl',
        })
        .state('article-add', {
            url: '/articles/add',
            templateUrl: 'static/articles/add.html',
            controller: 'ArticleAddCtrl',
        });
};

var hljsSettings = function(hljsServiceProvider) {
    hljsServiceProvider.setOptions({
        tabReplace: '    ',
    });
};

var app = angular
    .module('mesteno', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngSanitize',
        'djangoRESTResources',
        'mestenoServices',
        'angular-loading-bar',
        'ui.bootstrap',
        'ui.router',
        'ui.ace',
        'angularFileUpload',
        'hljs',
    ])
    .config(baseSettings)
    .config(routerSettings)
    .config(hljsSettings)
    .value('loader', {show: false});

