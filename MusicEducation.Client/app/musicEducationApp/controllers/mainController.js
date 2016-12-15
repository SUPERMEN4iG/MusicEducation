'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$routeParams', '$rootScope', '$route', '$scope', 'userService'];

    var MainController = function ($location, $routeParams, $rootScope, $route, $scope, userService) {
		var vm = this,
            path = '/';

		$rootScope.pageName = 'Main';
		vm.controllerName = 'Главная';
		vm.headerName = 'Музычкалка';

		vm.pushNewData = function () {

		    vm.dataGraph1.push({
		        year: 'Январь',
		        income: 70
		    });

		    vm.dataGraph1.push({
		        year: 'Февраль',
		        income: 65
		    });

		    vm.dataGraph1.push({
		        year: 'Март',
		        income: 72
		    });

		    //vm.chart.dataProvider.push({
		    //    year: 2010,
		    //    income: 35.2,
		    //    expenses: 18.8
		    //});
		    vm.chart.validateData();
		    console.log(vm.chart.dataProvider);
		};
		var day = 0;
		var firstDate = new Date();
		firstDate.setDate(firstDate.getDate() - 500);
		function generateChartDataForAdmin() {
		    userService.getGraphVisits().then(function (data) {	        

		        angular.forEach(data, function (v) {
		            vm.dataGraph1.push({
		                "date": new Date(v.date),
		                "visits": v.visits
		            });
		        });
		        console.log(vm.dataGraph1);
		        vm.chart.validateData();
		    });

		    //for (day = 0; day < 50; day++) {
		    //    var newDate = new Date(firstDate);
		    //    newDate.setDate(newDate.getDate() + day);

		    //    var visits = Math.round(Math.random() * 40) - 0;

		    //    chartData.push({
		    //        "date": newDate,
		    //        "visits": visits
		    //    });
		    //}

		    //console.log(chartData);
		}

		function generateChartData() {
		    var chartData = [];
		    var firstDate = new Date();
		    firstDate.setDate(firstDate.getDate() - 100);

		    for (var i = 0; i < 100; i++) {
		        // we create date objects here. In your data, you can have date strings
		        // and then set format of your dates using chart.dataDateFormat property,
		        // however when possible, use date objects, as this will speed up chart rendering.
		        var newDate = new Date(firstDate);
		        newDate.setDate(newDate.getDate() + i);

		        var visits = Math.round(Math.sin(i * 5) * i);
		        var hits = Math.round(Math.random() * 80) + 500 + i * 3;
		        var views = Math.round(Math.random() * 6000) + i * 4;

		        chartData.push({
		            date: newDate,
		            visits: visits,
		            hits: hits,
		            views: views
		        });
		    }
		    console.log(chartData);
		    return chartData;
		}

		function generateChartDataForTeacher() {

		    vm.amChartOptions = {
		        type: "serial",
		        language: "ru",
		        theme: "light",
		        zoomOutButton: {
		            backgroundColor: '#000000',
		            backgroundAlpha: 0.15
		        },
		        legend: {
		            "useGraphSettings": true
		        },
		        dateFormats: 'DD:JJ:NN:SS',
		        data: vm.dataGraph1,
		        categoryField: "date",
		        categoryAxis: {
		            "parseDates": true,
		            "axisColor": "#DADADA",
		            "minorGridEnabled": true
		        },
		        allLabels: [{
		            color: '#FFFFFF'
		        }],
		        valueAxes: [{
		            "id": "v1",
		            "axisColor": "#FF6600",
		            "axisThickness": 2,
		            "axisAlpha": 1,
		            "position": "left"
		        }, {
		            "id": "v2",
		            "axisColor": "#FCD202",
		            "axisThickness": 2,
		            "axisAlpha": 1,
		            "position": "right"
		        }, {
		            "id": "v3",
		            "axisColor": "#B0DE09",
		            "axisThickness": 2,
		            "gridAlpha": 0,
		            "offset": 50,
		            "axisAlpha": 1,
		            "position": "left"
		        },
		        {
		            "id": "v4",
		            "axisColor": "#09a8de",
		            "axisThickness": 2,
		            "gridAlpha": 0,
		            "axisAlpha": 1,
		            "position": "right"
		        }],
		        graphs: [{
		            "valueAxis": "v1",
		            "lineColor": "#FF6600",
		            "bullet": "round",
		            "bulletBorderThickness": 1,
		            "hideBulletsCount": 30,
		            "title": "назначенные тесты",
		            "valueField": "allCountTest",
		            "fillAlphas": 0
		        }, {
		            "valueAxis": "v2",
		            "lineColor": "#FCD202",
		            "bullet": "square",
		            "bulletBorderThickness": 1,
		            "hideBulletsCount": 30,
		            "title": "выполненные тесты",
		            "valueField": "allCountCompletedTest",
		            "fillAlphas": 0
		        }, {
		            "valueAxis": "v3",
		            "lineColor": "#B0DE09",
		            "bullet": "triangleUp",
		            "bulletBorderThickness": 1,
		            "hideBulletsCount": 30,
		            "title": "назначенные задания",
		            "valueField": "allCountTask",
		            "fillAlphas": 0
		        }, {
		            "valueAxis": "v4",
		            "lineColor": "#09a8de",
		            "bullet": "triangleUp",
		            "bulletBorderThickness": 1,
		            "hideBulletsCount": 30,
		            "title": "выполненные задания",
		            "valueField": "allCountCompletedTask",
		            "fillAlphas": 0
		        }],
		        chartCursor: {
		            cursorPosition: "mouse"
		        },
		        chartScrollbar: {
		            graph: "g1",
		            scrollbarHeight: 40,
		            color: "#FFFFFF",
		            autoGridCount: true
		        }
		    };

		    userService.getGraphTeacher().then(function (data) {

		        angular.forEach(data, function (v) {
		            vm.dataGraph1.push({
		                "date": new Date(v.date),
		                "allCountTest": v.visits,
		                "allCountTask": v.allCountTask,
		                "allCountCompletedTest": v.allCountCompletedTest,
		                "allCountCompletedTask": v.allCountCompletedTask,
		            });
		        });
		        console.log(vm.dataGraph1);
		        vm.chart.validateData();
		    });

		    //for (day = 0; day < 50; day++) {
		    //    var newDate = new Date(firstDate);
		    //    newDate.setDate(newDate.getDate() + day);

		    //    var visits = Math.round(Math.random() * 40) - 0;

		    //    chartData.push({
		    //        "date": newDate,
		    //        "visits": visits
		    //    });
		    //}

		    //console.log(chartData);
		}

		function generateChartDataForStudent() {
		    userService.getGraphStudent().then(function (data) {

		        angular.forEach(data, function (v) {
		            vm.dataGraph1.push({
		                "date": new Date(v.date),
		                "visits": v.visits
		            });
		        });
		        console.log(vm.dataGraph1);
		        vm.chart.validateData();
		    });

		    //for (day = 0; day < 50; day++) {
		    //    var newDate = new Date(firstDate);
		    //    newDate.setDate(newDate.getDate() + day);

		    //    var visits = Math.round(Math.random() * 40) - 0;

		    //    chartData.push({
		    //        "date": newDate,
		    //        "visits": visits
		    //    });
		    //}

		    //console.log(chartData);
		}

		vm.chart = {};
		vm.dataGraph1 = [];

		$scope.$watch('vm.chart', function () {
		    console.info(vm.chart);
		});

		//setInterval(function () {
		//    // normally you would load new datapoints here,
		//    // but we will just generate some random values
		//    // and remove the value from the beginning so that
		//    // we get nice sliding graph feeling

		//    // remove datapoint from the beginning
		//    vm.chart.dataProvider.shift();

		//    // add new one at the end
		//    day++;
		//    var newDate = new Date(firstDate);
		//    newDate.setDate(newDate.getDate() + day);
		//    var visits = Math.round(Math.random() * 40) - 20;
		//    vm.chart.dataProvider.push({
		//        date: newDate,
		//        visits: visits
		//    });
		//    vm.chart.validateData();
		//}, 1000);

		vm.amChartOptions = {
		    type: "serial",
		    language: "ru",
		    theme: "dark",
		    zoomOutButton: {
		        backgroundColor: '#000000',
		        backgroundAlpha: 0.15
		    },
		    dateFormats: 'DD:JJ:NN:SS',
		    data: vm.dataGraph1,
		    categoryField: "date",
		    categoryAxis: {
		        parseDates: true,
		        minPeriod: "DD",
		        dashLength: 1,
		        gridAlpha: 0.15,
		        axisColor: "#555555"
		    },
		    allLabels: [{
		        color: '#FFFFFF'
		    }],
		    graphs: [{
		        id: "g1",
		        valueField: "visits",
		        bullet: "round",
		        bulletBorderColor: "#FFFFFF",
		        bulletBorderThickness: 2,
		        lineThickness: 2,
		        lineColor: "#569edd",
		        balloonColor: "#0352b5",
		        negativeLineColor: "#0352b5",
		        hideBulletsCount: 50
		    }],
		    chartCursor: {
		        cursorPosition: "mouse"
		    },
		    chartScrollbar: {
		        graph: "g1",
		        scrollbarHeight: 40,
		        color: "#FFFFFF",
		        autoGridCount: true
		    }
		};

		function init() {
		    if ($rootScope.globals.currentUser.source.RoleName == 'Администратор') {
		        generateChartDataForAdmin();
		    } else if ($rootScope.globals.currentUser.source.RoleName == 'Учитель') {
		        generateChartDataForTeacher();
		    } else if ($rootScope.globals.currentUser.source.RoleName == 'Ученик') {
		        generateChartDataForStudent();
		    }
		};

		if ($rootScope.globals.currentUser.source === undefined) {
		    $rootScope.$on('ON_FINISH_LOADING', function (event, data) {
		        init();
		    });
		} else {
		    init();
		}
	};

	MainController.$inject = injectParams;

	app.register.controller('MainController', MainController);

});