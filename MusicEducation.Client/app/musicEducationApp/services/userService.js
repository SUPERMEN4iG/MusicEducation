'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope', 'baseApiUrl', '$filter', '$q'];

    var userService = function ($http, $rootScope, baseApiUrl, $filter, $q) {
    	var service = {},
            serviceBase = baseApiUrl + 'user/';

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

        service.insertUser = function (obj) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: serviceBase + 'InsertUser/',
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

        service.getUsers = function () {
            var deferred = $q.defer();

            $http.get(serviceBase + 'GetUsers/')
                .then(
					function (response) {
					    deferred.resolve(response.data);
					},
					function (response) {
					    deferred.reject(response.data);
					});

            return deferred.promise;
        };

        service.getRoles = function () {
        	var deferred = $q.defer();

        	$http.get(serviceBase + 'GetRoles/')
                .then(
					function (response) {
						deferred.resolve(response.data);
					},
					function (response) {
						deferred.reject(response.data);
					});

        	return deferred.promise;
        };

        service.getStudent = function (id) {
            var deferred = $q.defer();

            $http.get(serviceBase + 'GetStudent/', { params: { id: id } })
                .then(
					function (response) {
					    deferred.resolve(response.data);
					},
					function (response) {
					    deferred.reject(response.data);
					});

            return deferred.promise;
        };

        service.getTests = function () {
            var deferred = $q.defer();

            if (list.length == 0) {
                $http.get(serviceBase + 'GetTests/')
					.then(
						function (response) {
						    deferred.resolve(response.data);
						    list.push(response.data);
						},
						function (response) {
						    deferred.reject(response.data);
						});
            } else {
                angular.forEach(list, function (val) {
                    deferred.resolve(val);
                });
            }

            return deferred.promise;
        };

        service.appnedTestToUser = function (idUser, idTest) {
        	var obj = { idUser: idUser, idTest: idTest };
        	var deferred = $q.defer();
        	$http({
        		method: 'POST',
        		url: serviceBase + 'AppnedTestToUser/',
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

        service.appnedTestToUserWithContent = function (obj) {
        	var deferred = $q.defer();
        	$http({
        		method: 'POST',
        		url: serviceBase + 'AppnedTestToUserWithContent/',
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

    userService.$inject = injectParams;

    app.factory('userService', userService);

});
