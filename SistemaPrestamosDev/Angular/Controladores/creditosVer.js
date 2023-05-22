(function () {

    angular.module("myApp").controller('creditosVerCtrl', creditosVerCtrl);
    creditosVerCtrl.$inject = ['$scope', '$rootScope', "commonFactory", "$firebaseArray","$timeout","$location"];
    //Inicio Funcion controlador
    function creditosVerCtrl($scope, $rootScope, common, $firebaseArray,$timeout,$location) {
        var ctrl = this;
        ////Variables////
        var id = localStorage.getItem("$id");
        var ref = firebase.database().ref("/creditos");
        $scope.ListadoImagenes = $firebaseArray(ref);
        console.log($scope.ListadoImagenes);
        //////funciones//////
        ctrl.Volver = Volver;

        function Volver(){
            $timeout(function () {
                $scope.currentPath = $location.path("/creditos-consulta");
            }, 0);
        }

        ctrl.emailVer = localStorage.getItem('email');
        if (ctrl.emailVer == "" || ctrl.emailVer == undefined || ctrl.emailVer == null) {
            $scope.currentPath = $location.path("/login");
        }

        ref.orderByKey().on("value", function (data) {

            data.forEach(function (data) {

                if (data.key == id) {
                    console.log(data.val());
                    ctrl.ArchivoPagare = data.val().ArchivoPagare;
                    ctrl.Aval1 = data.val().Aval1;
                    ctrl.Aval1cel = data.val().Aval1cel;
                    ctrl.Aval2 = data.val().Aval2;
                    ctrl.Aval2cel = data.val().Aval2cel;
                    ctrl.Cliente = data.val().Cliente;
                    ctrl.Deuda = data.val().Deuda;
                    ctrl.Fecha = data.val().Fecha;
                    ctrl.NombreDocPagare = data.val().NombreDocPagare;
                    ctrl.Pago = data.val().Pago;
                    ctrl.Prestamo = data.val().Prestamo;
                    ctrl.TipoPago = data.val().TipoPago;
                    ctrl.id = data.val().id;
                    ctrl.idCliente = data.val().idCliente;
                    console.log(ctrl.Cliente);
                };

            });

        });

    }
    //Fin Funcion controlador
}());