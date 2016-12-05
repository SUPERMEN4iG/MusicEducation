'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$location', '$routeParams', '$rootScope', '$route', 'studentService', 'testService', 'toastr', 'pianoPlayerService', '$scope', '$window', '$filter', 'userService', 'baseApiUrl'];

    var MessageController = function ($http, $location, $routeParams, $rootScope, $route, studentService, testService, toastr, pianoPlayerService, $scope, $window, $filter, userService, baseApiUrl) {
        var vm = this,
            path = '/message/',
            id = ($routeParams.id) ? $routeParams.id : '';

        vm.id = id;
        vm.userLastMessages = [];
        vm.userMessages = [];
        vm.textMessage = '';
        vm.selectedUser = {};
        vm.currentUser = {};

        var findInDictionaryByName = function (obj, key) {
        	var found = $filter('filter')(obj, { Name: key }, true);
        	return found[0];
        }

        vm.goToConversetion = function (idUser) {
        	$location.path(path + idUser);
        };

        vm.createNewConversetion = function () {
        	$location.path(path + 'new');
        };

        vm.sendMessage = function () {

        	var fastId = (vm.id == 'new') ? vm.selectedUser.originalObject.Id : vm.id;

        	var sendObject = {
        		Id_UserTo: fastId,
        		Message_Name: 'Без темы',
        		Message_Type: 1,
        		Message_Content: vm.textMessage
        	};

        	userService.insertUserMessage(sendObject).then(function (insertedId) {
        		userService.getMessageById(insertedId).then(function (data) {
        			vm.userMessages.push(data);
        			vm.textMessage = '';

        			userService.getMessages().then(function (data) {
        				vm.userLastMessages = data;
        			});
        		});
        	});
        };

        vm.messageSendUri = function () {
            return baseApiUrl + '/User/GetUserByFio?fio=';
        };

        function init() {

        	userService.getMessages().then(function (data) {
        		vm.userLastMessages = data;

        		if (vm.id != '')
        		{
        			userService.getMessagesById(vm.id).then(function (data1) {
        			    vm.userMessages = data1;

        			    console.info(baseApiUrl);
        			});
        		}
        	});
        };

        if ($rootScope.globals.currentUser.source === undefined) {
            $rootScope.$on('ON_FINISH_LOADING', function (event, data) {
                init();
                vm.currentUser = $rootScope.globals.currentUser.source;
            });
        } else {
            init();
        }
    };

	MessageController.$inject = injectParams;

    app.register.controller('MessageController', MessageController);

});