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
        .when('/articles/list', '/articles/list/1')
        .when('/articles/{articleId:[0-9]+}', '/articles/{articleId:[0-9]+}/detail')
        .when('/articles/category/{categoryId:[0-9]+}', '/articles/category/{categoryId:[0-9]+}/1')
        .when('/articles/category/0/{page:[0-9]+}', '/articles/list/{page:[0-9+]}')
        // .otherwise('/404')
        ; 

    $stateProvider
        .state('404', {
            url: '/404',
            templateUrl: '/static/mesteno/404.html',
        })
        .state('main', {
            url: '/main',
            templateUrl: '/static/mesteno/main.html',
        })
        .state('articles', {
            url: '/articles',
            templateUrl: '/static/mesteno/articles.html',
            controller: 'ArticleCtrl',
        })
        .state('articles.list', {
            url: '/list/{page:[0-9]+}',
            templateUrl: '/static/mesteno/articles/index.html',
            controller: 'ArticleListCtrl',
        })
        .state('articles.category', {
            url: '/category/{categoryId:[0-9]+}/{page:[0-9]+}',
            templateUrl: '/static/mesteno/articles/index.html',
            controller: 'ArticleCategoryCtrl',
        })
        .state('articles.item', {
            url: '/{articleId:[0-9]+}',
            templateUrl: '/static/mesteno/articles/item.html',
            resolve: {
                articleId: ['$stateParams', function($stateParams) {
                    return $stateParams.articleId;
                }]
            },
        })
        .state('articles.item.detail', {
            url: '/detail',
            templateUrl: '/static/mesteno/articles/detail.html',
            controller: 'ArticleItemCtrl',
        })
        .state('articles.item.edit', {
            url: '/edit',
            templateUrl: '/static/mesteno/articles/add.html',
            controller: 'ArticleEditCtrl',
        })
        .state('article-add', {
            url: '/articles/add',
            templateUrl: '/static/mesteno/articles/add.html',
            controller: 'ArticleAddCtrl',
        })
        ;

};

var hljsSettings = function(hljsServiceProvider) {
    hljsServiceProvider.setOptions({
        tabReplace: '    ',
    });
};

var ngClipSettings = function(ngClipProvider) {
    ngClipProvider.setPath("/static/zeroclipboard/dist/ZeroClipboard.swf");
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
        'ngTagsInput',
        'ngClipboard'
    ])
    .config(baseSettings)
    .config(routerSettings)
    .config(hljsSettings)
    .config(ngClipSettings)
    .value('loader', {show: false});

