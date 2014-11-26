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

app.directive('ngThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);

