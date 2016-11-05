'use strict';

define(['app'], function (app) {

	var injectParams = ['$parse', '$timeout'];

	var modalDirective = function ($parse, $timeout) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			require: 'ngModel',
			scope: {
				closable: '=',
				scrolling: '=',
				onShow: '&',
				onHide: '&',
			},
			template: '<div class="ui modal" ng-transclude></div>',
			link: function (scope, element, attrs, ngModel) {
				element.modal({
					onHide: function () {
						ngModel.$setViewValue(false);
						scope.onHide();
					},
					closable: scope.closable,
					onShow: scope.onShow,
					onVisible: function () {
						$timeout(function () {
							element.modal('refresh');
						}, 100);
					},
					observeChanges: true
				});

				element.addClass(scope.scrolling ? 'scrolling' : '');

				scope.$watch(function () {
					return ngModel.$modelValue;
				}, function (modelValue) {
					element.modal(modelValue ? 'show' : 'hide');
					// Исправлено автоснижение окна, когда контент слишком большой


					element.find('.ui.accordion .accordion .title, .ui.accordion .title').on('click', function () {
						$timeout(function () {
							console.info('modal: refresh');
							element.modal('refresh');
						}, 500);
					});
				});
				scope.$on('$destroy', function () {
					element.modal('hide');
					element.remove();
				});
			}
		}
	};

	modalDirective.$inject = injectParams;

	app.directive('modal', modalDirective);

});
