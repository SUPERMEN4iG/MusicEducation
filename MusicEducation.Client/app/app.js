'use strict';

define(['musicEducationApp/services/routeResolver'], function () {

	var app = angular.module('musicEducationApp', [
        'ngRoute',
        'ngAnimate',
        'ngCookies',
        'routeResolverServices',
        'ui.bootstrap',
        //'angularify.semantic.modal',
        'angularify.semantic.dropdown',
		'angularify.semantic.checkbox',
		'xeditable',
        //'chart.js',
        'toastr'
	]);

	app.constant('baseApiUrl', 'http://localhost:59744/api/');
	app.constant('DebugConfig', {
		isDebug: true,
		version: '1.0'
	});

	app.provider('DevelopConstants', function () {
		// default values
		var values = {
			isDebug: true,
			version: '1.0'
		};
		return {
			$get: function () {
				return values;
			}
		};
	});

	app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider',

        function ($routeProvider, routeResolverProvider, $controllerProvider,
                  $compileProvider, $filterProvider, $provide, $httpProvider) {

        	//Change default views and controllers directory using the following:
        	//routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers');

        	app.register =
            {
            	controller: $controllerProvider.register,
            	directive: $compileProvider.directive,
            	filter: $filterProvider.register,
            	factory: $provide.factory,
            	service: $provide.service
            };

        	var route = routeResolverProvider.route;

        	$routeProvider
				.when('/main', route.resolve('Main', '', 'vm'))
				.when('/piano', route.resolve('Piano', '', 'vm'))
				.when('/constructor', route.resolve('Constructor', '', 'vm'))
				.when('/profile', route.resolve('Profile', '', 'vm'))
				.when('/message/:id*?', route.resolve('Message', '', 'vm', true))
				.when('/bankTest/:id*?/:idquestion*?', route.resolve('BankTest', '', 'vm', true))
				.when('/group/:id*?', route.resolve('Group', '', 'vm', true))
				.when('/test/:id*?', route.resolve('Test', '', 'vm', true))
				.when('/task/:id*?', route.resolve('Task', '', 'vm', true))
				.when('/user/:id*?', route.resolve('User', '', 'vm', true))
                .when('/student/:id*?', route.resolve('Student', '', 'vm', true))
				.when('/login/:redirect*?', route.resolve('Login', '', 'vm'))
				.otherwise({ redirectTo: '/main' });
            //    //.when('/users', route.resolve('Users', '', 'vm'))
            //    //.when('/login/:redirect*?', route.resolve('Login', '', 'vm'))
            //    //.when('/tobacco', route.resolve('Tobacco', '', 'vm'))
            //    //.when('/storage', route.resolve('Storage', '', 'vm'))
            //    //.when('/main', route.resolve('Main', '', 'vm'))
            //    //.when('/sales/:salesType*?/:advancedParam*?', route.resolve('Sales', '', 'vm', true))
				

        	//$routeProvider
        	//    //route.resolve() now accepts the convention to use (name of controller & view) as well as the 
        	//    //path where the controller or view lives in the controllers or views folder if it's in a sub folder. 
        	//    //For example, the controllers for customers live in controllers/customers and the views are in views/customers.
        	//    //The controllers for orders live in controllers/orders and the views are in views/orders
        	//    //The second parameter allows for putting related controllers/views into subfolders to better organize large projects
        	//    //Thanks to Ton Yeung for the idea and contribution
        	//    .when('/customers', route.resolve('Customers', 'customers/', 'vm'))
        	//    .when('/customerorders/:customerId', route.resolve('CustomerOrders', 'customers/', 'vm'))
        	//    .when('/customeredit/:customerId', route.resolve('CustomerEdit', 'customers/', 'vm', true))
        	//    .when('/orders', route.resolve('Orders', 'orders/', 'vm'))
        	//    .when('/about', route.resolve('About', '', 'vm'))
        	//    .when('/login/:redirect*?', route.resolve('Login', '', 'vm'))
        	//    .otherwise({ redirectTo: '/customers' });

        }]);

	//app.run(['$rootScope', '$location', 'authService',
	//    function ($rootScope, $location, authService) {

	//        //Client-side security. Server-side framework MUST add it's 
	//        //own security as well since client-based security is easily hacked
	//        $rootScope.$on("$routeChangeStart", function (event, next, current) {
	//            if (next && next.$$route && next.$$route.secure) {
	//                if (!authService.user.isAuthenticated) {
	//                    $rootScope.$evalAsync(function () {
	//                        authService.redirectToLogin();
	//                    });
	//                }
	//            }
	//        });

	//    }]);

	app.run(['$rootScope', '$location', '$cookieStore', '$http', 'DevelopConstants', 'editableOptions', 'editableThemes',
        function ($rootScope, $location, $cookieStore, $http, DevelopConstants, editableOptions, editableThemes) {

        	$rootScope.developConstants = DevelopConstants;

        	$rootScope.globals = $cookieStore.get('globals') || {};

        	if ($rootScope.globals.currentUser) {
        		$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        	}

        	$rootScope.debugTest = function (message) { console.log(message); };

        	$rootScope.$on('$locationChangeStart', function (event, next, current) {
        		// redirect to login page if not logged in
        		console.log($rootScope.globals.currentUser);
        		//if ($rootScope.globals.currentUser !== undefined && $rootScope.globals.currentUser.currentUser !== undefined)
        		//{
        		//    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        		//    console.log($http.defaults.headers);
        		//}
        		if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
        			$location.path('/login');
        		}
        		else {
        		}
        	});

        	
        	console.log(editableThemes['default']);
        	editableThemes['default'].submitTpl = '<button type="submit" class="circular ui mini icon green button" style="position: absolute;margin-left: 3px;"><i class="icon checkmark"></i></button>';
        	editableThemes['default'].cancelTpl = '<button type="button" class="circular ui mini icon red button" style="position: absolute;margin-left: 32px;" ng-click="$form.$cancel()"><i class="icon remove"></i></button>';
        	editableThemes['default'].inputTpl = '<div class="ui input"><input type="text" ng-model="$parent.$data" style=""></div>';
        	editableOptions.theme = 'default';
        	//delete $httpProvider.defaults.headers.common['X-Requested-With'];
        	//$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';

        	//Client-side security. Server-side framework MUST add it's 
        	//own security as well since client-based security is easily hacke

        }]);

	return app;

});