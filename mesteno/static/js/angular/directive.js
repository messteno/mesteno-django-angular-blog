'use strict';

app.directive('dateFormat', function() {
  return {
		require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(viewValue) {
                return +viewValue;
            });
        }
	}
});
