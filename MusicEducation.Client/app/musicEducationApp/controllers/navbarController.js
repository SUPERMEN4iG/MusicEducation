'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', 'authService', '$rootScope', 'toastr', '$window', 'notifyService', 'userService'];

    var NavbarController = function ($scope, $location, authService, $rootScope, toastr, $window, notifyService, userService) {
		var vm = this;
		$rootScope.globals.app = {};
		$rootScope.globals.app.title = 'Сольфеджио онлайн';
		$rootScope.globals.app.subtitle = '';
		$rootScope.visualKeyboards = [];

		//$rootScope.pageName = '';
		vm.appTitle = 'Музычалка';
		vm.loginLogoutText = '';
		vm.isCollapsed = false;
		vm.currentUser = {};
		vm.currentBranch = {};
		vm.currentNotifications = [];

		$rootScope.notificationService = notifyService('http://localhost:59744', 'notificationHub');
		//vm.showSelectStorageModal = false;

		authService.getCurrentUser().then(function (response) {
			vm.currentUser = response.data;
			$rootScope.globals.currentUser.source = {};
			$rootScope.globals.currentUser.source = response.data;
			$rootScope.$broadcast('ON_FINISH_LOADING', 1);
		});

		$rootScope.$on('ON_FINISH_LOADING', function (data) {
		    $rootScope.notificationService.on('broadcastMessage', function (data) {
		        vm.currentNotifications.push(data);
		        toastr.info(data.Content);
		    });

		    userService.getNotifications().then(function (notifications) {
		        console.log(notifications);
		        vm.currentNotifications = notifications;
		    });
		});

		vm.sendToUser = function (username, data) {
		    $rootScope.notificationService.sendNotification(vm.currentUser.Id, username, "Тест", data, 1);
		};

		vm.loginOrOut = function () {
			setLoginLogoutState();
			var isAuthenticated = authService.isAuthorize;
			if (isAuthenticated) { //logout 
				console.log("LOGOUT");
				authService.logout();
				$location.path('/');
			}
			redirectToLogin();
		};

		function redirectToLogin() {
			var path = '/login' + $location.$$path;
			$location.replace();
			$location.path(path);
			setTimeout(function () {
				$window.location.reload();
			}, 1000);
		}

		$scope.$on('loginStatusChanged', function (loggedIn) {
			setLoginLogoutState(loggedIn);
		});

		$scope.$on('redirectToLogin', function () {
			redirectToLogin();
		});

		function setLoginLogoutState() {
			vm.loginLogoutText = (authService.isAuthorize) ? 'Logout' : 'Login';
		}

		//vm.currentBranch = function () { return branchService.getCurrentBranch()[0]; };

		//$rootScope.currentBranch = vm.currentBranch;

		//$rootScope.$on('branch:updated', function (event, data) {;
		//	vm.currentBranch = data;
		//});

		setLoginLogoutState();

		vm.notFoundClick = function (val) {
			toastr.info(val, 'Информация');
		};

	};

	NavbarController.$inject = injectParams;

	//Loaded normally since the script is loaded upfront 
	//Dynamically loaded controller use app.register.controller
	app.controller('NavbarController', NavbarController);

});