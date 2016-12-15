'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', '$window', '$scope', 'userService', 'studentService'];

	var TestController = function ($location, $routeParams, $rootScope, $route, testService, toastr, $window, $scope, userService, studentService) {
		var vm = this,
            path = '/test/',
			id = ($routeParams.id) ? $routeParams.id : '';

		vm.testList = [];
		vm.avalibleTestList = [];
		vm.id = id;
		vm.currentTest = [];
		vm.currentQuestion = -1;
		
		vm.selectedAnswer = false;

		vm.state = 'login';

		$rootScope.pageName = 'Main';
		vm.controllerName = 'Тесты';
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
		vm.isShowStatisticTest = false;

		vm.currentTask = {
			localUserNotes: []
		};

		vm.testState = 1;

		vm.currentQuestionEditable = 0;

		vm.avalibleGroups = [];
		vm.avalibleStudents = [];
		vm.selectedStudents = [];
		vm.selectedGroups = [];
		vm.selectedTests = [];

		vm.parsedTimeLeft = '';

		vm.goToTest = function (test) {
		    if ($rootScope.globals.currentUser.source.RoleName == 'Учитель')
		    {
		        if (test.Id_User == $rootScope.globals.currentUser.source.Id) {
		            testService.getCountAppendingTest(test.Id).then(function (res) {
		                if (res == 0)
		                {
		                    $location.path(path + test.Id);
		                } else {
		                    toastr.error('Редактирование запрещено! Тест уже был назначен!');
		                }
		            });
		        } else {
		            toastr.error('Редактирование запрещено! Вы не разработчик теста!');
		        }
		    } else {
		    	console.log(test);
		    	if (test.UserAnswerValidPercent == 100) {
		    		toastr.info('Вы уже прошли этот тест на 100%');
		    	} else if (test.CountAttempts > 0) {
		    		$location.path(path + test.Id);
		    		toastr.info('Осталось ' + test.CountAttempts + ' попытки');
		    		//test.allCount == null
		    	} else {
		    		toastr.info('Попытки кончились!');
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

			if (vm.currentTest.Questions[vm.currentQuestion] !== undefined)
			{
				if (vm.currentTest.Questions[vm.currentQuestion].QuestionType == 2)
				{
					vm.isShowPiano = true;
				}
			}

			if (vm.currentTest.Questions.length <= vm.currentQuestion)
			{
				console.info(vm.currentTest);
				testService.insertTestResult(vm.currentTest).then(function (responseData) {
					console.log(responseData);
					vm.testResult = responseData;
					vm.testResult.CountAnswerValid = responseData.CountAnswerValid; // Всего
					vm.testResult.CountUserAnswerValid = responseData.CountUserAnswerValid; // Правельных
					vm.testResult.UserAnswerValidPercent = responseData.UserAnswerValidPercent; // Процент правельных
					vm.isTestComplete = true;

					testService.updateUserTestTiming($rootScope.globals.currentUser.source.Id, id, vm.currentTest.Timing, true).then(function (result) {
					    clearInterval(vm.intervalTiming);
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
					    if (data.Status == 1) {
					        toastr.success("Тест отправлен!");
					    }  else {
					        toastr.error("Тест не отправлен!");
					    }
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
					    if (data.Status == 1) {
					        studentService.getStudent(kUser).then(function (user) {
					            toastr.success("Тест отправлен!");
					            $rootScope.notificationService.sendNotification($rootScope.globals.currentUser.source.Id, user.Login, "Тест", "Получен новый тест!", 1);
					            init();
					        });
					    } else {
					        toastr.error("Тест не отправлен!");
					    }
					});
				});
			});
		};

		vm.deleteTest = function (test) {
			toastr.error('Функционал не реализован...');
		};

		vm.deleteTests = function () {
			toastr.error('Функционал не реализован...');
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
				if (q.QuestionType == 2)
				{
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
			if (vm.currentTest.Questions[index] === undefined)
			{
				vm.currentTest.Questions[index] = {
					Content: null,
					Id: null,
					Name: "",
					QuestionType: 1,
					Answers: []
				}
			}

			vm.currentQuestionEditable = index;
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
			if (answer === undefined)
			{
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

		vm.stateTest = 0;
		vm.intervalTiming = null;

		function init() {

		    if ($rootScope.globals.currentUser.source.RoleName == 'Учитель') {
		    	if (id == '') {
		    		userService.getGroups().then(function (groups) {
		    			vm.avalibleGroups = groups;

		    			studentService.getStudents().then(function (students) {
		    				vm.avalibleStudents = students;
		    				testService.getAvalibleTests().then(function (data) {
		    					vm.avalibleTestList = data;
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
		        			Name: 'Название',
							Questions: []
		        		};
		        		vm.currentQuestionEditable = 0;

		        		vm.currentTest.Questions[vm.currentQuestionEditable] = {
		        			Answers: [],
		        			Content: null,
		        			Id: null,
		        			Name: "Вопрос",
		        			QuestionType: 1
		        		};
		        	}
		        	else {
		        		testService.getTest(id).then(function (data) {
		        			vm.currentTest = data;
		        			console.log(data);
		        		});
		        	}
		        }
		    } else {
		    	if (id == '') {
		    		vm.stateTest = 0;
		        	testService.getTests($rootScope.globals.currentUser.source.Id).then(function (data) {
		                vm.testList = data;
		            });
		        } else {
		            testService.getTest(id).then(function (data) {
		            	vm.currentTest = data;
		            	console.log(vm.currentTest);
		            	vm.nextQuestion();
		            	vm.stateTest = 1;

		            	vm.intervalTiming = setInterval(function () {
		            		if (vm.stateTest == 1)
		            		{
		            			if (vm.currentTest.TimingLeft > 0) {
		            				vm.currentTest.TimingLeft--;

		            				vm.currentTest.TimingLeft = Number(vm.currentTest.TimingLeft);
		            				var h = Math.floor(vm.currentTest.TimingLeft / 3600);
		            				var m = Math.floor(vm.currentTest.TimingLeft % 3600 / 60);
		            				var s = Math.floor(vm.currentTest.TimingLeft % 3600 % 60);
		            				vm.parsedTimeLeft = ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);

		            				$scope.$apply();
		            			}

		            			if (vm.currentTest.TimingLeft == 0) {
		            				testService.updateUserTestTiming($rootScope.globals.currentUser.source.Id, id, vm.currentTest.TimingLeft, true).then(function (result) {
		            					vm.stateTest = 0;
		            					$location.path(path)
		            					setTimeout(function () {
		            						$window.location.reload();
		            					}, 1000);
		            				});
		            			}
		            		}
		            	}, 1000);

		            	$scope.$on("$locationChangeStart", function (event) {
		            		if (vm.stateTest == 1 && vm.testResult.UserAnswerValidPercent === undefined) {
		            			if (!confirm('Вы потеряете время и результаты аннулируются, перейти?'))
		            				event.preventDefault();
		            			else {
		            				testService.updateUserTestTiming($rootScope.globals.currentUser.source.Id, id, vm.currentTest.TimingLeft, true).then(function (result) {
		            					$location.path(path)
		            					setTimeout(function () {
		            						$window.location.reload();
		            					}, 1000);
		            				});
		            			}
		            		}
		            		else if (vm.stateTest == 0)
		            		{
		            			if (vm.intervalTiming)
		            			{
		            				clearInterval(vm.intervalTiming);
		            			}
		            		}
		            	});

		                if (vm.currentTest.Questions[vm.currentQuestion].QuestionType == 2) {
		                	setTimeout(function () {
		                		vm.isListening = true;
		                		$rootScope.$emit('ON_PIANO_INIT', {
		                			octaves: vm.currentTest.Questions[vm.currentQuestion].Content.octaves,
		                			isshowhint: vm.currentTest.IsShowHints
		                		});
		                		vm.taskState = 1;
		                	}, 100);
		                	//$scope.$watch('vm.currentTest.Questions[vm.currentQuestion].Content.octaves', function () {
		                	//	$rootScope.$emit('ON_PIANO_INIT', vm.currentTest.Questions[vm.currentQuestion].Content.octaves);
		                	//});
		                }
		                //if (vm.currentTest.Questions[vm.currentQuestion].QuestionType == 2) {
		                	
		                //}
		            });
		        }
		    }
		};

		//$scope.$watch('vm.newTask.question_octaves', function () {
		//	$rootScope.$emit('ON_PIANO_INIT', vm.newTask.question_octaves);
	    //});

		vm.pushNewData = function () {

		    vm.dataGraph1.push({
		        year: 'Январь',
		        income: 70
		    });

		    vm.dataGraph1.push({
		        year: 'Февраль',
		        income: 65
		    });

		    vm.dataGraph1.push({
		        year: 'Март',
		        income: 72
		    });

		    //vm.chart.dataProvider.push({
		    //    year: 2010,
		    //    income: 35.2,
		    //    expenses: 18.8
		    //});
		    vm.chart.validateData();
		    console.log(vm.chart.dataProvider);
		};
		var day = 0;
		var firstDate = new Date();
		firstDate.setDate(firstDate.getDate() - 500);
		function generateChartData() {
		    userService.getGraphVisits().then(function (data) {
		        angular.forEach(data, function (v) {
		            vm.dataGraph1.push({
		                "date": new Date(v.date),
		                "visits": v.visits
		            });
		        });
		        console.log(vm.dataGraph1);
		        vm.chart.validateData();
		    });

		    //for (day = 0; day < 50; day++) {
		    //    var newDate = new Date(firstDate);
		    //    newDate.setDate(newDate.getDate() + day);

		    //    var visits = Math.round(Math.random() * 40) - 0;

		    //    chartData.push({
		    //        "date": newDate,
		    //        "visits": visits
		    //    });
		    //}

		    //console.log(chartData);
		}

		//generateChartData();

		vm.chart = {};
		vm.dataGraph1 = [];

		$scope.$watch('vm.chart', function () {
		    console.info(vm.chart);
		});

		vm.showStatisticTest = function (id) {
		    vm.isShowStatisticTest = true;

		    vm.dataGraph1.splice(0, vm.dataGraph1.length);
		    vm.chart.validateData();

		    userService.getGraphTest(id).then(function (data) {
		        angular.forEach(data, function (v) {
		            vm.dataGraph1.push({
		                "date": new Date(v.date),
		                "visits": v.visits
		            });
		        });
		        vm.chart.validateData();
		    });

		    //generateChartData();

		};

		vm.amChartOptions = {
		    type: "serial",
		    language: "ru",
		    theme: "dark",
		    zoomOutButton: {
		        backgroundColor: '#000000',
		        backgroundAlpha: 0.15
		    },
		    data: vm.dataGraph1,
		    categoryField: "date",
		    categoryAxis: {
		        parseDates: true,
		        minPeriod: "DD",
		        dashLength: 1,
		        gridAlpha: 0.15,
		        axisColor: "#555555"
		    },
		    allLabels: [{
		        color: '#FFFFFF'
		    }],
		    graphs: [{
		        id: "g1",
		        valueField: "visits",
		        bullet: "round",
		        bulletBorderColor: "#FFFFFF",
		        bulletBorderThickness: 2,
		        lineThickness: 2,
		        lineColor: "#569edd",
		        balloonColor: "#0352b5",
		        negativeLineColor: "#0352b5",
		        hideBulletsCount: 50
		    }],
		    chartCursor: {
		        cursorPosition: "mouse"
		    },
		    chartScrollbar: {
		        graph: "g1",
		        scrollbarHeight: 40,
		        color: "#FFFFFF",
		        autoGridCount: true
		    }
		}

		vm.currentUserSource = function () {
			return $rootScope.globals.currentUser.source;
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