'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope', 'baseApiUrl', '$filter', '$q'];

    var reportService = function ($http, $rootScope, baseApiUrl, $filter, $q) {
    	var service = {},
            serviceBase = baseApiUrl + 'report/';

    	service.getReportPerformance = function (datefrom, dateto) {

    	    window.open(serviceBase + 'GetReportPerformance/?datefrom=' + datefrom + '&dateto=' + dateto, '_blank', '');

        };

        return service;
    };

    reportService.$inject = injectParams;

    app.factory('reportService', reportService);

});
