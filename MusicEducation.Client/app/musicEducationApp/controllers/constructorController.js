'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', 'pianoPlayerService', '$window', '$scope'];

	var ConstructorController = function ($location, $routeParams, $rootScope, $route, testService, toastr, pianoPlayerService, $window, $scope) {
		var vm = this,
            path = '/constructor/',
			id = ($routeParams.id) ? $routeParams.id : '';

		vm.octaves = [];
		vm.notes = [];

		$scope.$watch('vm.newTask.question_octaves', function () {

			console.log('ON_PIANO_INIT');
			$rootScope.$emit('ON_PIANO_INIT', {
				octaves: vm.newTask.question_octaves,
				isshowhint: vm.pianoSettings.isShowHints
			});

		});

		$scope.$watch('vm.pianoSettings.isShowHints', function () {
			console.log('ON_PIANO_INIT');
			$rootScope.$emit('ON_PIANO_INIT', {
				octaves: vm.newTask.question_octaves,
				isshowhint: vm.pianoSettings.isShowHints
			});
		});

		vm.playPiano = function (notes) {
			console.log(notes);
			pianoPlayerService.clearTimeline();
			pianoPlayerService.playNotesArray(notes);
		};

		vm.keyDownTime = {};
		vm.keyUpTime = {};
		vm.nowTime;
		vm.lastTime;
		vm.tt;
		var lastEvent;
		var heldKeys = {};

		vm.isListening = false;
		vm.isRecording = false;
		vm.taskState = 1;

		vm.setRecording = function (rec) {
			if (rec) {
				vm.newTask.question_content = [];
				pianoPlayerService.clearTimeline();
			}

			vm.isRecording = rec;
		};

		vm.pianoSettings = {
			isShowHints: true
		};

		vm.newTask = {
			idUser: $rootScope.globals.currentUser.source.Id,
			idUser_test: null,
			question_name: '',
			question_octaves: [],
			question_content: [],
			test_name: '',
			test_complexity: 1
		};

		vm.insertTestWithContent = function () {
			testService.insertTestWithContent(vm.newTask).then(function () {
				vm.hideModalPiano();
				toastr.success('Успешное добавление задания');

				vm.newTask = {
					idUser: $rootScope.globals.currentUser.source.Id,
					idUser_test: null,
					question_name: '',
					question_octaves: [],
					question_content: [],
					test_name: '',
					test_complexity: 1
				};
			});
		};

		vm.focusTestName = false;
		vm.blurTestName = false;

		function keyDownListener(e) {
		    if (!vm.focusTestName)
		    {
		        console.log('keydown');
		        if (lastEvent && lastEvent.keyCode == e.keyCode) {
		            return;
		        }
		        lastEvent = e;
		        heldKeys[e.keyCode] = true;

		        console.log(e.which);

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
		    } else {
		        console.log('keydown vm.focusTestName');
		    }
		};

		function keyUpListener(e) {
		    if (!vm.focusTestName)
		    {
		        lastEvent = null;
		        delete heldKeys[e.keyCode];

		        console.log('keyup');

		        vm.keyUpTime = new Date();
		        vm.nowTime = new Date();
		        var evtobj = window.event ? event : e;
		        var keyboradLayout = evtobj.shiftKey ? keyboardTest.shift : keyboardTest.general;
		        var timePress = ((vm.nowTime.getTime() - vm.lastTime.getTime()) / 1000);
		        if (vm.isRecording)
		            vm.newTask.question_content[vm.newTask.question_content.length] = { note: keyboradLayout[e.keyCode], duration: timePress, isMove: true };

		        for (var i = 0; i < $rootScope.visualKeyboards.length; i++) {
		            if ($rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]] !== undefined) {
		                $rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.backgroundColor = '';
		                $rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.marginTop = '';
		                $rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.boxShadow = '';
		            }
		        }
		        pianoPlayerService.clearTimeline();
		    }
		}


		var lastEvent;
		var heldKeys = {};
		vm.volumeLevel = 35;

		$scope.$watch('vm.volumeLevel', function () {
		    pianoPlayerService.setVolume(vm.volumeLevel);
		});

		$scope.$watch('vm.isShowModalPiano', function () {
			if (vm.isShowModalPiano) {
				pianoPlayerService.initialize(function () {
					setTimeout(function () {
					    pianoPlayerService.setVolume(vm.volumeLevel);
						console.log('INITIALIZE');
						console.log($window);

						$window.addEventListener('keydown', keyDownListener, false);
						$window.addEventListener('keyup', keyUpListener, false);

						pianoPlayerService.clearTimeline();

						if (vm.taskId !== undefined && vm.taskId !== null) {
							testService.getTest(vm.taskId).then(function (data) {
								vm.currentTest = data;
								console.log(vm.currentTest);
							});
						}
					}, 100);
				});
			} else {
				console.log('DEINITIALIZE');
				pianoPlayerService.clearTimeline();
				vm.taskId = null;
				vm.currentTest = null;
				$window.removeEventListener('keydown', keyDownListener, false);
				$window.removeEventListener('keyup', keyUpListener, false);
				init();
			}
		});

		function init() {
			vm.isShowModalPiano = true;
		};

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

	ConstructorController.$inject = injectParams;

	app.register.controller('ConstructorController', ConstructorController);

});