'use strict';

define(['app'], function (app) {

	var injectParams = ['$window', '$rootScope', 'pianoPlayerService'];

	var pianoDirective = function ($window, $rootScope, pianoPlayerService) {
		return {
			restrict: 'E',
			scope: {
				octaves: '@',
				keyboardid: '=',
				isshowhint: '@'
			},
			template: '<div class="keyboard-options">'+
						'<div id="keyboard-{{keyboardid}}" class="keyboard-holder"></div>' +
					  '</div>',
			link: function (scope, element, attrs) {
				console.log('LINK RUN');
				console.log(scope.octaves);
				$rootScope.$on('ON_PIANO_INIT', function (event, data) {
					console.info('PIANO INIT');
					//scope.visualKeyboards[scope.keyboardid] = angular.element(element.children()[0][0]);
					scope.octaves = data.octaves;
					scope.isshowhint = data.isshowhint;
					//if (scope.octaves === undefined || scope.octaves === null) {
					//	scope.octaves = ['1', '2', '3'];
					//}

					var evtListener = ['mousedown', 'mouseup'];
					var iKeys = 0;
					var iWhite = 0;
					var iBlack = 0;

					$rootScope.visualKeyboards[scope.keyboardid] = {};
					element.children().children().empty();

					for (var oct in scope.octaves) {
						for (var n in scope.simpleOctave) {
							var thisKey = document.createElement('div');
							n = n.replaceAt(1, scope.octaves[oct].toString())
							var key = '';
							if (n.length <= 2) {
								thisKey.className = 'white key';
								thisKey.style.width = '40px';
								thisKey.style.height = '200px';
								thisKey.style.left = 40 * iWhite + 'px';
								iWhite++;
								key = scope.getKey(n);
							} else {
								console.log('black KEY = ' + n);
								thisKey.className = 'black key';
								thisKey.style.width = '30px';
								thisKey.style.height = '120px';
								thisKey.style.left = (40 * (iWhite - 1)) + 25 + 'px';
								iBlack++;
								key = scope.getKey(n);
								console.log(n);
							}
							console.log(scope.isshowhint);
							if (!scope.isshowhint) {
								key = '';
							} else {
								
							}

							var label = document.createElement('div');
							label.className = 'label';
							label.innerHTML = '<b>' + '' + '</b>' + '<br /><br />' + key +
								'<span name="OCTAVE_LABEL" value="' + key + '"></span>';
							thisKey.appendChild(label);
							thisKey.setAttribute('ID', 'KEY_' + n + ',' + 1);
							thisKey.addEventListener(evtListener[0], (
								function (_temp, _key) {
									return function () {
										console.info('onkeydown');
										_key.style.backgroundColor = '#666cff';
										_key.style.marginTop = '5px';
										_key.style.boxShadow = 'none';
										pianoPlayerService.play(_temp, 0, true);
										pianoPlayerService.clearTimeline();
									}
							})(n, thisKey));						
							
							thisKey.addEventListener(evtListener[1], (
								function (_temp, _key) {
									return function () {
										_key.style.backgroundColor = '';
										_key.style.marginTop = '';
										_key.style.boxShadow = '';
										console.info('onkeyup');
										pianoPlayerService.clearTimeline();
									}
								})(n, thisKey));
							element.children().children().append(thisKey);
							$rootScope.visualKeyboards[scope.keyboardid][n] = thisKey;
							//scope.visualKeyboards[scope.keyboardid][n] = thisKey;
							//scope.visualKeyboards[scope.keyboardid].append(thisKey);
						}
					}
					element.children().width(iWhite * 40);
				});
				
				//scope.visualKeyboards[scope.keyboardid].width(iWhite * 40);
			},
			controller: (['$scope', '$rootScope',
			function ($scope, $rootScope) {
				$scope.isshowhint = false;
				$scope.visualKeyboards = [];
				$scope.simpleOctave = {
					'A1': 1,
					'A1#': 1,
					'B1': 1,
					'B1#': 1,
					'C1': 1,
					'D1': 1,
					'D1#': 1,
					'E1': 1,
					'E1#': 1,
					'F1': 1,
					'F1#': 1,
					'G1': 1
				};

				$scope.keys = {
					shift: {
						49: 'C3#',
						50: 'D3#',
						51: 'F3#',
						52: 'G3#',
						53: 'A4#',
						54: 'C4#',
						55: 'D4#',
						56: 'F4#',
						57: 'G4#',
						48: 'A5#',
					},

					general: {

						49: 'C1#',
						50: 'D1#',
						51: 'F1#',
						52: 'G1#',
						53: 'A2#',
						54: 'C2#',
						55: 'D2#',
						56: 'F2#',
						57: 'G2#',
						48: 'A2#',

						81: 'A2',
						87: 'B2',
						69: 'C2',
						82: 'D2',
						84: 'E2',
						89: 'F2',
						85: 'G2',

						65: 'A3',
						83: 'B3',
						68: 'C3',
						70: 'D3',
						71: 'E3',
						72: 'F3',
						74: 'G3',

						90: 'A4',
						88: 'B4',
						67: 'C4',
						86: 'D4',
						66: 'E4',
						78: 'F4',
						77: 'G4',
					}
				};

				$scope.getKeyByValud = function (o, v) {
					for (var prop in o) {
						if (o.hasOwnProperty(prop)) {
							if (o[prop] === v)
								return prop;
						}
					}
				};

				$scope.getKey = function (k) {
					var source = $scope.getKeyByValud($scope.keys.general, k);
					var result = String.fromCharCode(source);
					console.error(typeof result);
					if ((!result || result == undefined || result == "" || result.length == 0 || source == undefined))
					{
						result = String.fromCharCode($scope.getKeyByValud($scope.keys.shift, k))
					}

					return result;
				};

				$scope.init = function () {
					
				};

				//$scope.init();

			}])
		}
	};

	pianoDirective.$inject = injectParams;

	app.directive('piano', pianoDirective);

});