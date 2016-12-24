'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', '$window', '$scope', 'userService', 'studentService'];

	var BankTestController = function ($location, $routeParams, $rootScope, $route, testService, toastr, $window, $scope, userService, studentService) {
		var vm = this,
            path = '/bankTest/',
			id = ($routeParams.id) ? $routeParams.id : '',
            idquestion = ($routeParams.idquestion) ? $routeParams.idquestion : '';

		vm.testList = [];
		vm.avalibleTestList = [];
		vm.id = id;
		vm.idquestion = idquestion;
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
		vm.isShowGroupWindow = false;
		vm.isShowUserWindow = false;
		vm.isShowTestCreateWindow = false;
		vm.isShowCreateTestWindow = false;

		vm.currentTask = {
			localUserNotes: []
		};

		vm.testState = 1;

		vm.currentQuestionEditable = undefined;
		vm.editableState = 0;

		vm.avalibleGroups = [];
		vm.avalibleStudents = [];
		vm.selectedStudents = [];
		vm.selectedGroups = [];
		vm.selectedTests = [];
		vm.avalibleThemes = [];
		vm.currentQuestions = [];
		vm.selectedQuestions = [];
		vm.avalibleQuesions = [];
		vm.avalibleThemesQuestions = [];
		vm.deletable = [];
		vm.testForm = {};

		vm.parsedTimeLeft = '';
		vm.currentInputTest = {};

		vm.goToTheme = function (test) {
		    if (test.Id_UserCreate == $rootScope.globals.currentUser.source.Id)
		    {
		        if ($rootScope.globals.currentUser.source.RoleName == 'Учитель') {
		            $location.path(path + test.Id);
		        }
		    } else {
		        toastr.error('Редактирование запрещено!');
		    }
		};

		vm.goToQuestion = function (question) {
			$location.path(path + vm.id + '/' + question.Id);
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
			    vm.currentInputTest.Complexity = '';
				angular.forEach(vm.selectedQuestions, function (vQuestion, kQuestion) {
					if (vQuestion == true)
					{
						vm.currentInputTest.Questions.push(kQuestion);
					}
				});

				console.log(vm.currentInputTest.Questions);

				testService.createTest(vm.currentInputTest).then(function (data) {
				    toastr.info('Тест создан!');
				});
			}
		};

		vm.countQuestionsRandomize = null;

		vm.selectQuestionRandomize = function () {

			angular.forEach(vm.selectedQuestions, function (vQ, kQ) {
				vm.selectedQuestions[kQ] = false;
			});

			//for (var i = 0; i < vm.selectedQuestions.length; i++) {
			//	vm.selectedQuestions[i] = false;
			//}

			for (var i = 0; i < vm.countQuestionsRandomize; i++) {
				var loop = true;
				while (loop) {
					var randomId = vm.avalibleQuesions[Math.floor(Math.random() * vm.avalibleQuesions.length)].Id;
					if (!(vm.selectedQuestions.indexOf(randomId) !== -1))
					{
						if (vm.selectedQuestions[randomId] == false || vm.selectedQuestions[randomId] == undefined)
						{
							console.info(vm.selectedQuestions[randomId]);
							vm.selectedQuestions[randomId] = true;
							loop = false;
						}				
					}
				}
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
			$location.path(path);
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
			//angular.forEach(qAnswers, function (c) {
			//	c.IsValid = false;
			//});
			//console.log(c);
		    c.IsValid = !c.IsValid;
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
		    console.info(questionIndex);
			vm.currentTest.Questions.splice(questionIndex, 1);
		};

		vm.removeAnswerInQuestion = function (answerIndex) {
			vm.currentTest.Questions[vm.currentQuestionEditable].Answers.splice(answerIndex, 1);
		};

		vm.updateEditableTest = function (obj) {
			testService.updateTheme(obj).then(function (response) {
				toastr.info('Тема сохранёна!');
				init();
			});
		};

		vm.appnedAnswer = function (qAnswers, answer) {
			if (answer === undefined) {
				answer = {
					Content: null,
					ContentUserAnswer: null,
					Id: null,
					Name: "",
					isUserAnswer: false,
					IsValid: false
				};
			}

			qAnswers.push(answer);
		};

		Array.prototype.multiSplice = function (array) {
		    var args = Array.apply(null, array);

		    args.sort(function (x, y) {
		        return x - y;
		    });

		    for (var i = 0; i < args.length; i++) {
		        var index = args[i] - i;
		        this.splice(index, 1);
		    };
		};

		vm.deleteQuestions = function () {
		    console.info(vm.deletable);

		    var arrDebug = [];

		    angular.forEach(vm.deletable, function (v, k) {
		        if (v)
		            arrDebug.push(k);
		    });
		    console.info(arrDebug);
		    vm.currentTest.Questions.multiSplice(arrDebug);

		    //angular.forEach(vm.deletable, function (v, k) {
		    //    if (v == true)
		    //    {
		    //        vm.removeEditableQuestion(k);
		    //        vm.deletable[k] = false;
		    //    }
		    //});

		};

		vm.addTest = function () {
			$location.path(path + 'new');
		};

		vm.stateTest = 0;
		vm.intervalTiming = null;

		function init() {

			if ($rootScope.globals.currentUser.source.RoleName == 'Учитель') {
				if (id == '') {
					userService.getGroups().then(function (groups) {
						vm.avalibleGroups = groups;

						studentService.getStudents().then(function (students) {
							vm.avalibleStudents = students;
							testService.getThemes().then(function (data) {
								vm.avalibleThemes = data;
							});
						});
					});
				} else {
					if (id == 'new') {
						vm.currentTest = {
							CountAttempts: null,
							Id: null,
							Id_User_TestType: 1,
							IsCompleted: null,
							IsShowHints: true,
							Name: "",
							Questions: []
						};
						vm.currentQuestionEditable = 0;

						vm.currentTest.Questions[vm.currentQuestionEditable] = {
							Answers: [],
							Content: null,
							Id: null,
							Name: "",
							QuestionType: 1
						};
					} else {
					    testService.getTheme(id).then(function (data) {
					        if (data.Id_UserCreate == $rootScope.globals.currentUser.source.Id)
					        {
					            vm.currentTest = data;
					            console.log(data);
					        }
					        else {
					            toastr.error('Редактирование запрещено!');
					            $location.path(path);
					        }
						});
					}
				}
			}
		};

		$scope.$watch('vm.selected', function () {
		    vm.avalibleThemesQuestions = [];

			angular.forEach(vm.selected, function (value, key) {
			    testService.getTheme(value.Id).then(function (data) {
			        vm.avalibleThemesQuestions.push(data);
					angular.forEach(data.Questions, function (qValue) {
						vm.avalibleQuesions.push(qValue);
					});
				});
			});
		});

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

	BankTestController.$inject = injectParams;

	app.register.controller('BankTestController', BankTestController);

});