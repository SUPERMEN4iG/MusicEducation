'use strict';

define(['app'], function (app) {

    var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'studentService'];

    var StudentController = function ($location, $routeParams, $rootScope, $route, studentService) {
        var vm = this,
            path = '/student/',
            id = ($routeParams.id) ? $routeParams.id : '';

        vm.id = id;

        vm.studentList = [];
        vm.student = {};

        $rootScope.pageName = 'Студенты';

        vm.goToStudent = function (id) {
            $location.path(path + id);
        };

        function init() {
            if (id == '') {
                studentService.getStudents().then(
                    function (data) {
                        vm.studentList = data;
                        console.log(data);
                    });
            } else {
                studentService.getStudent(id).then(
                    function (data) {
                        vm.student = data;
                        console.log(data);
                    });
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

    StudentController.$inject = injectParams;

    app.register.controller('StudentController', StudentController);

});