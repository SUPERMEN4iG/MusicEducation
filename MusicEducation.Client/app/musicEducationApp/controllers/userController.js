﻿'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', 'pianoPlayerService', '$window', '$scope', 'userService', 'studentService'];

	var UserController = function ($location, $routeParams, $rootScope, $route, testService, toastr, pianoPlayerService, $window, $scope, userService, studentService) {
		var vm = this,
            path = '/user/',
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

		vm.deleteUser = function (idSelected) {
			var deletedObjects = 0;

			userService.deleteUser(idSelected).then(function (data) {
				angular.forEach(vm.users, function (v, k) {
					if (v.Id == idSelected) {
						vm.users.splice(k, 1);
						deletedObjects++;
						//delete vm.users[k];
					}
				});
			});

			toastr.success('Удалено объектов: ' + deletedObjects);
		};

		vm.deleteUsers = function () {
			var deletedObjects = 0;
			angular.forEach(vm.deletable, function (value, key) {
				if (value)
				{
					userService.deleteUser(key).then(function (data) {
						angular.forEach(vm.users, function (v, k) {
							if (v.Id == key) {
								vm.users.splice(k, 1);
								deletedObjects++;
								//delete vm.users[k];
							}
						});
					});
				}
			});
			toastr.success('Удалено объектов: ' + deletedObjects);
			vm.deletable = [];
		};

		vm.isUpdateUserClicked = false;

		vm.updateUser = function () {
		    console.log(vm.currentUser);
		    userService.insertUser(vm.currentUser).then(function (data) {
		    	console.log(data);
		    	vm.isUpdateUserClicked = true;

		        $location.path(path)
		        setTimeout(function () {
		            $window.location.reload();
		        }, 1000);
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

			if (id == '') {
				userService.getUsers().then(function (data) {
					console.log(data);
					vm.users = data;
				});
			} else {	
				if (id == 'new') {
					vm.currentUser = {
						FirstName: "",
						RoleName: "Ученик",
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
					    vm.currentUser.Password = '';
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

		//$scope.userForm = {};

		$scope.$on("$locationChangeStart", function (event) {
			if (!vm.isUpdateUserClicked)
			{
				if (vm.userForm.$dirty && !confirm('У вас есть несохранённые изменения, всё равно перейти?'))
					event.preventDefault();
			}
		});
	};

	UserController.$inject = injectParams;

	app.register.controller('UserController', UserController);

});