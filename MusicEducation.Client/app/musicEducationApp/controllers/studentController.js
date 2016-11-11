'use strict';

define(['app'], function (app) {

	var injectParams = ['$location', '$routeParams', '$rootScope', '$route', 'studentService', 'testService', 'toastr', 'pianoPlayerService', '$scope', '$window', '$filter'];

	var StudentController = function ($location, $routeParams, $rootScope, $route, studentService, testService, toastr, pianoPlayerService, $scope, $window, $filter) {
        var vm = this,
            path = '/student/',
            id = ($routeParams.id) ? $routeParams.id : '';

        vm.id = id;

        vm.testTypeDictionary = [
			{ Id: 1, Name: 'Обучающиее задание' },
			{ Id: 2, Name: 'Контрольное задание' }
        ];

        vm.isShowHintsDictionary = [
			{ Id: 1, Name: 'Показывать' },
			{ Id: 0, Name: 'Не показывать' }
        ];

        vm.studentList = [];
        vm.student = {};

        vm.taskId;
        vm.currentTest = {};
        vm.newTask = {
        	idUser: $rootScope.globals.currentUser.source.Id,
        	idUser_test: id,
        	question_name: '',
        	question_octaves: [],
        	question_content: [],
        	test_name: '',
        	test_complexity: 1
        };

        vm.pianoSettings = {
        	isShowHints: false
        };

        vm.isListening = false;
        vm.isRecording = false;
        vm.taskState = 1;

        vm.setRecording = function (rec) {
        	if (rec) {
        		vm.newTask.question_content = [];
        		pianoPlayerService.clearTimeline();
        	}

        	vm.isRecording = rec;
        };

        $scope.$watch('vm.newTask.question_octaves', function () {
        	$rootScope.$emit('ON_PIANO_INIT', {
        		octaves: vm.newTask.question_octaves,
        		isshowhint: vm.pianoSettings.isShowHints
        	});
        });

        $scope.$watch('vm.currentTest.Questions[0].Content.octaves', function () {
        	if (vm.currentTest != null)
        	{
        		console.log('ON_PIANO_INIT');
        		$rootScope.$emit('ON_PIANO_INIT', {
        			octaves: vm.currentTest.Questions[0].Content.octaves,
        			isshowhint: vm.pianoSettings.isShowHints
        		});
        	}
        });

        vm.isShowModalPiano = false;

        $rootScope.pageName = 'Ученики';

        vm.setTaskState = function (state) {
        	vm.taskState = state;
        	$rootScope.$emit('ON_PIANO_INIT', {
        		octaves: vm.newTask.question_octaves,
        		isshowhint: vm.pianoSettings.isShowHints
        	});
        };

        vm.goToStudent = function (id) {
            $location.path(path + id);
        };

        var findInDictionaryByName = function (obj, key) {
        	var found = $filter('filter')(obj, { Name: key }, true);
        	return found[0];
        }

        vm.appnedTestToUser = function (test) {
        	studentService.appnedTestToUser(id, test.Id)
				.then(
					function (data) {
						if (data.Status == 1) {
							toastr.success("Тест отправлен!");
							init();
						} else {
							toastr.error("Тест не отправлен!");
						}
					}
				);
        };

        vm.appnedTestToUserWithContent = function (test) {

        	test.idUser_TestType = findInDictionaryByName(vm.testTypeDictionary, test.idUser_TestType).Id;
        	test.isShowHints = findInDictionaryByName(vm.isShowHintsDictionary, test.isShowHints).Id;

        	var sendedTest = {
        		idUser: vm.newTask.idUser_test,
        		idTest: test.Id,
        		idUserTestType: test.idUser_TestType,
        		countAttempts: test.countAttempts,
        		isShowHints: test.isShowHints
        	};
        	
        	studentService.appnedTestToUserWithContent(sendedTest)
				.then(
					function (data) {
						if (data.Status == 1) {
							toastr.success("Тест отправлен!");
							init();
						} else {
							toastr.error("Тест не отправлен!");
						}
					}
				);
        };

        vm.showModalPiano = function (idTask) {
        	$('#hideToggle').hide();
        	$('#showToggle').show();
        	$('#sideMenu').addClass('hide');
        	vm.isShowModalPiano = true;
        	vm.taskId = idTask;
        };

        vm.hideModalPiano = function () {
        	$('#showToggle').hide();
        	$('#hideToggle').show();
        	$('#sideMenu').removeClass('hide');
        	vm.isShowModalPiano = false;
        	console.log(vm.newTask);
        };

        vm.insertTestWithContent = function () {
        	testService.insertTestWithContent(vm.newTask).then(function () {
        		vm.hideModalPiano();
        		toastr.success('Успешное добавление задания');
        	});
        };

        vm.playPiano = function (notes) {
        	pianoPlayerService.clearTimeline();
        	pianoPlayerService.playNotesArray(notes);
        };

        vm.keyDownTime = {};
        vm.keyUpTime = {};
        vm.nowTime;
        vm.lastTime;
        vm.tt;
        var lastEvent;
        var heldKeys = {};

        function keyDownListener(e) {
        	console.log('keydown');
        	if (lastEvent && lastEvent.keyCode == e.keyCode) {
        		return;
        	}
        	lastEvent = e;
        	heldKeys[e.keyCode] = true;

        	if (vm.lastTime === undefined)
        		vm.lastTime = new Date();

        	vm.keyDownTime = new Date();
        	var evtobj = window.event ? event : e;
        	var keyboradLayout = evtobj.shiftKey ? keyboardTest.shift : keyboardTest.general;
        	console.log(new Date().getTime() - vm.lastTime.getTime());
        	vm.lastTime = new Date();

        	pianoPlayerService.play(keyboradLayout[e.keyCode], 0, true);

        	for (var i = 0; i < $rootScope.visualKeyboards.length; i++) {
        		if ($rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]] !== undefined) {
        			$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.backgroundColor = '#666cff';
        			$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.marginTop = '5px';
        			$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.boxShadow = 'none';
        		}
        	}
        	pianoPlayerService.clearTimeline();
        };

        function keyUpListener(e) {
        	lastEvent = null;
        	delete heldKeys[e.keyCode];

        	console.log('keyup');

        	vm.keyUpTime = new Date();
        	vm.nowTime = new Date();
        	var evtobj = window.event ? event : e;
        	var keyboradLayout = evtobj.shiftKey ? keyboardTest.shift : keyboardTest.general;
        	var timePress = ((vm.nowTime.getTime() - vm.lastTime.getTime()) / 1000);
        	if (vm.isRecording)
        		vm.newTask.question_content[vm.newTask.question_content.length] = { note: keyboradLayout[e.keyCode], duration: timePress, isMove: true };

        	for (var i = 0; i < $rootScope.visualKeyboards.length; i++) {
        		if ($rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]] !== undefined) {
        			$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.backgroundColor = '';
        			$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.marginTop = '';
        			$rootScope.visualKeyboards[i][keyboradLayout[e.keyCode]].style.boxShadow = '';
        		}
        	}
        	pianoPlayerService.clearTimeline();
        }

        $scope.$watch('vm.isShowModalPiano', function () {
        	if (vm.isShowModalPiano) {
        		pianoPlayerService.initialize(function () {
        			setTimeout(function () {
        				pianoPlayerService.setVolume(100);
        				console.log('INITIALIZE');
        				console.log($window);

        				$window.addEventListener('keydown', keyDownListener, false);
        				$window.addEventListener('keyup', keyUpListener, false);

        				pianoPlayerService.clearTimeline();

        				if (vm.taskId !== undefined && vm.taskId !== null)
        				{
        					testService.getTest(vm.taskId).then(function (data) {
        						vm.currentTest = data;
        						console.log(vm.currentTest);
        					});
        				}
        				
        			}, 100);
        		});
        	} else {
        		console.log('DEINITIALIZE');
        		pianoPlayerService.clearTimeline();
        		vm.taskId = null;
        		vm.currentTest = null;
        		$window.removeEventListener('keydown', keyDownListener, false);
        		$window.removeEventListener('keyup', keyUpListener, false);
        		init();
        	}
        });

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
                    	vm.isListening = true;
                    	vm.taskState = 1;
                    	console.info(vm.student);
                    	testService.getTests(id).then(function (data) {
                    		vm.student.testList = data;
                    	});
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