require.config({
	baseUrl: 'app',
	urlArgs: 'v=1.0'
});

require(
    [
        'app',
        //'hookahCRMapp/directives/loadingDirective',
        //'hookahCRMapp/directives/autoActiveMenuDirective',
        //'hookahCRMapp/directives/semantic-ui/modalDirective',
        //'hookahCRMapp/directives/semantic-ui/accordionDirective',
		'musicEducationApp/directives/pianoDirective',
        'musicEducationApp/services/routeResolver',
        'musicEducationApp/services/authService',
		'musicEducationApp/services/testService',
		'musicEducationApp/services/pianoPlayerService',
        'musicEducationApp/services/studentService',
        //'hookahCRMapp/services/usersService',
        //'hookahCRMapp/services/tobaccoService',
        //'hookahCRMapp/services/salesService',
        //'hookahCRMapp/services/branchService',
        //'hookahCRMapp/services/storageService',
        //'hookahCRMapp/services/expendableService',
        //'hookahCRMapp/services/additionService',
        //'hookahCRMapp/services/rolesService',
        'musicEducationApp/controllers/navbarController',
        //'hookahCRMapp/controllers/reportBlankController'
    ],
    function () {
    	angular.bootstrap(document, ['musicEducationApp']);
    });
