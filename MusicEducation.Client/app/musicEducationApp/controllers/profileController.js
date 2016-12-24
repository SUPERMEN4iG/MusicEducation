'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', 'pianoPlayerService', '$window', '$scope', 'userService', 'studentService'];

	var ProfileController = function ($location, $routeParams, $rootScope, $route, testService, toastr, pianoPlayerService, $window, $scope, userService, studentService) {
		var vm = this,
            path = '/profile/',
			id = ($routeParams.id) ? $routeParams.id : '';
		vm.currentUser = {};
		vm.users = [];
		vm.roles = [];
		vm.teachers = [];
		vm.groups = [];
		vm.deletable = [];
		vm.id = id;

		vm.goToUser = function (id) {
			$location.path(path + id);
		};

		vm.addUser = function () {
			$location.path(path + 'new');
		};

		vm.isUpdateUserClicked = false;

		vm.updateUser = function () {
			console.log(vm.currentUser);
			userService.insertUser(vm.currentUser).then(function (data) {
				console.log(data);
				vm.isUpdateUserClicked = true;

				$location.path(path);
				toastr.success('Профиль обновлён!');
				//setTimeout(function () {
				//	$window.location.reload();
				//}, 1000);
			});
		};

		function init() {
			userService.getRoles().then(function (roles) {
				vm.roles = roles;
			});

			userService.getTeachers().then(function (teachers) {
				vm.teachers = teachers;
			});

			userService.getGroups().then(function (groups) {
				vm.groups = groups;
			});

			studentService.getStudent($rootScope.globals.currentUser.source.Id).then(function (data) {
				vm.currentUser = data;
				vm.currentUser.Password = '';
				console.log(vm.currentUser);
			});
		};

		if ($rootScope.globals.currentUser.source === undefined) {
			$rootScope.$on('ON_FINISH_LOADING', function (event, data) {
				init();
			});
		} else {
			init();
		}

		//$scope.userForm = {};

		$scope.$on("$locationChangeStart", function (event) {
			if (!vm.isUpdateUserClicked) {
				if (vm.userForm.$dirty && !confirm('У вас есть несохранённые изменения, всё равно перейти?'))
					event.preventDefault();
			}
		});
	};

	ProfileController.$inject = injectParams;

	app.register.controller('ProfileController', ProfileController);

});