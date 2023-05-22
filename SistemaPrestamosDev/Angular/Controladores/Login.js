(function () {


    angular.module("myApp").controller('loginCtrl', loginCtrl);
    loginCtrl.$inject = ['$scope', '$location', "$firebaseAuth", "$rootScope", "$timeout", "commonFactory"];
    //Inicio Funcion controlador
    function loginCtrl($scope, $location, $firebaseAuth, $rootScope, $timeout, commonFactory) {
        var ctrl = this;
        var auth = $firebaseAuth();
        ctrl.emailVer = localStorage.getItem('email');
        //////funciones//////
        ctrl.logApp = logApp;
        /////////////////////
        console.log(ctrl.emailVer);
        if (ctrl.emailVer == "" || ctrl.emailVer == undefined || ctrl.emailVer == null) {
            $scope.currentPath = $location.path("/login");
        }

        function logApp(email, password) {
            var email2 = email;

            commonFactory.login(email, password)
                .then(function success(response) {
                   
                    localStorage.setItem('email', email2);

                    debugger;
                    commonFactory.email = email2;
                    $timeout(function () {
                        $location.path("/clientes-captura");
                    }, 0);
                    Swal.fire({
                        title: 'Bienvenido!',
                        icon: 'success',
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        showConfirmButton: false,
                        timer: 1500,
                    })

                },
                    function error(response) {
                        console.log("Authentication failed:", response);
                        var errorMessage = response.message;

                        switch (response.code) {
                            case 'auth/invalid-email':
                                errorMessage = 'Correo electrónico inválido';
                                break;
                            case 'auth/user-disabled':
                                errorMessage = 'Usuario deshabilitado';
                                break;
                            case 'auth/user-not-found':
                                errorMessage = 'Usuario no encontrado';
                                break;
                            case 'auth/wrong-password':
                                errorMessage = 'Contraseña incorrecta';
                                break;
                            // Agrega más casos según tus necesidades

                            default:
                                errorMessage = 'Error de autenticación';
                        }

                        Swal.fire({
                            title: 'Error!',
                            text: errorMessage,
                            icon: 'error',
                            imageHeight: 200,
                            imageAlt: 'Custom image',
                            showConfirmButton: true,
                        });

                    });
        }

        $scope.reset = function () {
            var emailRecover;
            Swal.fire({
                title: "Ingresa tu email",
                text: "Se te enviara un correo para recuperar tu contraseña",
                input: 'email',
                showCancelButton: true
            }).then((result) => {
                if (result.value) {
                    emailRecover = result.value;
                    firebase.auth().sendPasswordResetEmail(emailRecover).then(function () {
                        Swal.fire({
                            title: 'Correo enviado',
                            text: 'Ve tu correo para reiniciar tu contraseña',
                            icon: 'success',
                            imageHeight: 200,
                            imageAlt: 'Custom image',
                            showConfirmButton: true,
                        })
                    }).catch(function (error) {
                        Swal.fire({
                            title: 'Error!',
                            text: error.message,
                            icon: 'error',
                            imageHeight: 200,
                            imageAlt: 'Custom image',
                            showConfirmButton: true,
                        })
                    });
                }
            });

        },

            //$scope.NombreUsuario = [

            //];

            //var emailModel = function (email) {
            //    this.email = email;
            //}

            //$scope.$watch(function () { return commonFactory.email }, function (newValue, oldValue) {
            //    debugger;
            //    if (newValue.length > 0) {
            //        $scope.NombreUsuario.push(new emailModel(newValue));
            //        console.log(newValue);
            //    }
            //});

            $scope.redirect = function () {
                $timeout(function () {
                    $scope.currentPath = $location.path("/signin");
                }, 0);
            }

    }

}());