'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'testService', 'toastr', 'pianoPlayerService'];

	var PianoController = function ($location, $routeParams, $rootScope, $route, testService, toastr, pianoPlayerService) {
		var vm = this,
            path = '/piano/',
			id = ($routeParams.id) ? $routeParams.id : '';

		var notesArray = [

			{ note: 'A5', duration: 1, isMove: true },
			{ note: 'B5', duration: 1, isMove: true },
			{ note: 'C5', duration: 1, isMove: true },

			{ note: 'C2', duration: 1 },
			{ note: 'C1', duration: 1 },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },

			{ note: 'C2', duration: 1 },
			{ note: 'C1', duration: 1 },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },

			{ note: 'B1', duration: 1 },
			{ note: 'B2', duration: 1 },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },
			{ note: 'G3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },

			{ note: 'A1', duration: 1 },
			{ note: 'A2', duration: 1 },
			{ note: 'A3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },
			{ note: 'A3', duration: 1 / 12, isMove: true },
			{ note: 'C4', duration: 1 / 12, isMove: true },
			{ note: 'E4', duration: 1 / 12, isMove: true },

			{ note: 'F1', duration: 1 },
			{ note: 'F2', duration: 1 },
			{ note: 'F2', duration: 1 / 12, isMove: true },
			{ note: 'A3', duration: 1 / 12, isMove: true },
			{ note: 'D4%', duration: 1 / 12, isMove: true },
			{ note: 'F4', duration: 1 / 12, isMove: true },
			{ note: 'A3', duration: 1 / 12, isMove: true },
			{ note: 'D4', duration: 1 / 12, isMove: true },
			{ note: 'F4', duration: 1 / 12, isMove: true },
		];

		function playTest() {
			for (var i = 0; i < notesArray.length; i++) {
				var current = notesArray[i];
				pianoPlayerService.play(current.note, current.duration, current.isMove);
			}
		}

		function init() {
			pianoPlayerService.initialize(function () {
				toastr.info('Создаю клавиатуру..');
				setTimeout(function () {
					pianoPlayerService.setVolume(100);
					buildKeyboard();
					toastr.info('Клавиатура создана!');

					setTimeout(function () {
						toastr.info('Включаю Бетховена!');
						pianoPlayerService.clearTimeline();
						playTest();
						pianoPlayerService.clearTimeline();
					}, 1000);
				}, 100);
			});
		};

		init();
	};

	PianoController.$inject = injectParams;

	app.register.controller('PianoController', PianoController);

});