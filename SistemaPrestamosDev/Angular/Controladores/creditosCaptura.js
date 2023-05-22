(function () {


    angular.module("myApp").controller('creditosCapCtrl', creditosCapCtrl);
    creditosCapCtrl.$inject = ['$scope', '$rootScope', "commonFactory", "$firebaseArray", "$timeout","$location"];
    //Inicio Funcion controlador
    function creditosCapCtrl($scope, $rootScope, common, $firebaseArray, $timeout, $location) {
        var ctrl = this;
        ////Variables////
        ctrl.Credito = {};
        ctrl.prueba = {};
        var ref = firebase.database().ref("/clientes");
        $scope.ListadoClientesNombres = $firebaseArray(ref);
        //////funciones//////
        ctrl.selectCliente = selectCliente;
        ctrl.capturarPrestamo = capturarPrestamo;
        ctrl.currency = currency;
        ctrl.generarCodigo = generarCodigo;
        ctrl.Pagares = Pagares;
        ctrl.ValidarPrestamo = ValidarPrestamo;
        ctrl.selectTipo = selectTipo;
        $scope.Message = "";
        $scope.deuda = "";
        ctrl.emailVer = localStorage.getItem('email');
        if (ctrl.emailVer == "" || ctrl.emailVer == undefined || ctrl.emailVer == null) {
            $scope.currentPath = $location.path("/login");
        }

        function ValidarPrestamo(cantidad) {
            
                var prestamoVal = ctrl.Credito.CreditoDisponible;
                var deudaTotal = cantidad.replace(/,/g, '');
            if (parseInt(cantidad) > parseInt(prestamoVal)) {
                console.log(prestamoVal);
                console.log(cantidad);
                $scope.Message = "Cantidad no aceptada";
                document.getElementById("Message").style.color = "Red";
                return true;

            } else {
                $scope.Message = "Cantidad aceptada";
                $scope.deuda = parseInt(cantidad);
                document.getElementById("myInput").value = parseInt(deudaTotal) + (parseInt(deudaTotal) * 0.7);
                $scope.deuda = parseInt(deudaTotal) + (parseInt(deudaTotal) * 0.7);
                document.getElementById("Message").style.color = "Green";
                return false;
            }
            

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

        function selectTipo() {
            var e = document.getElementById("selTipo");
            ctrl.Credito.TipoPago = e.options[e.selectedIndex].text;
            console.log(ctrl.Credito.TipoPago);
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

                debugger;

                if ($scope.caso == "Pagare") {
                    ctrl.NombrePagare = fileObj.filename;
                    var archivo = {
                        Nombre: fileObj.filename,
                        base64: fileObj.base64,
                        tipo: fileObj.filetype,
                    }

                    ctrl.Pagare = "data:" + archivo.tipo + ";base64," + archivo.base64;
                    console.log(ctrl.Pagare);
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

        function selectCliente() {
            var e = document.getElementById("selCliente");
            ctrl.Credito.Cliente = e.options[e.selectedIndex].text;
            console.log(ctrl.Credito.Cliente);

            ref.orderByKey().on("value", function (data) {

                data.forEach(function (data) {
                    if (data.val().Nombre + " " + data.val().Apellido == ctrl.Credito.Cliente) {
                        console.log(data.val());
                        ctrl.Credito.id = data.key;
                        ctrl.Credito.CreditoDisponible = data.val().CreditoDisponible;
                    };

                });

            });
        }

        function generarCodigo(longitud) {
            var caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var codigo = '';

            for (var i = 0; i < longitud; i++) {
                codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }

            return codigo;
        }

        function capturarPrestamo(prestamo, deuda, aval1, aval2, aval1cel, aval2cel, pago) {
            var d = new Date();
            var NoTimeDate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
            if (typeof prestamo === 'string') {
                prestamo = prestamo.replace(/,/g, '');
            }
            if (typeof deuda === 'string') {
                deuda = deuda.replace(/,/g, '');
            }
            if (typeof pago === 'string') {
                pago = pago.replace(/,/g, '');
            }
            console.log(prestamo);
            if (aval1 == null) {
                aval1 = "";
            }
            if (aval2 == null) {
                aval2 = "";
            }
            if (aval1cel == null) {
                aval1cel = "";
            }
            if (aval2cel == null) {
                aval2cel = "";
            }
            if (ctrl.NombrePagare == undefined) {
                ctrl.NombrePagare = null;
                ctrl.Pagare = null;
            }

            var codigo = generarCodigo(4); // Genera un código alfanumérico de 10 caracteres
            console.log(codigo); // Ejemplo de salida: "8u4tGk9jNf"
            deuda = $scope.deuda;
            var datos = {
                id: codigo,
                idCliente: ctrl.Credito.id,
                Cliente: ctrl.Credito.Cliente,
                Prestamo: prestamo,
                Deuda: deuda,
                TipoPago: ctrl.Credito.TipoPago,
                Pago: pago,
                Aval1: aval1,
                Aval2: aval2,
                Aval1cel: aval1cel,
                Aval2cel: aval2cel,
                Fecha: NoTimeDate,
                NombreDocPagare: ctrl.NombrePagare,
                ArchivoPagare: ctrl.Pagare
            }
           
            if (prestamo == null || deuda == null || pago == null || ctrl.Credito.TipoPago == null || ctrl.Credito.TipoPago == "Tipo de pago*" || prestamo == "" || deuda == "" || pago == "" || ctrl.Credito.TipoPago == "") {
                Swal.fire({
                    title: "Faltan campos por llenar",
                    icon: 'error!',
                    imageHeight: 200,
                    imageAlt: 'Custom image',
                    showConfirmButton: false,
                    timer: 1500,
                })
                console.log(prestamo, $scope.deuda, pago, ctrl.Credito.TipoPago);
            } else {
                if ($scope.Message == "Cantidad no aceptada") {
                    Swal.fire({
                        title: "La cantidad del prestamo es incorrecta",
                        icon: 'error!',
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        showConfirmButton: false,
                        timer: 1500,
                    })
                } else {
                    Swal.fire({
                        title: 'Cargando',
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        showConfirmButton: false,
                        imageUrl: 'https://i.pinimg.com/originals/7b/73/6a/7b736a33be802fc2e737e3df56b4ef0e.gif',
                        background: 'rgb(0 29 48)',
                        color: 'white',
                    })
                    common.agregarcredito(datos).then(function success(response) {
                        Swal.fire({
                            title: 'Prestamo registrado',
                            background: 'rgb(0 29 48)',
                            color: 'white',
                            icon: 'success',
                            iconColor: 'rgb(40 255 40)',
                            imageHeight: 200,
                            imageAlt: 'Custom image',
                            showConfirmButton: false,
                            timer: 1500,
                        })
                    }, function error(response) {
                        Swal.fire({
                            title: response,
                            icon: 'error!',
                            imageHeight: 200,
                            imageAlt: 'Custom image',
                            showConfirmButton: false,
                            timer: 1500,
                        })
                    });

                    firebase.database().ref().child('/clientes/' + ctrl.Credito.id)
                        .update({
                            CreditoDisponible: ctrl.Credito.CreditoDisponible - parseInt(prestamo),
                        });
                    $timeout(function () {
                        $scope.currentPath = $location.path("/creditos-consulta");
                    }, 0);
                }

            }

        }

    }
    //Fin Funcion controlador

}());