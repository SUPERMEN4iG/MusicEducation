'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', 'pianoPlayerService', '$window', '$scope'];

	var PianoController = function ($location, $routeParams, $rootScope, $route, testService, toastr, pianoPlayerService, $window, $scope) {
		var vm = this,
            path = '/piano/',
			id = ($routeParams.id) ? $routeParams.id : '';

		vm.octaves = [];
		vm.notes = [];

		$scope.$watch('vm.octaves', function () {

				console.log('ON_PIANO_INIT');
				$rootScope.$emit('ON_PIANO_INIT', vm.octaves);

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
				vm.notes = [];
				pianoPlayerService.clearTimeline();
			}

			vm.isRecording = rec;
		};

		function keyDownListener(e) {
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
		};

		function keyUpListener(e) {
			lastEvent = null;
			delete heldKeys[e.keyCode];

			console.log('keyup');

			vm.keyUpTime = new Date();
			vm.nowTime = new Date();
			var evtobj = window.event ? event : e;
			var keyboradLayout = evtobj.shiftKey ? keyboardTest.shift : keyboardTest.general;
			var timePress = ((vm.nowTime.getTime() - vm.lastTime.getTime()) / 1000);
			if (vm.isRecording)
				vm.notes[vm.notes.length] = { note: keyboradLayout[e.keyCode], duration: timePress, isMove: true };

			for (var i = 0; i < $rootScope.visualKeyboards.length; i++) {
				if ($rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]] !== undefined) {
					$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.backgroundColor = '';
					$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.marginTop = '';
					$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.boxShadow = '';
				}
			}
			pianoPlayerService.clearTimeline();
		}


		var lastEvent;
		var heldKeys = {};

		$scope.$watch('vm.isShowModalPiano', function () {
			if (vm.isShowModalPiano) {
				pianoPlayerService.initialize(function () {
					setTimeout(function () {
						pianoPlayerService.setVolume(100);
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
	};

	PianoController.$inject = injectParams;

	app.register.controller('PianoController', PianoController);

});