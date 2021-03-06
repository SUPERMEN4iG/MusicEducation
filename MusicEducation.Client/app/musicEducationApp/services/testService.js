﻿'use strict';

define(['app'], function (app) {

	var injectParams = ['$http', '$rootScope', 'baseApiUrl', '$filter', '$q'];

	var testService = function ($http, $rootScope, baseApiUrl, $filter, $q) {
		var service = {},
            serviceBase = baseApiUrl + 'test/',
            list = [],
            listReportBlank = [];

		service.getReportBlank = function (branchId, isClosed) {
			var deferred = $q.defer();

			//if (listReportBlank.length == 0) {
			//    $http.get(serviceBase + 'ReportBlank/', { params: { branchId: branchId, isClosed: isClosed } }).then(
			//            function (response) {
			//                deferred.resolve(response.data);
			//                listReportBlank.push(response.data);
			//            },
			//            function (response) {
			//                deferred.reject(response.data);
			//            });
			//}
			//else {
			//    angular.forEach(listReportBlank, function (val) {
			//        deferred.resolve(val);
			//    });
			//}

			$http.get(serviceBase + 'ReportBlank/', { params: { branchId: branchId, isClosed: isClosed } }).then(
                        function (response) {
                        	deferred.resolve(response.data);
                        	listReportBlank.push(response.data);
                        },
                        function (response) {
                        	deferred.reject(response.data);
                        });

			return deferred.promise;
		};

		service.putReportBlank = function (obj, branchId, isClose) {
			//$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
			return $http({
				method: 'PUT',
				url: serviceBase + 'ReportBlank/',
				data: { 'branchId': branchId, 'model': obj, 'isClose': isClose }
			}).then(
                function (response) {
                	return response;
                });
		};

		service.getAvalibleTests = function () {
		    var deferred = $q.defer();

		    $http.get(serviceBase + 'GetAvalibleTests/')
                .then(
					function (response) {
					    deferred.resolve(response.data);
					},
					function (response) {
					    deferred.reject(response.data);
					});

		    return deferred.promise;
		};

		service.getAvalibleTasks = function () {
			var deferred = $q.defer();

			$http.get(serviceBase + 'GetAvalibleTasks/')
                .then(
					function (response) {
						deferred.resolve(response.data);
					},
					function (response) {
						deferred.reject(response.data);
					});

			return deferred.promise;
		};

		service.getCountAppendingTest = function (id) {
		    var deferred = $q.defer();

		    $http.get(serviceBase + 'GetCountAppendingTest/', { params: { id: id } })
					.then(
						function (response) {
						    deferred.resolve(response.data);
						},
						function (response) {
						    deferred.reject(response.data);
						});

		    return deferred.promise;
		};

		service.getTests = function (id) {
			var deferred = $q.defer();

			$http.get(serviceBase + 'GetTests/', { params: { idUser: id } })
					.then(
						function (response) {
							deferred.resolve(response.data);
						},
						function (response) {
							deferred.reject(response.data);
						});

			return deferred.promise;
		};

		service.getTasks = function (id) {
			var deferred = $q.defer();

			$http.get(serviceBase + 'GetTasks/', { params: { idUser: id } })
					.then(
						function (response) {
							deferred.resolve(response.data);
						},
						function (response) {
							deferred.reject(response.data);
						});

			return deferred.promise;
		};

		service.getTest = function (id) {
			var deferred = $q.defer();

			$http.get(serviceBase + 'GetTest/', { params: { idTest: id } })
                    .then(
				        function (response) {
				        	deferred.resolve(response.data);
				        	//list.push(response.data);
				        },
                        function (response) {
                        	deferred.reject(response.data);
                        });

			return deferred.promise;
		};

		service.getTheme = function (id) {
			var deferred = $q.defer();

			$http.get(serviceBase + 'GetTheme/', { params: { idTheme: id } })
                    .then(
				        function (response) {
				        	deferred.resolve(response.data);
				        	//list.push(response.data);
				        },
                        function (response) {
                        	deferred.reject(response.data);
                        });

			return deferred.promise;
		};

		service.getThemes = function (id) {
			var deferred = $q.defer();

			$http.get(serviceBase + 'GetThemes/')
					.then(
						function (response) {
							deferred.resolve(response.data);
						},
						function (response) {
							deferred.reject(response.data);
						});

			return deferred.promise;
		};

		service.getThemeQuestions = function (idTheme) {
			var deferred = $q.defer();

			$http.get(serviceBase + 'GetThemeQuestions/', { params: { idTheme: idTheme } })
                    .then(
				        function (response) {
				        	deferred.resolve(response.data);
				        	//list.push(response.data);
				        },
                        function (response) {
                        	deferred.reject(response.data);
                        });

			return deferred.promise;
		};

		service.createTest = function (test) {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: serviceBase + 'CreateTest/',
				data: test
			}).then(
				function (response) {
					deferred.resolve(response.data);
				},
				function (response) {
					deferred.reject(response.data);
				});
			return deferred.promise;
		};

		service.insertTestWithContent = function (test) {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: serviceBase + 'InsertTestWithContent/',
				data: test
			}).then(
				function (response) {
					deferred.resolve(response.data);
				},
				function (response) {
					deferred.reject(response.data);
				});
			return deferred.promise;
		};

		service.updateTest = function (test) {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: serviceBase + 'UpdateTest/',
				data: test
			}).then(
				function (response) {
					deferred.resolve(response.data);
				},
				function (response) {
					deferred.reject(response.data);
				});
			return deferred.promise;
		};

		service.updateTheme = function (theme) {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: serviceBase + 'UpdateTheme/',
				data: theme
			}).then(
				function (response) {
					deferred.resolve(response.data);
				},
				function (response) {
					deferred.reject(response.data);
				});
			return deferred.promise;
		};

		service.insertTestResult = function (test) {
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: serviceBase + 'InsertTestResult/',
				data: test 
			}).then(
				function (response) {
					deferred.resolve(response.data);
				},
				function (response) {
					deferred.reject(response.data);
				});
			return deferred.promise;
		};

		service.insertTaskResult = function (test) {
		    var deferred = $q.defer();
		    $http({
		        method: 'POST',
		        url: serviceBase + 'InsertTaskResult/',
		        data: test
		    }).then(
				function (response) {
				    deferred.resolve(response.data);
				},
				function (response) {
				    deferred.reject(response.data);
				});
		    return deferred.promise;
		};

		// Получаем массив состояний складов
		// IsClosed:
		// 0 - Склад открыт
		// 1 - Склад закрыт
		service.getCurrentStorage = function (branchId) {
			var deferred = $q.defer();

			//if (list.length == 0) {
			//    $http.get(serviceBase + 'Current/', { params: { branchId: branchId } })
			//        .then(
			//	        function (response) {
			//	            deferred.resolve(response.data);
			//	            list.push(response.data);
			//	        },
			//            function (response) {
			//                deferred.reject(response.data);
			//            });
			//}
			//else {
			//    angular.forEach(list, function (val) {
			//        deferred.resolve(val);
			//    });
			//}

			$http.get(serviceBase + 'Current/', { params: { branchId: branchId } })
                    .then(
				        function (response) {
				        	deferred.resolve(response.data);
				        	list.push(response.data);
				        },
                        function (response) {
                        	deferred.reject(response.data);
                        });

			return deferred.promise;
		};

		service.getActiveBranchByName = function (name) {
			if (currentBranch == null)
				return;

			return $filter('filter')(list, { Name: name })[0];
		};

		service.clear = function () {
			list.splice(0, list.length);
			listReportBlank.splice(0, listReportBlank.length);
		};

		service.appendTestToGroup = function (idGroup, idTest, attempts, timing, complexity) {

			var obj = { idGroup: idGroup, idTest: idTest, attempts: attempts, timing: timing, complexity: complexity };
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: serviceBase + 'AppendTestToGroup/',
				data: obj
			}).then(
				function (response) {
					deferred.resolve(response.data);
				},
				function (response) {
					deferred.reject(response.data);
				});
			return deferred.promise;
		};

		service.appendTestToUser = function (idUser, idTest, attempts, timing, complexity) {

			var obj = { idUser: idUser, idTest: idTest, attempts: attempts, timing: timing, complexity: complexity };
			var deferred = $q.defer();
			$http({
				method: 'POST',
				url: serviceBase + 'AppendTestToUser/',
				data: obj
			}).then(
				function (response) {
					deferred.resolve(response.data);
				},
				function (response) {
					deferred.reject(response.data);
				});
			return deferred.promise;
		};

		service.appendTaskToGroup = function (idGroup, idTest, attempts, timing, complexity, user_TestType, isShowHints) {

			var obj = { idGroup: idGroup, idTest: idTest, attempts: attempts, timing: timing, complexity: complexity, userTestType: user_TestType, isShowHints: isShowHints };
			var deferred = $q.defer();
			console.log(obj);
			$http({
				method: 'POST',
				url: serviceBase + 'AppendTaskToGroup/',
				data: obj
			}).then(
				function (response) {
					deferred.resolve(response.data);
				},
				function (response) {
					deferred.reject(response.data);
				});
			return deferred.promise;
		};

		service.appendTaskToUser = function (idUser, idTest, attempts, timing, complexity, user_TestType, isShowHints) {

			var obj = { idUser: idUser, idTest: idTest, attempts: attempts, timing: timing, complexity: complexity, userTestType: user_TestType, isShowHints: isShowHints };
			var deferred = $q.defer();
			console.log(obj);
			$http({
				method: 'POST',
				url: serviceBase + 'AppendTaskToUser/',
				data: obj
			}).then(
				function (response) {
					deferred.resolve(response.data);
				},
				function (response) {
					deferred.reject(response.data);
				});
			return deferred.promise;
		};

		service.updateUserTestTiming = function (idUser, idTest, timing, isAttemptDown) {
			var deferred = $q.defer();

			var obj = { idUser: idUser, idTest: idTest, timing: timing, isAttemptDown: isAttemptDown };

			$http({
				method: 'POST',
				url: serviceBase + 'UpdateUserTestTiming/',
				data: obj
			}).then(
				function (response) {
					deferred.resolve(response.data);
				},
				function (response) {
					deferred.reject(response.data);
				});
			return deferred.promise;
		};

		service.deleteTest = function (idTest) {
		    var deferred = $q.defer();

		    $http.delete(serviceBase + 'DeleteTest/', { params: { id: idTest } })
                .then(
					function (response) {
					    deferred.resolve(response.data);
					},
					function (response) {
					    deferred.reject(response.data);
					});

		    return deferred.promise;
		};

		service.getConsumptionReport = function (branchId) {
			window.open(serviceBase + 'GetReportBlank/?branchId=' + branchId + '&val=false', '_blank', '');

			//console.error(branchId);
			//$http({
			//    url: serviceBase + 'GetReportBlank/?branchId=' + branchId + '&val=false',
			//    method: "GET",
			//    responseType: 'arraybuffer'
			//}).success(function (data, status, headers, config) {
			//    var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
			//    var objectUrl = URL.createObjectURL(blob);
			//    window.open(objectUrl);
			//}).error(function (data, status, headers, config) {
			//    //upload failed
			//});
		};

		return service;
	};

	testService.$inject = injectParams;

	app.factory('testService', testService);

});
