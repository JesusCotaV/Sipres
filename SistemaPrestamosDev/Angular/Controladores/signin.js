(function () {
    'use strict';
    angular.module('myApp').controller('signinCtrl', signinCtrl);
    signinCtrl.$inject = ['$scope', '$location', "$firebaseAuth", "$rootScope", "$timeout", "commonFactory"];
    function signinCtrl($scope, $location, $firebaseAuth, $rootScope, $timeout, common) {
        var ctrl = this;
        var auth = $firebaseAuth();
        //////funciones//////
        ctrl.signin = signin;
        /////////////////////


        function signin(email, password) {
            var email = $scope.vmsignin.email;
            var password = $scope.vmsignin.password;
            debugger;
            
            if (email != "" && password != "") {
                Swal.fire({
                    title: 'Cargando',
                    text: 'Espere un momento.',
                    imageUrl: 'https://cdn.dribbble.com/users/12755/screenshots/1037374/hex-loader2.gif',
                    imageHeight: 200,
                    imageAlt: 'Custom image',
                    showConfirmButton: false,
                })
                console.log(email, password);
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(function (firebaseUser) {
                        $timeout(function () {
                            $scope.currentPath = $location.path("/login");
                        }, 0);
                        Swal.fire({
                            title: 'Cuenta Creada',
                            icon: 'success',
                            imageHeight: 200,
                            imageAlt: 'Custom image',
                            showConfirmButton: false,
                            timer: 1500,
                        })

                        firebase.auth().currentUser.sendEmailVerification().then(function () {
                            Swal.fire({
                                title: 'Verifique su correo',
                                icon: 'warning',
                                imageHeight: 200,
                                imageAlt: 'Custom image',
                                showConfirmButton: false,
                                timer: 1500,
                            })
                        });


                    }).catch(function (error) {
                        debugger;
                        console.log("Authentication failed:", error);
                        Swal.fire({
                            title: 'Error!',
                            text: error.message,
                            icon: 'error',
                            imageHeight: 200,
                            imageAlt: 'Custom image',
                            showConfirmButton: true,
                        })
                        $rootScope.$apply(function () {
                            

                            $rootScope.message = error.message;
                        });
                    });
                // ...


            }

        }

        function redirect() {
            $timeout(function () {
                $scope.currentPath = $location.path("/signin");
            }, 0);
        }

    }

}());