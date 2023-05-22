(function () {
    'use strict';
    angular.module("myApp").config(['$routeProvider', '$locationProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {

        $routeProvider.when('/', {
            templateUrl: '/Angular/Vistas/clientesCaptura.html',
            controller: 'clientesCapCtrl',
            controllerAs: 'vmclientC'
        }).when('/clientes-captura', {
            templateUrl:'/Angular/Vistas/clientesCaptura.html',
            controller: 'clientesCapCtrl',
            controllerAs: 'vmclientC'
        }).when('/clientes-consulta', {
            templateUrl: 'Angular/Vistas/clientesConsulta.html',
            controller: 'clientesConCtrl',
            controllerAs: 'vmclientCon'
        }).when('/clientes-Ver', {
            templateUrl: 'Angular/Vistas/clientesVer.html',
            controller: 'clientesVerCtrl',
            controllerAs: 'vmclientVer'
        }).when('/clientes-editar', {
            templateUrl: 'Angular/Vistas/clientesEditar.html',
            controller: 'clientesEditarCtrl',
            controllerAs: 'vmclientEditar'
        }).when('/creditos-captura', {
            templateUrl: 'Angular/Vistas/creditosCaptura.html',
            controller: 'creditosCapCtrl',
            controllerAs: 'vmcreditosC'
        }).when('/creditos-consulta', {
            templateUrl: 'Angular/Vistas/creditosConsulta.html',
            controller: 'creditosConCtrl',
            controllerAs: 'vmcreditosCon'
        }).when('/creditos-editar', {
            templateUrl: 'Angular/Vistas/creditosEditar.html',
            controller: 'creditosEditarCtrl',
            controllerAs: 'vmcreditosEditar'
        }).when('/creditos-Ver', {
            templateUrl: 'Angular/Vistas/creditosVer.html',
            controller: 'creditosVerCtrl',
            controllerAs: 'vmcreditosVer'
        }).when('/pagos-consulta', {
            templateUrl: 'Angular/Vistas/pagosConsulta.html',
            controller: 'pagosConCtrl',
            controllerAs: 'vmpagosCon'
        }).when('/login', {
            templateUrl: 'Angular/Vistas/Login.html',
            controller: 'loginCtrl',
            controllerAs: 'vmlogin'
        })

        
        delete $httpProvider.defaults.headers.common['X-Requested-With'];


        $httpProvider.defaults.headers.post['Accept'] = 'application/json';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.put['Accept'] = 'application/json';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';

        //$httpProvider.defaults.headers.put['Accept'] = 'application/json';
        //$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.useXDomain = true;



        var param = function (obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];


                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };


        $httpProvider.defaults.transformRequest = [function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
        //        .when("/1", {
        //            templateUrl: "Angular/pagina1.html",
        //            controller: 'myCtrl'
        //        })
        //         .when("/2", {
        //             templateUrl: "Angular/pagina2.html",
        //             controller: 'exampleCtrl'
        //         })
        //         .when("/3", {
        //             templateUrl: "Angular/pagina3.html",
        //             controller: 'commonFactory'
        //         })
        //         .when("/carrito", {
        //             templateUrl: "Angular/carrito.html"
        //         })
        //         .when("/login", {
        //             templateUrl: "Angular/login.html"
        //         })

        //.otherwise({
        //    redirectTo: '/'

    }]);
}());


