(function () {


    angular.module("myApp").controller('clientesEditarCtrl', clientesEditarCtrl);
    clientesEditarCtrl.$inject = ['$scope', '$rootScope', "commonFactory", "$firebaseArray", "$timeout", "$location"];
    //Inicio Funcion controlador
    function clientesEditarCtrl($scope, $rootScope, common, $firebaseArray, $timeout, $location) {
        var ctrl = this;
        ////Variables///
        ctrl.Cliente = {};
        var id = localStorage.getItem("$id");
        var ref = firebase.database().ref("/clientes");
        $scope.ListadoImagenes = $firebaseArray(ref);
        console.log($scope.ListadoImagenes);
        //////funciones//////
        ctrl.Volver = Volver;
        ctrl.ineFrontal = ineFrontal;
        ctrl.inePosterior = inePosterior;
        ctrl.comprobante = comprobante;
        ctrl.selectEstatus = selectEstatus;
        ctrl.actualizarCliente = actualizarCliente;
        ctrl.currency = currency;
        $scope.caso = "";
        ctrl.emailVer = localStorage.getItem('email');
        if (ctrl.emailVer == "" || ctrl.emailVer == undefined || ctrl.emailVer == null) {
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
                $scope.currentPath = $location.path("/clientes-consulta");
            }, 0);
        }

        ref.orderByKey().on("value", function (data) {

            data.forEach(function (data) {

                if (data.key == id) {
                    
                    ctrl.Nombre = data.val().Nombre;
                    ctrl.Apellido = data.val().Apellido;
                    ctrl.Celular = data.val().Celular;
                    ctrl.Credito = data.val().Credito;
                    ctrl.CreditoDisponible = data.val().CreditoDisponible;
                    ctrl.Estatus = data.val().Estatus;
                    ctrl.Comprobante = data.val().ArchivoComprobante;
                    ctrl.INEF = data.val().ArchivoINEF;
                    ctrl.INEP = data.val().ArchivoINEP;
                    ctrl.NombreComprobante = data.val().NombreDocComprobante;
                    ctrl.NombreINEF = data.val().NombreDocINEF;
                    ctrl.NombreINEP = data.val().NombreDocINEP;
                    ctrl.Ref1 = data.val().Ref1;
                    ctrl.Ref1cel = data.val().Ref1cel;
                    ctrl.Ref2 = data.val().Ref2;
                    ctrl.Ref2cel = data.val().Ref2cel;
                    ctrl.Fecha = data.val().Fecha;
                    ctrl.creditoActual = data.val().Credito;
                };

            });

        });

        function selectEstatus() {
            var e = document.getElementById("selEstatus");
            ctrl.Estatus = e.options[e.selectedIndex].text;
            console.log(ctrl.Estatus);
        }

        function inePosterior() {
            var fileInput = angular.element(document.getElementById("ineFile1"));
            fileInput.click();
            $scope.caso = "inePosterior";
        }

        function ineFrontal() {
            var fileInput = angular.element(document.getElementById("ineFile2"));
            fileInput.click();
            $scope.caso = "ineFrontal";
        }

        function comprobante() {
            var fileInput = angular.element(document.getElementById("comprobante"));
            fileInput.click();
            $scope.caso = "Comprobante";
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
                if ($scope.caso == "inePosterior") {
                    ctrl.NombreINEF = fileObj.filename;
                    var archivo = {
                        Nombre: fileObj.filename,
                        base64: fileObj.base64,
                        tipo: fileObj.filetype,
                    }

                    ctrl.INEF = "data:" + archivo.tipo + ";base64," + archivo.base64;
                    console.log(ctrl.INEF);
                }

                if ($scope.caso == "ineFrontal") {
                    ctrl.NombreINEP = fileObj.filename;
                    var archivo = {
                        Nombre: fileObj.filename,
                        base64: fileObj.base64,
                        tipo: fileObj.filetype,
                    }

                    ctrl.INEP = "data:" + archivo.tipo + ";base64," + archivo.base64;
                    console.log(ctrl.INEP);
                }

                if ($scope.caso == "Comprobante") {
                    ctrl.NombreComprobante = fileObj.filename;
                    var archivo = {
                        Nombre: fileObj.filename,
                        base64: fileObj.base64,
                        tipo: fileObj.filetype,
                    }

                    ctrl.Comprobante = "data:" + archivo.tipo + ";base64," + archivo.base64;
                    console.log(ctrl.Comprobante);
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

        function actualizarCliente(nombre, apellido, celular, credito, ref1, ref2, ref1cel, ref2cel) {
            if (typeof credito === 'string') {
                credito = credito.replace(/,/g, '');
            }
            console.log("credito disponible: "+ctrl.CreditoDisponible);
            const input = document.getElementById('number-input');
            const texto = input.value.trim();

            if(ref1==null){
                ref1="";
            }
            if(ref2==null){
                ref2="";
            }
            if(ref1cel==null){
                ref1cel="";
            }
            if(ref2cel==null){
                ref2cel="";
            }
            if (nombre == null || apellido == null || celular == null || credito == null || nombre == "" || apellido == "" || celular == "" || credito == "" || ctrl.Estatus == "Estatus*" || ctrl.Estatus == null || ctrl.Estatus == "") {
                if (texto.length > 0 && texto.length < 10) {
                    Swal.fire({
                        title: "Intoduzca un numero de celular de 10 caracteres",
                        icon: 'error',
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        showConfirmButton: false,
                        timer: 1500,
                    })
                    return;
                } else {
                    Swal.fire({
                        title: "Faltan campos por llenar",
                        icon: 'error',
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        showConfirmButton: false,
                        timer: 1500,
                    })
                }
            } else {
                if (credito > ctrl.creditoActual) {
                    var creditoAgregado = credito - ctrl.creditoActual;
                    firebase.database().ref().child('/clientes/' + id)
                        .update({
                            Nombre: nombre,
                            Apellido: apellido,
                            Celular: celular,
                            Estatus: ctrl.Estatus,
                            Credito: credito,
                            CreditoDisponible: parseInt(ctrl.CreditoDisponible) + parseInt(creditoAgregado),
                            Ref1: ref1,
                            Ref2: ref2,
                            Ref1cel: ref1cel,
                            Ref2cel: ref2cel,
                            Fecha: ctrl.Fecha,
                            NombreDocINEF: ctrl.NombreINEF,
                            ArchivoINEF: ctrl.INEF,
                            NombreDocINEP: ctrl.NombreINEP,
                            ArchivoINEP: ctrl.INEP,
                            NombreDocComprobante: ctrl.NombreComprobante,
                            ArchivoComprobante: ctrl.Comprobante
                        });

                    Swal.fire({
                        title: 'Cliente actualizado',
                        icon: 'success',
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        showConfirmButton: false,
                        timer: 1500,
                    })
                    $timeout(function () {
                        $scope.currentPath = $location.path("/clientes-consulta");
                    }, 0);
                } else {
                    if (credito == ctrl.creditoActual) {
                        var creditoAgregado = 0;
                        firebase.database().ref().child('/clientes/' + id)
                            .update({
                                Nombre: nombre,
                                Apellido: apellido,
                                Celular: celular,
                                Estatus: ctrl.Estatus,
                                Credito: credito,
                                CreditoDisponible: parseInt(ctrl.CreditoDisponible) + parseInt(creditoAgregado),
                                Ref1: ref1,
                                Ref2: ref2,
                                Ref1cel: ref1cel,
                                Ref2cel: ref2cel,
                                Fecha: ctrl.Fecha,
                                NombreDocINEF: ctrl.NombreINEF,
                                ArchivoINEF: ctrl.INEF,
                                NombreDocINEP: ctrl.NombreINEP,
                                ArchivoINEP: ctrl.INEP,
                                NombreDocComprobante: ctrl.NombreComprobante,
                                ArchivoComprobante: ctrl.Comprobante
                            });

                        Swal.fire({
                            title: 'Cliente actualizado',
                            icon: 'success',
                            imageHeight: 200,
                            imageAlt: 'Custom image',
                            showConfirmButton: false,
                            timer: 1500,
                        })
                        $timeout(function () {
                            $scope.currentPath = $location.path("/clientes-consulta");
                        }, 0);
                    }


                    if (credito < ctrl.creditoActual) {
                        var creditoAgregado = ctrl.creditoActual - credito;
                        firebase.database().ref().child('/clientes/' + id)
                            .update({
                                Nombre: nombre,
                                Apellido: apellido,
                                Celular: celular,
                                Estatus: ctrl.Estatus,
                                Credito: credito,
                                CreditoDisponible: parseInt(ctrl.CreditoDisponible) - parseInt(creditoAgregado),
                                Ref1: ref1,
                                Ref2: ref2,
                                Ref1cel: ref1cel,
                                Ref2cel: ref2cel,
                                Fecha: ctrl.Fecha,
                                NombreDocINEF: ctrl.NombreINEF,
                                ArchivoINEF: ctrl.INEF,
                                NombreDocINEP: ctrl.NombreINEP,
                                ArchivoINEP: ctrl.INEP,
                                NombreDocComprobante: ctrl.NombreComprobante,
                                ArchivoComprobante: ctrl.Comprobante
                            });

                        Swal.fire({
                            title: 'Cliente actualizado',
                            icon: 'success',
                            imageHeight: 200,
                            imageAlt: 'Custom image',
                            showConfirmButton: false,
                            timer: 1500,
                        })
                        $timeout(function () {
                            $scope.currentPath = $location.path("/clientes-consulta");
                        }, 0);
                    }

                }
            }

        }

    }
    //Fin Funcion controlador
}());