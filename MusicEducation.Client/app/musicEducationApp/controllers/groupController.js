'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', '$window', '$scope', 'userService', 'studentService'];

	var GroupController = function ($location, $routeParams, $rootScope, $route, testService, toastr, $window, $scope, userService, studentService) {
		var vm = this,
            path = '/group/',
			id = ($routeParams.id) ? $routeParams.id : '';

		vm.testList = [];
		vm.avalibleTestList = [];
		vm.id = id;
		vm.currentTest = [];
		vm.currentQuestion = -1;

		vm.selectedAnswer = false;

		vm.state = 'login';

		$rootScope.pageName = 'Main';
		vm.controllerName = 'Банк вопросов';
		vm.headerName = 'Музычкалка';

		vm.isTestComplete = false;
		vm.testResult = {};
		vm.isShowPiano = false;

		vm.isListening = false;
		vm.isRecording = false;
		vm.taskState = 1;

		vm.currentInputGroup = {};
		vm.currentUpdateGroup = {};
		vm.isShowGroupWindow = false;
		vm.isShowUserWindow = false;
		vm.isShowTestCreateWindow = false;
		vm.isShowAddNewGroup = false;
		vm.isShowEditGroup = false;

		vm.currentTask = {
			localUserNotes: []
		};

		vm.testState = 1;

		vm.currentQuestionEditable = undefined;
		vm.editableState = 0;

		vm.avalibleGroups = [];
		vm.avalibleStudents = [];
		vm.avalibleTeachers = [];
		vm.selectedStudents = [];
		vm.selectedTeachers = [];
		vm.selectedGroups = [];
		vm.selectedTests = [];
		vm.avalibleThemes = [];
		vm.currentQuestions = [];
		vm.selectedQuestions = [];
		vm.testForm = {};
		vm.selected = {};

		vm.parsedTimeLeft = '';
		vm.currentInputTest = {};

		vm.goToTheme = function (test) {
			if ($rootScope.globals.currentUser.source.RoleName == 'Учитель') {
				$location.path(path + test.Id);
			}
		};

		vm.getClassNameValidPercent = function (percent) {
			var className = '';

			if (percent <= 25 && percent > 0) {
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

			if (vm.currentTest.Questions[vm.currentQuestion] !== undefined) {
				if (vm.currentTest.Questions[vm.currentQuestion].QuestionType == 2) {
					vm.isShowPiano = true;
				}
			}

			if (vm.currentTest.Questions.length <= vm.currentQuestion) {
				testService.insertTestResult(vm.currentTest).then(function (responseData) {
					console.log(responseData);
					vm.testResult = responseData;
					vm.testResult.CountAnswerValid = responseData.CountAnswerValid; // Всего
					vm.testResult.CountUserAnswerValid = responseData.CountUserAnswerValid; // Правельных
					vm.testResult.UserAnswerValidPercent = responseData.UserAnswerValidPercent; // Процент правельных
					vm.isTestComplete = true;

					testService.updateUserTestTiming($rootScope.globals.currentUser.source.Id, id, vm.currentTest.Timing, true).then(function (result) {
					});
				});
			}
		};

		vm.appendTestToGroup = function () {
			var counter = 0;
			angular.forEach(vm.selectedGroups, function (vGroup, kGroup) {
				angular.forEach(vm.selectedTests, function (vTest, kTest) {
					counter++;
					testService.appendTestToGroup(kGroup, kTest, vm.currentInputGroup.CountAttempts, vm.currentInputGroup.Timing, vm.currentInputGroup.Complexity).then(function (data) {
						console.info("INSERTED!");
					});
				});
			});
		};

		vm.appendTestToUser = function () {
			var counter = 0;
			angular.forEach(vm.selectedStudents, function (vUser, kUser) {
				angular.forEach(vm.selectedTests, function (vTest, kTest) {
					counter++;
					testService.appendTestToUser(kUser, kTest, vm.currentInputGroup.CountAttempts, vm.currentInputGroup.Timing, vm.currentInputGroup.Complexity).then(function (data) {
						console.info("INSERTED!");
					});
				});
			});
		};

		vm.createTest = function () {
			if (vm.testForm.$dirty)
			{
				vm.currentInputTest.Questions = [];
				angular.forEach(vm.selectedQuestions, function (vQuestion, kQuestion) {
					vm.currentInputTest.Questions.push(kQuestion);
				});

				console.log(vm.currentInputTest.Questions);

				testService.createTest(vm.currentInputTest).then(function (data) {
					console.info(data);
				});
			}
		};

		vm.deleteTest = function (test) {
			toastr.error('Функционал не реализован...');
		};

		vm.deleteTests = function () {
			toastr.error('Функционал не реализован...');
		};

		var findInDictionaryByName = function (obj, key) {
			var found = $filter('filter')(obj, { Name: key }, true);
			return found[0];
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
				if (q.QuestionType == 2) {
					c.ContentUserAnswer = {
						octaves: vm.currentTest.Questions[vm.currentQuestion].Content.octaves,
						content: vm.currentTask.localUserNotes
					};
				}
			});

			c.isUserAnswer = true;
			vm.nextQuestion();
			console.log(vm.currentTest);
		};

		vm.setChoice = function (qAnswers, c) {
			angular.forEach(qAnswers, function (c) {
				c.IsValid = false;
			});
			console.log(c);
			c.IsValid = true;
		};

		vm.moveToEditableQuestion = function (index) {
			if (vm.currentTest.Questions[index] === undefined) {
				vm.currentTest.Questions[index] = {
					Content: null,
					Id: null,
					Name: "",
					QuestionType: 1,
					Answers: []
				}
			}

			vm.currentQuestionEditable = index;
			vm.editableState = 1;
		};

		vm.backToQuestions = function () {
			vm.editableState = 0;
		};

		vm.removeEditableQuestion = function (questionIndex) {
			vm.currentTest.Questions.splice(questionIndex, 1);
		};

		vm.removeAnswerInQuestion = function (answerIndex) {
			vm.currentTest.Questions[vm.currentQuestionEditable].Answers.splice(answerIndex, 1);
		};

		vm.updateEditableTest = function (obj) {
			testService.updateTest(obj).then(function (response) {
				toastr.info('Тест сохранён!');
			});
		};

		vm.appnedAnswer = function (qAnswers, answer) {
			if (answer === undefined) {
				answer = {
					Content: null,
					ContentUserAnswer: null,
					Id: null,
					Name: "Ответ",
					isUserAnswer: false,
					IsValid: false
				};
			}

			qAnswers.push(answer);
		};

		vm.addTest = function () {
			$location.path(path + 'new');
		};

		vm.insertGroup = function () {

		    vm.currentInputGroup.Id = null;
			vm.currentInputGroup.Teachers = [];
			console.log(vm.selected);
			//angular.forEach(vm.selectedTeachers, function (vTeacher, kTeacher) {
			//	vm.currentInputGroup.Teachers.push(kTeacher);
			//});

			vm.currentInputGroup.Teachers.push(vm.selected.Id);

			userService.insertGroup(vm.currentInputGroup).then(function (data) {
				toastr.info('Группа создана');
				init();

				vm.isShowAddNewGroup = false;
			});
		};

		vm.updateGroup = function () {
		    //vm.currentUpdateGroup.Id = null;
		    vm.currentUpdateGroup.Teachers = [];
		    console.log(vm.selected);
		    //angular.forEach(vm.selectedTeachers, function (vTeacher, kTeacher) {
		    //	vm.currentInputGroup.Teachers.push(kTeacher);
		    //});

		    vm.currentUpdateGroup.Teachers.push(vm.selected.Id);

		    userService.insertGroup(vm.currentUpdateGroup).then(function (data) {
		        toastr.info('Группа обновлена');
		        $location.path(path);
		        vm.isShowEditGroup = false;
		    });
		}

		vm.deleteGroup = function (idGroup) {
			userService.deleteGroup(idGroup).then(function (data) {
				toastr.info('Группа удалена');
				init();
			});
		};

		vm.goToEditGroup = function (idGroup) {
		    $location.path(path + idGroup);
		}

		vm.stateTest = 0;
		vm.intervalTiming = null;

		function init() {

		    if ($rootScope.globals.currentUser.source.RoleName == 'Администратор') {

		        userService.getGroups().then(function (groups) {
		            vm.avalibleGroups = groups;

		            userService.getTeachers().then(function (teachers) {
		                vm.avalibleTeachers = teachers;

		                if (id == '') {
                            // 
				        } else {		

				            userService.getGroup(vm.id).then(function (group) {
				                vm.currentUpdateGroup.Name = group.Name;
				                vm.currentUpdateGroup.Content = group.Content;
				                vm.currentUpdateGroup.Id = group.Id_Group;

				                angular.forEach(vm.avalibleTeachers, function (vTeacher, kTeacher) {
				                    if (vTeacher.Id == group.Id_User)
				                    {
				                        vm.selected = vTeacher;
				                    }
				                });

				                vm.isShowEditGroup = true;
				            });
		                }
		            });
		        });
			}
		};

		//$scope.$watch('vm.newTask.question_octaves', function () {
		//	$rootScope.$emit('ON_PIANO_INIT', vm.newTask.question_octaves);
		//});

		if ($rootScope.globals.currentUser.source === undefined) {
			$rootScope.$on('ON_FINISH_LOADING', function (event, data) {
				init();
			});
		} else {
			init();
		}
	};

	GroupController.$inject = injectParams;

	app.register.controller('GroupController', GroupController);

});