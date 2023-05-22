(function () {


    angular.module("myApp").controller('clientesVerCtrl', clientesVerCtrl);
    clientesVerCtrl.$inject = ['$scope', '$rootScope', "commonFactory", "$firebaseArray","$timeout","$location"];
    //Inicio Funcion controlador
    function clientesVerCtrl($scope, $rootScope, common, $firebaseArray,$timeout,$location) {
        var ctrl = this;
        ////Variables////
        var id = localStorage.getItem("$id");
        var ref = firebase.database().ref("/clientes");
        $scope.ListadoImagenes = $firebaseArray(ref);
        console.log($scope.ListadoImagenes);
        //////funciones//////
        ctrl.Volver = Volver;
        ctrl.emailVer = localStorage.getItem('email');
        if (ctrl.emailVer == "" || ctrl.emailVer == undefined || ctrl.emailVer == null) {
            $scope.currentPath = $location.path("/login");
        }

        function Volver(){
            $timeout(function () {
                $scope.currentPath = $location.path("/clientes-consulta");
            }, 0);
        }

        ref.orderByKey().on("value", function (data) {

            data.forEach(function (data) {

                if (data.key == id) {
                    console.log(data.val());
                    ctrl.Nombre = data.val().Nombre;
                    ctrl.Apellido = data.val().Apellido;
                    ctrl.Celular = data.val().Celular;
                    ctrl.Credito = data.val().Credito;
                    ctrl.Estatus = data.val().Estatus;
                    ctrl.Comprobante = data.val().ArchivoComprobante;
                    ctrl.INEF = data.val().ArchivoINEF;
                    ctrl.INEP = data.val().ArchivoINEP;
                    ctrl.Aval1 = data.val().Aval1;
                    ctrl.Aval1cel = data.val().Aval1cel;
                    ctrl.Aval2 = data.val().Aval2;
                    ctrl.Aval2cel = data.val().Aval2cel;
                    ctrl.Ref1 = data.val().Ref1;
                    ctrl.Ref1cel = data.val().Ref1cel;
                    ctrl.Ref2 = data.val().Ref2;
                    ctrl.Ref2cel = data.val().Ref2cel;
                    ctrl.Fecha = data.val().Fecha;
                };

            });

        });

    }
    //Fin Funcion controlador
}());