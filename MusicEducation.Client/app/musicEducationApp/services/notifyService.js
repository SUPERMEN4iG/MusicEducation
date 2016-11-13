'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope', 'baseApiUrl', '$filter', '$q'];

    var notifyService = function ($http, $rootScope, baseApiUrl, $filter, $q) {
        function backendFactory(serverUrl, hubName) {

            //jQuery.support.cors = true;
            var connection = $.hubConnection(serverUrl);
            var proxy = connection.createHubProxy(hubName);
            console.log(proxy);

            var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
            //connection.start({ jsonp: true });
            connection.start({ jsonp: isChrome, transport: ['webSockets', 'webSockets'] }).done(function () {
                console.log('hub: connected');
                proxy.invoke('OnConnected', true);
            });

            connection.connectionSlow(function () {
                console.log('hub: connectionSlow');
            });

            connection.reconnecting(function () {
                console.log('hub: reconnecting');
            });

            connection.reconnected(function () {
                console.log('hub: reconnected');
            });

            connection.disconnected(function () {
                console.log('hub: disconnected');
            });

            return {
                on: function (eventName, callback) {
                    proxy.on(eventName, function (result) {
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
                },
                invoke: function (methodName, callback) {
                    proxy.invoke(methodName)
                    .done(function (result) {
                        $rootScope.$apply(function () {
                            if (callback) {
                                callback(result);
                            }
                        });
                    });
                },
                sendNotification: function (idUserCreator, username, name, content, priorityLevel) {
                    var sendingObject = {
                        Content: content,
                        Id_UserCreator: idUserCreator,
                        Name: name,
                        PriorityLevel: priorityLevel
                    };

                    proxy.invoke("send", {
                        to: username,
                        data: sendingObject
                    });
                },
                proxy: proxy
            };
        };

        return backendFactory;
    };

    notifyService.$inject = injectParams;

    app.factory('notifyService', notifyService);

});
