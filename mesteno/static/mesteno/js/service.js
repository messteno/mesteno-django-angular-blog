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
            if (!this.processLink || !this.data) 
                return false;

            var self = this;
            self.disabled = true;
            console.log($cookies.csrftoken);

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

angular
    .module('mestenoServices', ['ngResource'])
    .factory('Profile', Profile)
    .factory('Article', Article)
    .factory('Category', Category)
    .factory('Form', Form);

