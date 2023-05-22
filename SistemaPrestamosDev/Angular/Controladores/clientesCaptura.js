(function () {


    angular.module("myApp").controller('clientesCapCtrl', clientesCapCtrl);
    clientesCapCtrl.$inject = ['$scope', '$rootScope', "commonFactory", "$timeout", "$location"];
    //Inicio Funcion controlador
    function clientesCapCtrl($scope, $rootScope, common, $timeout, $location) {
        var ctrl = this;
        ////Variables////
        ctrl.Cliente = {};
        //////funciones//////
        ctrl.ineFrontal = ineFrontal;
        ctrl.inePosterior = inePosterior;
        ctrl.Comprobante = Comprobante;
        ctrl.selectEstatus = selectEstatus;
        ctrl.capturarCliente = capturarCliente;
        ctrl.currency = currency;
        ctrl.Cliente.NombreDocumentoComprobante="";
        ctrl.Cliente.NombreDocINEP="";
        ctrl.Cliente.documentoINEF="";
        ctrl.Cliente.documentoINEP ="";
        ctrl.Cliente.documentoComprobante ="";
        ctrl.Cliente.NombreDocumentoINEP="";
        ctrl.Cliente.NombreDocumentoINEF="";
        $scope.caso = "";
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

        function selectEstatus() {
            var e = document.getElementById("selEstatus");
            ctrl.Cliente.estatus = e.options[e.selectedIndex].text;
            console.log(ctrl.Cliente.estatus);
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

        function Comprobante() {
            var fileInput = angular.element(document.getElementById("comprobante"));
            fileInput.click();
            $scope.caso = "Comprobante";
        }

        //Inicio onload
        $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {

            debugger;
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
                    var nombre = fileObj.filename;
                    ctrl.Cliente.NombreDocumentoINEF = fileObj.filename;
                    ctrl.Cliente.TipoDocumentoINEF = fileObj.filetype;
                    ctrl.Cliente.Base64INEF = fileObj.base64;
                    $scope.archivoBase64 = fileObj.base64;
                    var archivo = {
                        Nombre: fileObj.filename,
                        base64: fileObj.base64,
                        tipo: fileObj.filetype,
                    }

                    ctrl.Cliente.documentoINEF = "data:" + archivo.tipo + ";base64," + archivo.base64;
                    console.log(ctrl.Cliente.documentoINEF);
                }

                if ($scope.caso == "ineFrontal") {
                    var nombre = fileObj.filename;
                    ctrl.Cliente.NombreDocumentoINEP = fileObj.filename;
                    ctrl.Cliente.TipoDocumentoINEP = fileObj.filetype;
                    ctrl.Cliente.Base64INEP = fileObj.base64;
                    $scope.archivoBase64 = fileObj.base64;
                    var archivo = {
                        Nombre: fileObj.filename,
                        base64: fileObj.base64,
                        tipo: fileObj.filetype,
                    }

                    ctrl.Cliente.documentoINEP = "data:" + archivo.tipo + ";base64," + archivo.base64;
                    console.log(ctrl.Cliente.documentoINEP);
                }

                if ($scope.caso == "Comprobante") {
                    var nombre = fileObj.filename;
                    ctrl.Cliente.NombreDocumentoComprobante = fileObj.filename;
                    ctrl.Cliente.TipoDocumentoComprobante = fileObj.filetype;
                    ctrl.Cliente.Base64Comprobante = fileObj.base64;
                    $scope.archivoBase64 = fileObj.base64;
                    var archivo = {
                        Nombre: fileObj.filename,
                        base64: fileObj.base64,
                        tipo: fileObj.filetype,
                    }

                    ctrl.Cliente.documentoComprobante = "data:" + archivo.tipo + ";base64," + archivo.base64;
                    console.log(ctrl.Cliente.documentoComprobante);
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

        function capturarCliente(nombre, apellido, celular, credito, ref1, ref2, ref1cel, ref2cel) {
            var d = new Date();
            var NoTimeDate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
            const input = document.getElementById('number-input');
            const texto = input.value.trim();

            

            console.log();
            if (typeof credito === 'string') {
                credito = credito.replace(/,/g, '');
            }
            console.log(credito);
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
            
            var datos = {
                Nombre: nombre,
                Apellido: apellido,
                Celular: celular,
                Estatus: ctrl.Cliente.estatus,
                Credito: credito,
                CreditoDisponible: credito,
                Ref1: ref1,
                Ref2: ref2,
                Ref1cel: ref1cel,
                Ref2cel: ref2cel,
                Fecha: NoTimeDate,
                NombreDocINEF: ctrl.Cliente.NombreDocumentoINEF,
                ArchivoINEF: ctrl.Cliente.documentoINEF,
                NombreDocINEP: ctrl.Cliente.NombreDocumentoINEP,
                ArchivoINEP: ctrl.Cliente.documentoINEP,
                NombreDocComprobante: ctrl.Cliente.NombreDocumentoComprobante,
                ArchivoComprobante: ctrl.Cliente.documentoComprobante
            }

            if (nombre == null || apellido == null || celular == null || credito == null || celular == "" || ctrl.Cliente.estatus == "Estatus*" || ctrl.Cliente.estatus == null || ctrl.Cliente.estatus == "") {

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
                Swal.fire({
                    title: 'Cargando',
                    imageHeight: 200,
                    imageAlt: 'Custom image',
                    showConfirmButton: false,
                    imageUrl: 'https://i.pinimg.com/originals/7b/73/6a/7b736a33be802fc2e737e3df56b4ef0e.gif',
                    background: 'rgb(0 29 48)',
                    color: 'white',
                })
                console.log(datos);
                common.agregarcliente(datos).then(function success(response) {
                    Swal.fire({
                        title: 'Cliente agregado',
                        background: 'rgb(0 29 48)',
                        color: 'white',
                        icon: 'success',
                        iconColor: 'rgb(40 255 40)',
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        showConfirmButton: false,
                        timer: 1500,
                    })
                    console.log(ref1, ref2, ref1cel, ref2cel);
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
                $timeout(function () {
                    $scope.currentPath = $location.path("/clientes-consulta");
                }, 0);
                
            }

        }

    }
    //Fin Funcion controlador

}());