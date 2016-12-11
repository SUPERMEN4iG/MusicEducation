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
		function generateChartData() {
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

		generateChartData();

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
		}
	};

	MainController.$inject = injectParams;

	app.register.controller('MainController', MainController);

});