'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', '$window', '$scope', 'pianoPlayerService'];

	var TestController = function ($location, $routeParams, $rootScope, $route, testService, toastr, $window, $scope, pianoPlayerService) {
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

		vm.currentTask = {
			localUserNotes: []
		};

		vm.playNotes = function (obj) {
			pianoPlayerService.clearTimeline();
			pianoPlayerService.playNotesArray(obj);
			pianoPlayerService.clearTimeline();
		};

		vm.setTaskState = function (state) {
			vm.taskState = state;
			$rootScope.$emit('ON_PIANO_INIT', vm.currentTest.Questions[vm.currentQuestion].Content.octaves);
		};

		vm.setRecording = function (rec) {
			if (rec)
			{
				vm.currentTask.localUserNotes = [];
			}

			vm.isRecording = rec;
		};

		vm.goToTest = function (test) {
		    if ($rootScope.globals.currentUser.source.RoleName == 'Учитель')
		    {
                $location.path(path + test.Id);
		    } else {
		        if (test.allCount == null) {
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

			if (vm.currentTest.Questions[vm.currentQuestion] !== undefined)
			{
				if (vm.currentTest.Questions[vm.currentQuestion].QuestionType == 2)
				{
					vm.isShowPiano = true;
				}
			}

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

		console.log(id);

		vm.keyDownTime = {};
		vm.keyUpTime = {};
		vm.nowTime;
		vm.lastTime;
		vm.tt;
		var lastEvent;
		var heldKeys = {};

		$scope.$watch('vm.isShowPiano', function () {
			if (vm.isShowPiano) {
				pianoPlayerService.initialize(function () {
					setTimeout(function () {
						pianoPlayerService.setVolume(100);
						console.log('INITIALIZE');
						console.log($window);
						$window.addEventListener('keydown', function (e) {
							console.log('keydown');
							if (lastEvent && lastEvent.keyCode == e.keyCode) {
								return;
							}
							lastEvent = e;
							heldKeys[e.keyCode] = true;

							if (vm.lastTime === undefined)
								vm.lastTime = new Date();

							vm.keyDownTime = new Date();
							var evtobj = window.event ? event : e;
							var keyboradLayout = evtobj.shiftKey ? keyboardTest.shift : keyboardTest.general;
							console.log(new Date().getTime() - vm.lastTime.getTime());
							vm.lastTime = new Date();

							pianoPlayerService.play(keyboradLayout[e.keyCode], 0, true);

							for (var i = 0; i < $rootScope.visualKeyboards.length; i++) {
								if ($rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]] !== undefined) {
									$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.backgroundColor = '#ff0000';
									$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.marginTop = '5px';
									$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.boxShadow = 'none';
								}
							}
							pianoPlayerService.clearTimeline();
						});

						$window.addEventListener('keyup', function (e) {
							lastEvent = null;
							delete heldKeys[e.keyCode];

							console.log('keyup');

							vm.keyUpTime = new Date();
							vm.nowTime = new Date();
							var evtobj = window.event ? event : e;
							var keyboradLayout = evtobj.shiftKey ? keyboardTest.shift : keyboardTest.general;
							var timePress = ((vm.nowTime.getTime() - vm.lastTime.getTime()) / 1000);

							if (vm.isRecording)
								vm.currentTask.localUserNotes[vm.currentTask.localUserNotes.length] = { note: keyboradLayout[e.keyCode], duration: timePress, isMove: true };

							for (var i = 0; i < $rootScope.visualKeyboards.length; i++) {
								if ($rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]] !== undefined) {
									$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.backgroundColor = '';
									$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.marginTop = '';
									$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.boxShadow = '';
								}
							}
							pianoPlayerService.clearTimeline();
						});

						pianoPlayerService.clearTimeline();
					}, 100);
				});
			}
		});

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
		        	testService.getTests($rootScope.globals.currentUser.source.Id).then(function (data) {
		                vm.testList = data;
		            });
		        } else {
		            testService.getTest(id).then(function (data) {
		            	vm.currentTest = data;
		            	console.log(vm.currentTest);
		                vm.nextQuestion();
		                if (vm.currentTest.Questions[vm.currentQuestion].QuestionType == 2) {
		                	setTimeout(function () {
		                		vm.isListening = true;
		                		$rootScope.$emit('ON_PIANO_INIT', vm.currentTest.Questions[vm.currentQuestion].Content.octaves);
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