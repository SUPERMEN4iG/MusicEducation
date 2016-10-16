'use strict';

define(['app'], function (app) {

	var injectParams = ['$http', '$rootScope', 'baseApiUrl', '$filter', '$q'];

	var pianoPlayerService = function ($http, $rootScope, baseApiUrl, $filter, $q) {
		var service = {},
            serviceBase = baseApiUrl + 'piano/',
			barDuration = 8,
			timeline = 0,
			velocity = 127,
			key = keys[4],
			tempAlts = {},
			isInitialized = false;

		service.play = function(noteString, duration, moveTime) {
			var noteInt = calcNote(noteString);

			MIDI.noteOn(0, noteInt, velocity, timeline);
			MIDI.noteOff(0, noteInt, velocity, timeline + barDuration * duration);

			if (typeof moveTime !== 'undefined' && moveTime === true) {
				move(duration);
			}
		};

		service.clearTimeline = function () {
			timeline = 0;
		};

		service.setVolume = function (volume) {
			MIDI.setVolume(0, volume);
		};

		service.initialize = function (onSuccess) {
			if (!isInitialized)
			{
				MIDI.loadPlugin({
					soundfontUrl: "./soundfont/",
					instrument: "acoustic_grand_piano",
					onprogress: function (state, progress) {
						console.log(state, progress);
					},
					onsuccess: function () {
						onSuccess();
						isInitialized = !isInitialized;
					}
				});
			}
		};

		var move = function(duration) {
			timeline += barDuration * duration;
			if (isEndOfBar()) {
				tempAlts = {};}
		};

		var calcNote = function(noteString) {
			var note = noteString[0];
			var noteWithOctave = noteString.substring(0,2);
			var altering = getAltering(noteString);
			// set altering
			if (altering) {
				setTempAltering(noteWithOctave, altering);
			}
			// if temporary altering is set - start keys shouldn't be applied
			if (tempAlts[noteWithOctave] !== undefined) {
				return MIDI.keyToNote[noteWithOctave] + tempAlts[noteWithOctave];
			}
			return MIDI.keyToNote[noteWithOctave] +
					(key[note] !== undefined ? key[note] : 0);
		};

		var isEndOfBar = function() {
			return !!(timeline % barDuration === 0)
		};

		var getAltering = function(noteString) {
			var altering = noteString[2];
			return altering !== undefined ? altering : false;
		};

		var setTempAltering = function(noteWithOctave, altering) {
			switch (altering) {
				case 'b': tempAlts[noteWithOctave] = -1; break;
				case '%': tempAlts[noteWithOctave] = 0;  break;
				case '#': tempAlts[noteWithOctave] = 1;  break;
			}
		}

		//service.getReportBlank = function (branchId, isClosed) {
		//	var deferred = $q.defer();

		//	//if (listReportBlank.length == 0) {
		//	//    $http.get(serviceBase + 'ReportBlank/', { params: { branchId: branchId, isClosed: isClosed } }).then(
		//	//            function (response) {
		//	//                deferred.resolve(response.data);
		//	//                listReportBlank.push(response.data);
		//	//            },
		//	//            function (response) {
		//	//                deferred.reject(response.data);
		//	//            });
		//	//}
		//	//else {
		//	//    angular.forEach(listReportBlank, function (val) {
		//	//        deferred.resolve(val);
		//	//    });
		//	//}

		//	$http.get(serviceBase + 'ReportBlank/', { params: { branchId: branchId, isClosed: isClosed } }).then(
        //                function (response) {
        //                	deferred.resolve(response.data);
        //                	listReportBlank.push(response.data);
        //                },
        //                function (response) {
        //                	deferred.reject(response.data);
        //                });

		//	return deferred.promise;
		//};

		return service;
	};

	pianoPlayerService.$inject = injectParams;

	app.factory('pianoPlayerService', pianoPlayerService);

});
