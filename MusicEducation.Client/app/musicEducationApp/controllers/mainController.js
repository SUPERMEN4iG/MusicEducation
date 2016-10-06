'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route'];

	var MainController = function ($location, $routeParams, $rootScope, $route) {
		var vm = this,
            path = '/';

		$rootScope.pageName = 'Main';
		vm.controllerName = 'Главная';
	};

	MainController.$inject = injectParams;

	app.register.controller('MainController', MainController);

});