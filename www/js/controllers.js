'use strict';
angular.module('myApp.controllers', [])
        .controller('MainCtrl', ['$scope', '$rootScope', '$window', '$location', function($scope, $rootScope, $window, $location) {
                $scope.slide = '';
                $rootScope.back = function() {
                    $scope.slide = 'slide-right';
                    $window.history.back();
                }

            }])
        .controller('HomeCtrl', ['$scope', '$location', '$http', function($scope, $location, $http) {
                $scope.pageTitle = "Home";

                if (typeof window.localStorage["username"] == 'undefined')
                {
                    $location.url('login');
                    return false;
                }
                else
                {
                    if (typeof window.localStorage["sent_device_info"] == 'undefined')
                    {
                        try
                        {
                            pushNotification = window.plugins.pushNotification;

                            if (device.platform == 'android' || device.platform == 'Android' ||
                                    device.platform == 'amazon-fireos') {
                                pushNotification.register(successHandler, errorHandler, {"senderID": "927247598303", "ecb": "onNotification"});		// required!
                            }
                            else {
                                pushNotification.register(tokenHandler, errorHandler, {"badge": "true", "sound": "true", "alert": "true", "ecb": "onNotificationAPN"});	// required!
                            }
                        }
                        catch (err)
                        {
                            var txt = "There was an error on this page.\n\n";
                            txt += "Error description: " + err.message + "\n\n";
                            console.log(txt);
                        }
                    }

                }

                $("#header").animate({
                    top: -100,
                }, 500, function() {
                });
                $scope.go = function(path, slide) {
                    if (typeof slide == "undefined")
                        $scope.slide = 'slide-left';
                    else
                        $scope.slide = slide;

                    $("#header").css("top", "-100");
                    $("#header").animate({
                        top: 0,
                    }, 500, function() {
                    });

                    $location.url(path);

                }

            }])
        .controller('MyAccountCtrl', ['$scope', '$http', function($scope, $http) {

            }])
        .controller('LoginCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
                $scope.pageTitle = "Login";

                $(".trigger a").on("click", function(e) {
                    var me = $(this);
                    e.preventDefault();
                    var element = $(this).parent().parent().find(".toggle_container");
                    element.toggle('slow', function() {
                        if (element.is(':hidden'))
                            me.parent().css("background-position", "100% -22px");
                        else
                            me.parent().css("background-position", "100% 1px");
                    });


                });

                $scope.register = function() {
                    $scope.error = false;
                    var u = $scope.reg.username;
                    var p = $scope.reg.password;
                    var e = $scope.reg.email;

                    if (typeof u == 'undefined' || typeof p == 'undefined' || typeof e == 'undefined')
                    {
                        $scope.msg = "You have to fill all elements";
                        $scope.error = true;
                        return false;
                    }
                    if ($scope.validEmail(e) === false)
                    {
                        $scope.msg = "This is not a valid email";
                        $scope.error = true;
                        return false;
                    }

                    $http.get(site + "checkUsername?username=" + u)
                            .success(function(response) {
                                if (response.exist == true)
                                {
                                    $scope.msg = "This User Exists";
                                    $scope.error = true;
                                }
                                else
                                {
                                    var data = $.param($scope.reg);

                                    $http.get(site + "request_register?" + data)
                                            .success(function(response) {
                                                window.localStorage["user_id"] = response.user_id;
                                                window.localStorage["username"] = u;
                                                $scope.slide = 'slide-left';
                                                $location.url('/home');
                                            });
                                }
                            });

                };

                $scope.login = function() {
                    var u = $scope.username;
                    var p = $scope.password;
                    $http.get(site + "checkLogin?username=" + u + "&" + "password=" + p)
                            .success(function(response) {
                                if (response.login == true)
                                {
                                    window.localStorage["user_id"] = response.user_id;
                                    window.localStorage["username"] = u;
                                    $scope.slide = 'slide-left';
                                    $location.url('/home');
                                }

                                else
                                    $scope.wrongPasswod = true;
                            });

                };

                $scope.validEmail = function(email)
                {
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return re.test(email);
                }

            }])
        .controller('LogoutCtrl', ['$scope', '$location', function($scope, $location) {
                localStorage.removeItem('username');
                $scope.slide = 'slide-left';
                $location.url('/login');

            }])
        .controller('ContactUsCtrl', ['$scope', '$location', function($scope, $location) {
                window.plugin.email.open({
                    to: ['support@estore.com'],
                });
                $location.url('/home');

            }])
        .controller('OrdersCtrl', ['$scope', '$http', 'ngDialog', '$controller', function($scope, $http, ngDialog, $controller) {

                var page = "json_request/get/orders/user_id/" + window.localStorage["user_id"];

                $http.get(site + page)
                        .success(function(response) {
                            $scope.orders = response;
                        });

                $scope.openOrderMap = function(order)
                {
                    var innerScope = {};
                    innerScope.order = order;

                    ngDialog.open({
                        controller: $controller('OrderMapCtl', {
                            $scope: innerScope,
                        }),
                        template: './partials/dialogs/orderMap.html',
                    });
                }


                $scope.viewOrder = function(order)
                {

                    var innerScope = $scope;
                    innerScope.order = order;

                    ngDialog.open({
                        controller: 'OrderMapCtl',
                        template: './partials/dialogs/viewOrder.html',
                        scope: innerScope
                    });
                }


            }])

        // Dialogs
        .controller('OrderMapCtl', ['$scope', '$rootScope', 'ngDialog', function($scope, $rootScope, ngDialog) {
                setTimeout(function() {
                    var latlng = $scope.order.from_latlng.split(',');
                    var from = {};
                    var to = {};

                    from.lat = latlng[0];
                    from.lng = latlng[1];
                    var from = new google.maps.LatLng(from.lat, from.lng);

                    var latlng = $scope.order.to_latlng.split(',');
                    to.lat = latlng[0];
                    to.lng = latlng[1];
                    var to = new google.maps.LatLng(to.lat, to.lng);

                    draw_direction(from, to);
                }, 500);
            }])

        .controller('ViewOrderCtl', ['$scope', 'ngDialog', function($scope, ngDialog) {
            }])


function draw_direction(from, to) {

    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var map;
    directionsDisplay = new google.maps.DirectionsRenderer();

    var mapOptions = {
        zoom: 15,
        center: from
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);


    var request = {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}


// handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
        // showing an alert also requires the org.apache.cordova.dialogs plugin
        navigator.notification.alert(e.alert);
    }

    if (e.sound) {
        // playing a sound also requires the org.apache.cordova.media plugin
        var snd = new Media(e.sound);
        snd.play();
    }

    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotification(e) {

    switch (e.event)
    {
        case 'registered':
            if (e.regid.length > 0)
            {
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                $.get(site + "/accountPushID?device=" + device.platform + "&push_id=" + e.regid);
                window.localStorage["sent_device_info"] = true;
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {

                // on Android soundname is outside the payload. 
                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
                // playing a sound also requires the org.apache.cordova.media plugin
                var my_media = new Media("/android_asset/www/" + soundfile);

                my_media.play();
            }
            else
            {

            }

            break;

        case 'error':
            var error = e.msg
            break;

        default:

            break;
    }
}

function tokenHandler(result) {
    $.get(site + "/accountPushID?device=" + device.platform + "&push_id=" + result);
    window.localStorage["sent_device_info"] = true;
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler(result) {

}

function errorHandler(error) {

}
