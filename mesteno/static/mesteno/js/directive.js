'use strict';

app.directive('dateFormat', function($filter) {
  return {
		require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$parsers.push(function(viewValue) {
                return $filter('date')(viewValue, 'yyyy-MM-dd hh:mm:ss');
            });
        }
	}
});

app.directive('focusMe', function($timeout, $parse) {
    return {
        link: function(scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function(value) {
                if(value === true) { 
                    $timeout(function() {
                        element[0].focus(); 
                    });
                }
            });
            element.bind('blur', function() {
                scope.$apply(model.assign(scope, false));
            })
        }
    };
});

app.directive('compileTemplate', function($compile, $parse, $sanitize){
    return {
        link: function(scope, element, attr){
            var parsed = $parse(attr.compileTemplate);
            function getStringValue() {
                return (parsed(scope) || '').toString(); 
            }
        
            scope.$watch(getStringValue, function() {
                var html = (parsed(scope) || '').toString();
                try {
                    var out = $sanitize(html);
                    html = out.replace(/<code/g, '<hljs no-escape').replace(/<\/code>/g, '</hljs>');
                    element.html(html);
                    $compile(element, null, -9999)(scope);
                } catch(e) {
                    element.text(html);
                    element.prepend('<div class="alert alert-danger" role="alert">Ошибка парсера, исправьте текст статьи.</div>');
                }
            });
        },
    }
});

