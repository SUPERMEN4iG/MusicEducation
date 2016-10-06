'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'authService', 'toastr'];

	var LoginController = function ($location, $routeParams, $rootScope, $route, authService, toastr) {
		var vm = this,
            path = '/';

		vm.state = 'login';

		$rootScope.pageName = 'Вход';

		console.log($route);

		vm.username = null;
		vm.password = null;
		vm.confirmPassword = null;
		vm.message = {
			status: "error",
			code: ""
		};
		//authService.ClearCredentials();

		vm.login = function () {
			console.log('LOGIN');
		};

		vm.register = function () {
			console.log('REGISTER');
		};

		vm.setSate = function (state) {
			vm.state = state;

			switch (state) {
				case 'login':
					$rootScope.pageName = 'Вход'
					break;
				case 'register':
					$rootScope.pageName = 'Регистрация'
					break;
				default:

			}
		};

		vm.register = function () {
			authService.Register(vm.username, vm.password, vm.confirmPassword, function (response) {
				if (response !== undefined && response.Status == 1) {
					vm.message.status = "success";
					vm.message.code = "Redirecting...";
					authService.SetCredentials(vm.username, vm.password);
					toastr.success('Выход выполнен успешно!');
				} else {
					vm.message.status = "error";
					vm.message.code = response.Message;
					toastr.error('Ошибка! ' + response.Message);
				}

				if (response.Status == 1 && $routeParams && $routeParams.redirect) {
					path = path + $routeParams.redirect;
				}

				console.log(vm.message);
				//if (response.success) {
				//	//authService.SetCredentials(vm.username, vm.password);
				//	vm.message.status = "success";
				//	vm.message.code = "Redirecting...";
				//	console.log('REGISTER SUCCESS');
				//	//toastr.success('Выход выполнен успешно!');
				//} else {
				//	vm.message.status = "error";
				//	vm.message.code = response.message;
				//	return;
				//}
				console.log($routeParams);
				//if (response.success && $routeParams && $routeParams.redirect) {
				//	path = path + $routeParams.redirect;
				//}

				$location.path(path);
			});
		};

		vm.login = function () {
			authService.Login(vm.username, vm.password, function (response) {
				if (response !== undefined && response.Status == 1)
				{
					vm.message.status = "success";
					vm.message.code = "Redirecting...";
					authService.SetCredentials(vm.username, vm.password);
					toastr.success('Выход выполнен успешно!');
				} else {
					vm.message.status = "error";
					vm.message.code = response.Message;
					toastr.error('Ошибка! ' + response.Message);
				}

				if (response.Status == 1 && $routeParams && $routeParams.redirect) {
					path = path + $routeParams.redirect;
				}
				console.log($routeParams);
				$location.path(path);
			});
		};

		//vm.login = function () {
		//	console.log("LOGIN");
		//	authService.Login(vm.username, vm.password, function (response) {
		//		//$routeParams.redirect will have the route
		//		//they were trying to go to initially
		//		if (response.success) {
		//			authService.SetCredentials(vm.username, vm.password);
		//			vm.message.status = "success";
		//			vm.message.code = "Redirecting...";
		//			toastr.success('Выход выполнен успешно!');
		//		} else {
		//			vm.message.status = "error";
		//			vm.message.code = response.message;
		//			return;
		//		}
		//		console.log($routeParams);
		//		if (response.success && $routeParams && $routeParams.redirect) {
		//			path = path + $routeParams.redirect;
		//		}

		//		$location.path(path);
		//	});
		//};
	};

	LoginController.$inject = injectParams;

	app.register.controller('LoginController', LoginController);

});