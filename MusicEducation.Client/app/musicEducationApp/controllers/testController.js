'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', '$window'];

	var TestController = function ($location, $routeParams, $rootScope, $route, testService, toastr, $window) {
		var vm = this,
            path = '/test/',
			id = ($routeParams.id) ? $routeParams.id : '';

		vm.testList = [];
		vm.avalibleTestList = [];
		vm.id = id;
		vm.currentTest = [];
		vm.currentQuestion = 0;
		
		vm.selectedAnswer = false;

		vm.state = 'login';

		$rootScope.pageName = 'Main';
		vm.controllerName = 'Тесты';
		vm.headerName = 'Музычкалка';

		vm.isTestComplete = false;
		vm.testResult = {};

		vm.goToTest = function (test) {
		    if ($rootScope.globals.currentUser.source.RoleName == 'Учитель')
		    {
                $location.path(path + test.Id);
		    } else {
		        if (test.UserAnswerValidPercent == 0) {
		            $location.path(path + test.Id);
		        } else {
		            toastr.error('Вы уже проходили этот тест!');
		        }
		    }
		};

		vm.getClassNameValidPercent = function (percent) {
			var className = '';

			if (percent <= 25 && percent > 0)
			{
				className = 'negative';
			} else if (percent > 25 && percent < 75) {
				className = 'warning';
			} else if (percent >= 75 && percent <= 100) {
				className = 'positive';
			} else if (percent == 0) {
				className = '';
			}

			return className;
		};

		vm.nextQuestion = function () {
			vm.currentQuestion += 1;

			if (vm.currentTest.Questions.length <= vm.currentQuestion)
			{
				testService.insertTestResult(vm.currentTest).then(function (responseData) {
					console.log(responseData);
					vm.testResult = responseData;
					vm.testResult.CountAnswerValid = responseData.CountAnswerValid; // Всего
					vm.testResult.CountUserAnswerValid = responseData.CountUserAnswerValid; // Правельных
					vm.testResult.UserAnswerValidPercent = responseData.UserAnswerValidPercent; // Процент правельных
					vm.isTestComplete = true;
				});
			}
		};

		vm.closeTestResultModel = function () {
			console.error('RELOAD');
			vm.isTestComplete = false;
			$location.path(path)
			setTimeout(function () {
				$window.location.reload();
			}, 1000);
		};

		vm.setChoiceForQuestion = function (q, c) {
			angular.forEach(q.Answers, function (c) {
				c.isUserAnswer = false;
			});

			c.isUserAnswer = true;
			vm.nextQuestion();
			console.log(vm.currentTest);
		};

		console.log(id);

		function init() {

		    if ($rootScope.globals.currentUser.source.RoleName == 'Учитель') {
		        if (id == '') {
		            testService.getAvalibleTests().then(function (data) {
		                vm.avalibleTestList = data;
		            });
		        } else {
		            testService.getTest(id).then(function (data) {
		                vm.currentTest = data;
		                console.log(data);
		            });
		        }
		    } else {
		        if (id == '') {
		            testService.getTests().then(function (data) {
		                vm.testList = data;
		            });
		        } else {
		            testService.getTest(id).then(function (data) {
		                vm.currentTest = data;
		                console.log(data);
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

	TestController.$inject = injectParams;

	app.register.controller('TestController', TestController);

});