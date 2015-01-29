'use strict';
var site = "http://estore.ematajer.com/phonegap/";

angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'myApp.controllers',
    'myApp.memoryServices',
    'ngDialog',
])

        .config(['$routeProvider', function($routeProvider) {
                $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
                $routeProvider.when('/logout', {templateUrl: 'partials/login.html', controller: 'LogoutCtrl'});
                $routeProvider.when('/orders', {templateUrl: 'partials/orders.html', controller: 'OrdersCtrl'});
                $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
                $routeProvider.when('/my_account', {templateUrl: 'partials/my_account.html', controller: 'MyAccountCtrl'});
                $routeProvider.when('/contact_us', {templateUrl: 'partials/home.html', controller: 'ContactUsCtrl'});
                $routeProvider.otherwise({redirectTo: '/home'});
            }])
        