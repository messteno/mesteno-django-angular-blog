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
    var Article = djResource('/api/articles/:articleId', {articleId: '@articleId'});
    return Article;
};

var Form = function($cookies) {
    var Form = function($scope, processLink, success, error) {
        this.disabled = false;
        this.data = {};
        this.error = {};
        this.processLink = processLink;

        this.submit = function() {
            if (this.processLink && this.data) {
                var self = this;

                self.disabled = true;
                var xhr = new XMLHttpRequest();

                xhr.open('POST', self.processLink, true);
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
                    var data = {};
                    try {
                        data = $.parseJSON(this.responseText);
                        for(var key in data.form_errors) {
                            self.error[key] = data.form_errors[key][0];
                        }
                    } catch (e) {
                        self.error['__all__'] = 'Ошибка при обработке формы';
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

