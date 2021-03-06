﻿'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', '$window', '$scope', 'pianoPlayerService', 'userService', 'studentService', '$filter'];

	var TaskController = function ($location, $routeParams, $rootScope, $route, testService, toastr, $window, $scope, pianoPlayerService, userService, studentService, $filter) {
		var vm = this,
            path = '/task/',
			id = ($routeParams.id) ? $routeParams.id : '';

		vm.testTypeDictionary = [
			{ Id: 1, Name: 'Обучающиее задание' },
			{ Id: 2, Name: 'Контрольное задание' }
		];

		vm.isShowHintsDictionary = [
			{ Id: 1, Name: 'Показывать' },
			{ Id: 0, Name: 'Не показывать' }
		];

		vm.pianoSettings = {
		    isShowHints: true
		};

		vm.testList = [];
		vm.avalibleTestList = [];
		vm.id = id;
		vm.currentTest = [];
		vm.currentQuestion = -1;

		vm.selectedAnswer = false;

		vm.state = 'login';

		$rootScope.pageName = 'Main';
		vm.controllerName = 'Задания';
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

		vm.testState = 1;

		vm.currentQuestionEditable = 0;

		vm.currentInputGroup = {};
		vm.isShowGroupWindow = false;
		vm.isShowUserWindow = false;

		vm.avalibleGroups = [];
		vm.avalibleStudents = [];
		vm.selectedStudents = [];
		vm.selectedGroups = [];
		vm.selectedTasks = [];

		vm.playNotes = function (obj) {
			pianoPlayerService.clearTimeline();

			var isRepeat = false;

			if (vm.taskState == 2) {
				isRepeat = true;
			} else if (vm.currentTest.Id_User_TestType == 1 && vm.currentTest.IsShowHints) {
				isRepeat = true;
			} else if (vm.currentTest.IsShowHints) {
				isRepeat = true;
			}
			console.info('isRepeat = ', isRepeat);
			pianoPlayerService.playNotesArray(obj, isRepeat);

			pianoPlayerService.clearTimeline();
		};

		vm.setTaskState = function (state) {
			vm.taskState = state;
			$rootScope.$emit('ON_PIANO_INIT', {
				octaves: vm.currentTest.Questions[vm.currentQuestion].Content.octaves,
				isshowhint: vm.pianoSettings.isShowHints
			});
		};

		$scope.$watch('vm.pianoSettings.isShowHints', function () {
		    console.log('ON_PIANO_INIT');
		    $rootScope.$emit('ON_PIANO_INIT', {
		        octaves: vm.currentTest.Questions[vm.currentQuestion].Content.octaves,
		        isshowhint: vm.pianoSettings.isShowHints
		    });
		});

		vm.setRecording = function (rec) {
			if (rec) {
				vm.currentTask.localUserNotes = [];
			}

			vm.isRecording = rec;
		};

		vm.goToTest = function (test) {
			if ($rootScope.globals.currentUser.source.RoleName == 'Учитель') {
				$location.path(path + test.Id);
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
			    vm.currentTest.Questions[0].Content = "";
			    testService.insertTaskResult(vm.currentTest).then(function (responseData) {
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

		var findInDictionaryByName = function (obj, key) {
			var found = $filter('filter')(obj, { Name: key }, true);
			return found[0];
		};

		vm.appendTaskToGroup = function () {
		    var counter = 0;

			vm.currentInputGroup.User_TestType = 'Обучающиее задание';
			vm.currentInputGroup.User_TestType = findInDictionaryByName(vm.testTypeDictionary, vm.currentInputGroup.User_TestType).Id;
			vm.currentInputGroup.IsShowHints = findInDictionaryByName(vm.isShowHintsDictionary, vm.currentInputGroup.IsShowHints).Id;

			angular.forEach(vm.selectedGroups, function (vGroup, kGroup) {
				angular.forEach(vm.selectedTasks, function (vTest, kTest) {
					counter++;
					testService.appendTaskToGroup(kGroup, kTest, vm.currentInputGroup.CountAttempts, vm.currentInputGroup.Timing, '', vm.currentInputGroup.User_TestType, vm.currentInputGroup.IsShowHints).then(function (data) {
					    toastr.info('Задание отправлено группе');
					});
				});
			});
		};

		vm.appendTaskToUser = function () {
		    var counter = 0;

			vm.currentInputGroup.User_TestType = 'Обучающиее задание';
			vm.currentInputGroup.User_TestType = findInDictionaryByName(vm.testTypeDictionary, vm.currentInputGroup.User_TestType).Id;
			vm.currentInputGroup.IsShowHints = findInDictionaryByName(vm.isShowHintsDictionary, vm.currentInputGroup.IsShowHints).Id;

			angular.forEach(vm.selectedStudents, function (vUser, kUser) {
				angular.forEach(vm.selectedTasks, function (vTest, kTest) {
					counter++;

					testService.appendTaskToUser(kUser, kTest, vm.currentInputGroup.CountAttempts, vm.currentInputGroup.Timing, '', vm.currentInputGroup.User_TestType, vm.currentInputGroup.IsShowHints).then(function (data) {
					    studentService.getStudent(kUser).then(function (user) {
					        toastr.info('Задание отправлено пользоватлю');
					        $rootScope.notificationService.sendNotification($rootScope.globals.currentUser.source.Id, user.Login, "Тест", "Получен новое задание!", 1);
					        //init();
					    });
					});
				});
			});
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

		vm.addTask = function () {
			$location.path('constructor');
		};

		vm.deleteTask = function (test) {
		    if ($rootScope.globals.currentUser.source.RoleName == 'Учитель') {
		        if (test.Id_User == $rootScope.globals.currentUser.source.Id) {
		            testService.deleteTest(test.Id).then(function (responseData) {
		                if (responseData.Status == 1) {
		                    toastr.error('Удаление запрещено! Задание уже было назначено!');
		                } else {
		                    angular.forEach(vm.avalibleTestList, function (v, k) {
		                        console.info(v.Id, test.Id);
		                        if (v.Id == test.Id) {
		                            vm.avalibleTestList.splice(k, 1);
		                            toastr.success('Успешное удаление ' + test.Name);
		                            //delete vm.users[k];
		                        }
		                    });
		                }
		            });
		        } else {
		            toastr.error('Вы не можете удалять задания других разработчиков');
		        }
		    }
		};

		vm.deleteTasks = function () {
		    angular.forEach(vm.selectedTasks, function (value, key) {
		        if (value) {
		            testService.getTest(key).then(function (test) {
		                if (test.Id_UserCreate == $rootScope.globals.currentUser.source.Id) {
		                    testService.deleteTest(key).then(function (responseData) {
		                        if (responseData.Status == 1) {
		                            toastr.error('Удаление запрещено! Задание уже было назначено!');
		                        } else {
		                            angular.forEach(vm.avalibleTestList, function (v, k) {
		                                if (v.Id == key) {
		                                    vm.avalibleTestList.splice(k, 1);
		                                    toastr.success('Успешное удаление ' + test.Name);
		                                    //delete vm.users[k];
		                                }
		                            });
		                        }
		                    });
		                } else {
		                    toastr.error('Вы не можете удалять задания других разработчиков');
		                }
		            });
		        }
		    });
		};

		console.log(id);

		vm.keyDownTime = {};
		vm.keyUpTime = {};
		vm.nowTime;
		vm.lastTime;
		vm.tt;
		var lastEvent;
		var heldKeys = {};

		var keyUpListener = function (e) {
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
		};

		var keyDownListener = function (e) {
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
		            $rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.backgroundColor = '#666cff';
		            $rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.marginTop = '5px';
		            $rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.boxShadow = 'none';
		        }
		    }
		    pianoPlayerService.clearTimeline();
		};

		vm.volumeLevel = 35;

		$scope.$watch('vm.volumeLevel', function () {
		    pianoPlayerService.setVolume(vm.volumeLevel);
		});

		$scope.$watch('vm.isShowPiano', function () {
			if (vm.isShowPiano) {
				pianoPlayerService.initialize(function () {
					setTimeout(function () {
					    pianoPlayerService.setVolume(vm.volumeLevel);
						console.log('INITIALIZE');
						console.log($window);
						$window.addEventListener('keydown', keyDownListener);
						$window.addEventListener('keyup', keyUpListener);

						pianoPlayerService.clearTimeline();
					}, 100);
				});
			}
		});

		vm.parsedTimeLeft = '';
		vm.stateTest = 0;
		vm.intervalTiming = null;

		function init() {

			if ($rootScope.globals.currentUser.source.RoleName == 'Учитель') {
				if (id == '') {
					userService.getGroups().then(function (groups) {
						vm.avalibleGroups = groups;

						studentService.getStudents().then(function (students) {
							vm.avalibleStudents = students;
							testService.getAvalibleTasks().then(function (data) {
								vm.stateTest = 0;
								vm.avalibleTestList = data;
								console.log(vm.avalibleTestList);
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
					} else {
						testService.getTest(id).then(function (data) {
							vm.currentTest = data;
							
						});
					}
				}
			} else {
				if (id == '') {
					userService.getGroups().then(function (groups) {
						vm.avalibleGroups = groups;

						studentService.getStudents().then(function (students) {
							vm.avalibleStudents = students;
							testService.getTasks($rootScope.globals.currentUser.source.Id).then(function (data) {
								vm.testList = data;
							});
						});
					});
				} else {
					testService.getTest(id).then(function (data) {
						vm.currentTest = data;
						console.log(vm.currentTest);
						vm.nextQuestion();

						vm.stateTest = 1;

						vm.intervalTiming = setInterval(function () {
							if (vm.stateTest == 1) {
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
							else if (vm.stateTest == 0) {
								if (vm.intervalTiming) {
									clearInterval(vm.intervalTiming);
								}
							}
						});

						if (vm.currentTest.Questions[vm.currentQuestion].QuestionType == 2) {
							setTimeout(function () {
								vm.isListening = true;
								$rootScope.$emit('ON_PIANO_INIT', {
									octaves: vm.currentTest.Questions[vm.currentQuestion].Content.octaves,
									isshowhint: vm.pianoSettings.isShowHints
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

		if ($rootScope.globals.currentUser.source === undefined) {
			$rootScope.$on('ON_FINISH_LOADING', function (event, data) {
				init();
			});
		} else {
			init();
		}

		$scope.$on('$locationChangeStart', function (event) {
		    pianoPlayerService.clearTimeline();
		    $window.removeEventListener('keydown', keyDownListener, false);
		    $window.removeEventListener('keyup', keyUpListener, false);
		});
	};

	TaskController.$inject = injectParams;

	app.register.controller('TaskController', TaskController);

});