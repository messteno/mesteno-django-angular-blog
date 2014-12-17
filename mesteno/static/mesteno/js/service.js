'use strict';

var Profile = function(djResource, $http) {
    var Profile = djResource('/api/profile/');
    Profile.prototype.$logout = function(success) {
        $http.get('/api/logout/')
            .success(function(request) {
                if(success) {
                    success();
                }
            })
            .error(function(request) {
            });
    };
    return Profile;
};

var Category = function(djResource) {
    var Category = djResource('/api/categories/:categoryId/', {categoryId: '@categoryId'});
    return Category;
};

var Tag = function(djResource) {
    var Tag = djResource('/api/tags/:tagId/', {tagId: '@tagId'});
    return Tag;
};

var Article = function(djResource) {
    var Article = djResource('/api/articles/:articleId/',
                             {articleId: '@articleId', page: '@page'});
    return Article;
};

var Articles = function($modal, $state, $location, $stateParams, $filter, Article) {
    var Articles = function($scope) {
        this.list = [];
        this.pageSize = 10;
        this.count = $scope.page * this.pageSize;
        this.page = $scope.page
        
        var self = this;

        this.reload = function() {
            var params = {};
            if ($stateParams.categoryId)
                params.category = $stateParams.categoryId;
            if ($stateParams.tagId)
                params.tags__id = $stateParams.tagId;
            params.page = self.page;

            var article = Article.get(params, function() {
                self.count = article.count;
                self.list = article.results;
                for (var i = 0; i < self.list.length; ++i) {
                    self.list[i].published = $filter('date')(self.list[i].published, 'yyyy-MM-dd hh:mm:ss');
                }
            }, function() {
                if (self.page > 1) {
                    self.page -= 1;
                    self.reload();
                }
            });
        };

        this.deleteArticle = function(articleId) {
            var modalInstance = $modal.open({
                templateUrl: '/static/mesteno/articles/delete.html',
                controller: 'ArticleDeleteFromListCtrl',
                windowClass: 'article-delete-modal',
                scope: $scope,
                resolve: {
                    articleId: function() {
                        return articleId;
                    }
                }
            });
        };

        this.reload();
    };
    return Articles;
};

var Form = function($cookies, $http) {
    var Form = function($scope, processLink, successCallback, errorCallback) {
        this.disabled = false;
        this.data = {};
        this.error = {};
        this.focus = {};
        this.method = 'POST';
        this.processLink = processLink;
        this.success = false;

        this.submit = function(params) {
            if (!this.processLink)
                return false;

            if (this.beforeSubmit)
                this.beforeSubmit(params);

            if (!this.data)
                return false;

            var self = this;
            self.disabled = true;
            
            $http({
                method: self.method,
                url: self.processLink,
                data: self.data,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': $cookies.csrftoken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                cache: false,
                transformResponse: function (data, headersGetter) {
                    try {
                        var jsonObject = JSON.parse(data);
                        return jsonObject;
                    } catch (e) {
                    }
                    return {};
                }
            })
            .success(function(data, status) {
                self.success = true;
                self.error = {};
                self.focus = {};
                self.data = {};
                if (successCallback) {
                    successCallback(data, params);
                }
                self.disabled = false;
            })
            .error(function(data) {
                var firstFocusKey = Object.keys(self.focus)[0];
                self.focus = {};
                self.error = {};
                self.success = false;

                try {
                    for(var key in data) {
                        if (Object.keys(self.focus).length == 0 || key === firstFocusKey) {
                            self.focus = {};
                            self.focus[key] = true;
                        }
                        self.error[key] = data[key][0];
                    }
                } catch(e) {
                    self.focus[firstFocusKey] = true;
                    self.error['__all__'] = 'Ошибка при обработке формы';
                }
                if (Object.keys(self.error).length == 0) {
                    self.focus[firstFocusKey] = true;
                    self.error['__all__'] = 'Ошибка при обработке формы';
                }

                if (self.focus.__all__ != undefined) {
                    self.focus[Object.keys(self.data)[0]] = self.focus.__all__;
                    delete self.focus.__all__;
                }

                if (errorCallback) {
                    errorCallback(data, params);
                }

                self.disabled = false;
            });
        };

        this.closeAlert = function(name) {
            delete this.error[name];
        };

        this.isSuccess = function() {
            return this.success;
        };
    };
    return Form;
};

var ImageUploader = function($cookies, FileUploader) {
    var ImageUploader = function($scope) {
        this.uploader = new FileUploader({
            url: '/api/article/imgupload/',
            headers : {
                'X-CSRFToken': $cookies.csrftoken,
            },
            method: 'PUT',
        });

        this.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        this.uploader.onSuccessItem = function(item, response) {
            item.link = response.result;
            item.pasteLink = function() {
                if ($scope.form.data.content) {
                    $scope.form.data.content += '\n<img src="' + item.link + '" alt="" />\n';
                } else {
                    $scope.form.data.content = '<img src="' + item.link + '" alt="" />\n';
                }
            };
        };
    };
    return ImageUploader;
};

angular
    .module('mestenoServices', ['ngResource'])
    .factory('Profile', Profile)
    .factory('Article', Article)
    .factory('Articles', Articles)
    .factory('Category', Category)
    .factory('Tag', Tag)
    .factory('ImageUploader', ImageUploader)
    .factory('Form', Form);

