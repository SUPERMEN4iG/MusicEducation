﻿require.config({
	baseUrl: 'app',
	urlArgs: 'v=1.0'
});

require(
    [
        'app',
        //'MusicEducation.Coreapp/directives/loadingDirective',
        //'MusicEducation.Coreapp/directives/autoActiveMenuDirective',
        //'MusicEducation.Coreapp/directives/semantic-ui/modalDirective',
        //'MusicEducation.Coreapp/directives/semantic-ui/accordionDirective',
		'musicEducationApp/directives/pianoDirective',
        'musicEducationApp/services/routeResolver',
        'musicEducationApp/services/authService',
		'musicEducationApp/services/testService',
		'musicEducationApp/services/pianoPlayerService',
        'musicEducationApp/services/studentService',
        //'MusicEducation.Coreapp/services/usersService',
        //'MusicEducation.Coreapp/services/tobaccoService',
        //'MusicEducation.Coreapp/services/salesService',
        //'MusicEducation.Coreapp/services/branchService',
        //'MusicEducation.Coreapp/services/storageService',
        //'MusicEducation.Coreapp/services/expendableService',
        //'MusicEducation.Coreapp/services/additionService',
        //'MusicEducation.Coreapp/services/rolesService',
        'musicEducationApp/controllers/navbarController',
        //'MusicEducation.Coreapp/controllers/reportBlankController'
    ],
    function () {
    	angular.bootstrap(document, ['musicEducationApp']);
    });