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

var Article = function(djResource) {
    var Article = djResource('/api/articles/:articleId/', {articleId: '@articleId'});
    return Article;
};

var Form = function($cookies, $http) {
    var Form = function($scope, processLink, successCallback, errorCallback) {
        this.disabled = false;
        this.data = {};
        this.error = {};
        this.focus = {};
        this.method = 'POST';
        this.processLink = processLink;

        this.submit = function() {
            if (!this.processLink)
                return false;

            if (this.beforeSubmit)
                this.beforeSubmit();

            if (!this.data)
                return false;

            var self = this;
            self.disabled = true;
            
            $http({
                method: self.method,
                url: processLink,
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
                self.error = {};
                self.focus = {};
                self.data = {};
                if (successCallback) {
                    successCallback(data);
                }
                self.disabled = false;
            })
            .error(function(data) {
                var firstFocusKey = Object.keys(self.focus)[0];
                self.focus = {};
                self.error = {};

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
                    errorCallback();
                }

                self.disabled = false;
            });
        };

        this.closeAlert = function(name) {
            delete this.error[name];
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
    .factory('Category', Category)
    .factory('ImageUploader', ImageUploader)
    .factory('Form', Form);

