'use strict';

define(['app'], function (app) {

	var injectParams = ['$window', '$rootScope', 'pianoPlayerService'];

	var filereadDirective = function ($window, $rootScope, pianoPlayerService) {
		return {
			//restrict: 'E',
			scope: {
				fileread: "="
			},
			link: function (scope, element, attributes) {
				element.bind("change", function (changeEvent) {
					var reader = new FileReader();
					reader.onload = function (loadEvent) {
						scope.$apply(function () {
							console.log(loadEvent.target);
							scope.fileread = loadEvent.target.result;
						});
					}
					reader.readAsDataURL(changeEvent.target.files[0]);
				});
			}
		}
	};

	filereadDirective.$inject = injectParams;

	app.directive('fileread', filereadDirective);

});