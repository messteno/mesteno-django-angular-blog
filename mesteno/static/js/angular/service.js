'use strict';

var Profile = function(djResource) {
    var profile = djResource('/api/users/1/');
    return profile;
};

angular
    .module('mestenoServices', ['ngResource'])
    .factory('Profile', Profile);
