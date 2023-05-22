(function () {

    angular.module('app.Servicios').factory('commonFactory', commonFactory);
    commonFactory.$inject = ['$http', '$q', '$firebaseArray', "$firebaseObject", "$timeout", "$location"];
    function commonFactory($http, $q, $firebaseArray, $firebaseObject, $timeout, $location) {
        //aqui van listadas todas las funciones
        var result = {
            datos: [],
            email: '',
            password: '',
            agregarcliente: agregarcliente,
            agregarcredito: agregarcredito,
            RegistrarPago: RegistrarPago,
            login: login
        }

        function login(email, password) {
            //var email, password;

            let deferred = $q.defer();
            debugger;


            if (email != "" && password != "") {
                debugger;
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(function (firebaseUser) {

                        deferred.resolve(firebaseUser);

                    }).catch(function (error) {
                        debugger;

                        deferred.reject(error);
                    });
                // ...
                return deferred.promise;

            }

        }

        function RegistrarPago(producto) {
            let deferred = $q.defer();
            // add an item
            var ref = firebase.database().ref("/Pagos/");

            var list = $firebaseArray(ref);

            list.$add(producto).then(function (response) {
                console.log("Exito");
                deferred.resolve(response);
            }, function (error) {
                console.log(error);
                deferred.reject(Listado);
            });
            return deferred.promise;
        }   

        ///Aqui van las funciones
        function agregarcliente(producto) {
            let deferred = $q.defer();
            // add an item
            var ref = firebase.database().ref("/clientes/");

            var list = $firebaseArray(ref);

            list.$add(producto).then(function (response) {
                console.log("Exito");
                deferred.resolve(response);
            }, function (error) {
                console.log(error);
                deferred.reject(Listado);
            });
            return deferred.promise;
        }

        function agregarcredito(producto) {
            let deferred = $q.defer();
            // add an item
            var ref = firebase.database().ref("/creditos/");

            var list = $firebaseArray(ref);

            list.$add(producto).then(function (response) {
                console.log("Exito");
                deferred.resolve(response);
            }, function (error) {
                console.log(error);
                deferred.reject(Listado);
            });
            return deferred.promise;
        }
        return result;

    }

}());