(function () {


    angular.module("myApp").controller('creditosEditarCtrl', creditosEditarCtrl);
    creditosEditarCtrl.$inject = ['$scope', '$rootScope', "commonFactory", "$firebaseArray", "$timeout", "$location"];
    //Inicio Funcion controlador
    function creditosEditarCtrl($scope, $rootScope, common, $firebaseArray, $timeout, $location) {
        var ctrl = this;
        ////Variables///
        ctrl.Credito = {};
        var id = localStorage.getItem("$id");
        var ref = firebase.database().ref("/creditos");
        $scope.ListadoClientes = $firebaseArray(ref);
        console.log($scope.ListadoClientes);
        $scope.caso = "";
        //////funciones//////
        ctrl.Volver = Volver;
        ctrl.actualizarCredito = actualizarCredito;
        ctrl.currency = currency;
        ctrl.Pagares = Pagares;
        ctrl.selectTipo = selectTipo;
        ctrl.emailVer = localStorage.getItem('email');
        if (ctrl.emailVer == "" || ctrl.emailVer == undefined || ctrl.emailVer == null) {
            debugger;
            $scope.currentPath = $location.path("/login");
        }

        function currency() {
            // Jquery Dependency

            $("input[data-type='currency']").on({
                keyup: function () {
                    formatCurrency($(this));
                },
                blur: function () {
                    formatCurrency($(this), "blur");
                }
            });


            function formatNumber(n) {
                // format number 1000000 to 1,234,567
                return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }


            function formatCurrency(input, blur) {
                // appends $ to value, validates decimal side
                // and puts cursor back in right position.

                // get input value
                var input_val = input.val();

                // don't validate empty input
                if (input_val === "") { return; }

                // original length
                var original_len = input_val.length;

                // initial caret position 
                var caret_pos = input.prop("selectionStart");

                // check for decimal
                if (input_val.indexOf(".") >= 0) {

                    // get position of first decimal
                    // this prevents multiple decimals from
                    // being entered
                    var decimal_pos = input_val.indexOf(".");

                    // split number by decimal point
                    var left_side = input_val.substring(0, decimal_pos);
                    var right_side = input_val.substring(decimal_pos);

                    // add commas to left side of number
                    left_side = formatNumber(left_side);

                    // validate right side
                    right_side = formatNumber(right_side);

                    // On blur make sure 2 numbers after decimal
                    if (blur === "blur") {
                        right_side += "00";
                    }

                    // Limit decimal to only 2 digits
                    right_side = right_side.substring(0, 2);

                    // join number by .
                    input_val = left_side + "." + right_side;

                } else {
                    // no decimal entered
                    // add commas to number
                    // remove all non-digits
                    input_val = formatNumber(input_val);
                    input_val = input_val;

                    // final formatting
                    if (blur === "blur") {
                        input_val += ".00";
                    }
                }

                // send updated string to input
                input.val(input_val);

                // put caret back in the right position
                var updated_len = input_val.length;
                caret_pos = updated_len - original_len + caret_pos;
                input[0].setSelectionRange(caret_pos, caret_pos);
            }



        }
        currency();

        function Volver() {
            $timeout(function () {
                $scope.currentPath = $location.path("/creditos-consulta");
            }, 0);
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
                    console.log(ctrl.NombreDocPagare);
                };

            });

        });

        function selectTipo() {
            var e = document.getElementById("selTipo");
            ctrl.TipoPago = e.options[e.selectedIndex].text;
            console.log(ctrl.TipoPago);
        }

        function Pagares() {
            var fileInput = angular.element(document.getElementById("pagare"));
            fileInput.click();
            $scope.caso = "Pagare";
        }

        //Inicio onload
        $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {

            if (fileObj.filetype == "image/jpeg" || fileObj.filetype == "image/png" || fileObj.filetype == "image/jpg") {
                Swal.fire({
                    title: '',
                    text: 'Documento cargado',
                    icon: 'success',
                    imageHeight: 200,
                    imageAlt: 'Custom image',
                    showConfirmButton: false,
                    timer: 1500,
                })

                if ($scope.caso == "Pagare") {
                    ctrl.NombreDocPagare = fileObj.filename;
                    var archivo = {
                        Nombre: fileObj.filename,
                        base64: fileObj.base64,
                        tipo: fileObj.filetype,
                    }

                    ctrl.ArchivoPagare = "data:" + archivo.tipo + ";base64," + archivo.base64;
                    console.log(ctrl.ArchivoPagare);
                }
            } else {
                Swal.fire({
                    title: '',
                    text: 'Solo se aceptan imagenes',
                    icon: 'error',
                    imageHeight: 200,
                    imageAlt: 'Custom image',
                    showConfirmButton: false,
                    timer: 1500,
                })
            }

        };
        //Fin onload

        function actualizarCredito(aval1, aval2, aval1cel, aval2cel, pago) {

            if (ctrl.ArchivoPagare == undefined) {
                ctrl.ArchivoPagare = null;
                ctrl.NombreDocPagare = null;
            }
            if (pago == null || ctrl.TipoPago == null || pago == "" || ctrl.TipoPago == "") {
                Swal.fire({
                    title: "Faltan campos por llenar",
                    icon: 'error!',
                    imageHeight: 200,
                    imageAlt: 'Custom image',
                    showConfirmButton: false,
                    timer: 1500,
                })
            } else {
                firebase.database().ref().child('/creditos/' + id)
                    .update({
                        TipoPago: ctrl.TipoPago,
                        Pago: pago,
                        Aval1: aval1,
                        Aval2: aval2,
                        Aval1cel: aval1cel,
                        Aval2cel: aval2cel,
                        NombreDocPagare: ctrl.NombreDocPagare,
                        ArchivoPagare: ctrl.ArchivoPagare,
                    });
                Swal.fire({
                    title: 'Prestamo actualizado',
                    icon: 'success',
                    imageHeight: 200,
                    imageAlt: 'Custom image',
                    showConfirmButton: false,
                    timer: 1500,
                })
                $timeout(function () {
                    $scope.currentPath = $location.path("/creditos-consulta");
                }, 0);
            }
            
        }

    }
    //Fin Funcion controlador
}());