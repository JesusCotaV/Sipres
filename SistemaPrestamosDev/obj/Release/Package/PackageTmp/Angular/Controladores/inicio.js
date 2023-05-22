(function () {


    angular.module("myApp").controller('inicioCtrl', inicioCtrl);
    inicioCtrl.$inject = ['$scope', '$rootScope'];

    function inicioCtrl($scope, $rootScope) {

        $scope.ListaEmpleados = [

        ];

        $scope.guardar = function () {
            var empleado = {};
            empleado.name = $scope.name;
            empleado.tel = $scope.tel;
            empleado.country = $scope.country;
            empleado.postalcode = $scope.postalcode;
            $scope.ListaEmpleados.push(empleado);

        }
    }

}());