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

var Article = function(djResource) {
    var Article = djResource('/api/articles/:articleId/', {articleId: '@articleId'});
    return Article;
};

var Form = function($cookies) {
    var Form = function($scope, processLink, success, error) {
        this.disabled = false;
        this.data = {};
        this.error = {};
        this.focus = {};
        this.method = 'POST';
        this.processLink = processLink;

        this.submit = function() {
            if (this.processLink && this.data) {
                var self = this;

                self.disabled = true;
                var xhr = new XMLHttpRequest();

                xhr.open(self.method, self.processLink, true);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.setRequestHeader('X-CSRFToken', $cookies.csrftoken);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.onerror = function(e) {
                    if (error) {
                        error(e);
                    }
                    self.error['__all__'] = 'Ошибка при обработке формы';
                    self.disabled = false;
                    $scope.$apply();
                }
                xhr.onload = function() {
                    self.error = {};
                    self.focus = {};
                    var data = {};
                    try {
                        data = $.parseJSON(this.responseText);
                        if (xhr.status != 200 && xhr.status != 201 && xhr.status != 204) {
                            for(var key in data) {
                                if (Object.keys(self.focus).length == 0) {
                                    self.focus[key] = true;
                                }
                                self.error[key] = data[key][0];
                            }
                        }
                    } catch(e) {
                        if (xhr.status != 200 && xhr.status != 201 && xhr.status != 204) {
                            self.error['__all__'] = 'Ошибка при обработке формы';
                        }
                    }

                    if (self.focus.__all__ != undefined) {
                        self.focus[Object.keys(self.data)[0]] = self.focus.__all__;
                        delete self.focus.__all__;
                    }

                    if (Object.keys(self.error).length == 0) {
                        if (success) {
                            success(data);
                        }
                        self.data = {};
                    }
                    else {
                        if (error) {
                            error();
                        }
                    }

                    self.disabled = false;
                    $scope.$apply();
                };
                xhr.send($.param(self.data));
            }
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
    .factory('Form', Form);

