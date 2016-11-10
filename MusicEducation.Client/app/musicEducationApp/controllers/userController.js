'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', 'pianoPlayerService', '$window', '$scope', 'userService', 'studentService'];

	var UserController = function ($location, $routeParams, $rootScope, $route, testService, toastr, pianoPlayerService, $window, $scope, userService, studentService) {
		var vm = this,
            path = '/user/',
			id = ($routeParams.id) ? $routeParams.id : '';

		vm.users = [];
		vm.roles = [];
		vm.id = id;

		function init() {
			userService.getRoles().then(function (roles) {
				vm.roles = roles;
			});

			if (id == '') {
				userService.getUsers().then(function (data) {
					console.log(data);
					vm.users = data;
				});
			} else {	
				if (id == 'new') {
					vm.currentUser = {
						FirstName: "",
						Id_Role: null,
						Id_User: null,
						Id_UserCreate: 1,
						LastName: "",
						Login: "",
						MiddleName:"",
						Password:""
					};
				} else {
					studentService.getStudent(id).then(function (data) {
						vm.currentUser = data;
						console.log(vm.currentUser);
					});
				}
			}
		};

		if ($rootScope.globals.currentUser.source === undefined) {
			$rootScope.$on('ON_FINISH_LOADING', function (event, data) {
				init();
			});
		} else {
			init();
		}
	};

	UserController.$inject = injectParams;

	app.register.controller('UserController', UserController);

});