﻿'use strict';

define(['app'], function (app) {

	var injectParams = ['$http', '$rootScope', 'baseApiUrl', '$filter', '$q'];

	var pianoPlayerService = function ($http, $rootScope, baseApiUrl, $filter, $q) {
		String.prototype.replaceAt = function (index, character) {
			return this.substr(0, index) + character + this.substr(index + character.length);
		}

		var keys = {
			4: {
				C: 1,
				D: 1,
				F: 1,
				G: 1
			}
		};

		var service = {},
            serviceBase = baseApiUrl + 'piano/',
			barDuration = 4,
			timeline = 0,
			velocity = 127,
			key = keys[4],
			tempAlts = {},
			isInitialized = false,
			isPlaying = false;

		service.isPlaying = isPlaying;

		service.play = function(noteString, duration, moveTime, isRepeat) {
			var noteInt = calcNote(noteString);

			MIDI.noteOn(0, noteInt, velocity, timeline);
			MIDI.noteOff(0, noteInt, velocity, timeline + barDuration * duration);

			if (isRepeat !== undefined && isRepeat) {
				if ($rootScope.visualKeyboards[0][noteString] !== undefined && $rootScope.visualKeyboards[0][noteString] !== null) {
					setTimeout(function () {
						$rootScope.visualKeyboards[0][noteString].style.backgroundColor = '#666cff';
						$rootScope.visualKeyboards[0][noteString].style.marginTop = '5px';
						$rootScope.visualKeyboards[0][noteString].style.boxShadow = 'none';
						isPlaying = true;
					}, timeline * 1000);
					setTimeout(function () {
						$rootScope.visualKeyboards[0][noteString].style.backgroundColor = '';
						$rootScope.visualKeyboards[0][noteString].style.marginTop = '';
						$rootScope.visualKeyboards[0][noteString].style.boxShadow = '';
						isPlaying = false;
					}, (timeline + barDuration * duration) * 1000);
				}
			}

			if (typeof moveTime !== 'undefined' && moveTime === true) {
				move(duration);
			}
		};

		service.playNotesArray = function (notesArray, isRepeat) {

		    if (isRepeat === undefined && isRepeat == null)
		    {
		        isRepeat = true;
		    }

			for (var i = 0; i < notesArray.length; i++) {
				var current = notesArray[i];
				service.play(current.note, current.duration, current.isMove, isRepeat);
			}
		};

		service.clearTimeline = function () {
			timeline = 0;
		};

		service.setVolume = function (volume) {
			MIDI.setVolume(0, volume);
		};

		service.initialize = function (onSuccess) {
			console.log(isInitialized);
			//if (!isInitialized)
			//{
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
			//}
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
