(function () {


    angular.module("myApp").controller('creditosConCtrl', creditosConCtrl);
    creditosConCtrl.$inject = ['$scope', '$rootScope', "commonFactory", "$firebaseArray", "$timeout", "$location"];
    //Inicio Funcion controlador
    function creditosConCtrl($scope, $rootScope, common, $firebaseArray, $timeout, $location) {
        var ctrl = this;
        ////Variables////
        var ref = firebase.database().ref("/creditos");
        $scope.ListadoCreditos = $firebaseArray(ref);
        console.log($scope.ListadoClientes);
        //////funciones//////
        ctrl.descargarArchivo = descargarArchivo;
        ctrl.htmlTableToExcel = htmlTableToExcel;
        ctrl.doSearch = doSearch;
        ctrl.Ver = Ver;
        ctrl.Editar = Editar;
        ctrl.RealizarPago = RealizarPago;
        ctrl.CreditoDisponible = "";
        $scope.removeproducto = removeproducto;
        ctrl.emailVer = localStorage.getItem('email');
        if (ctrl.emailVer == "" || ctrl.emailVer == undefined || ctrl.emailVer == null) {
            $scope.currentPath = $location.path("/login");
        }

        function Ver(id) {

            localStorage.setItem('$id', id);
            console.log(id);
            $timeout(function () {
                $scope.currentPath = $location.path("/creditos-Ver");
            }, 0);

        }

        function RealizarPago(id, credito) {

            localStorage.setItem('$id', id);
            console.log(id);
            Swal.fire({
                title: 'Ingrese dos valores:',
                html:
                    '<input id="valor1" class="swal2-input" placeholder="Valor 1">' +
                    '<input id="valor2" class="swal2-input" placeholder="Valor 2">',
                focusConfirm: false,
                preConfirm: () => {
                    const valor1 = Swal.getPopup().querySelector('#valor1').value;
                    const valor2 = Swal.getPopup().querySelector('#valor2').value;
                    return [valor1, valor2];
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const valor1 = result.value[0];
                    const valor2 = result.value[1];
                    console.log('El valor 1 es:', valor1);
                    console.log('El valor 2 es:', valor2);
                }
            });
            Swal.fire({
                title: 'Cantidad a pagar:',
                html:
                    '<input id="valor1" class="swal2-input" placeholder="Cantidad">' +
                    '<input id="valor2" class="swal2-input" placeholder="Nota">' +
                    '<input id="fecha" class="swal2-input" type="date" min="2023-01-01" max="2023-12-31">',
                focusConfirm: false,
                preConfirm: () => {
                    const valor1 = Swal.getPopup().querySelector('#valor1').value;
                    const valor2 = Swal.getPopup().querySelector('#valor2').value;
                    const fecha = Swal.getPopup().querySelector('#fecha').value;
                    return [valor1, valor2, fecha];
                }
            }).then((result) => {
                // Mostrar el resultado después de guardar el texto
                if (result.isConfirmed) {
                    const valor1 = result.value[0];
                    const valor2 = result.value[1];
                    const fecha = result.value[2];
                    console.log('Cantidad:', valor1);
                    console.log('Nota:', valor2);
                    console.log('La fecha es:', fecha);
                    var d = new Date();
                    var NoTimeDate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();

                    ref.orderByKey().once("value", function (data) {
                        try {
                            var encontrado = false;

                            data.forEach(function (data) {
                                if (encontrado) {
                                    return; // si ya se encontró, se sale de la iteración
                                }

                                if (data.key == id) {
                                    console.log(data.val());
                                    ctrl.deudaVer = parseInt(data.val().Deuda);

                                    if (ctrl.deudaVer < parseInt(valor1)) {
                                        console.log(ctrl.deudaVer);
                                        Swal.fire({
                                            title: "La cantidad es mayor, intentelo de nuevo",
                                            icon: 'error',
                                            imageHeight: 200,
                                            imageAlt: 'Custom image',
                                            showConfirmButton: false,
                                            timer: 1500,
                                        })
                                    } else {
                                        ctrl.Deuda = parseInt(data.val().Deuda) - parseInt(valor1);
                                        ctrl.Cliente = data.val().Cliente;
                                        ctrl.idCliente = data.val().idCliente;
                                        ctrl.idPrestamo = data.val().id;
                                        ctrl.deudavalor = parseInt(data.val().Deuda);
                                        ctrl.deudavalor2 = parseInt(valor1);
                                        ctrl.Prestamo = parseInt(data.val().Prestamo);
                                        console.log(ctrl.Deuda);
                                        console.log(data.val().Deuda);
                                        firebase.database().ref().child('/creditos/' + id)
                                            .update({
                                                Deuda: ctrl.Deuda
                                            });
                                        var datos = {
                                            Fecha: fecha,
                                            CantidadPagada: parseInt(valor1),
                                            Nota: valor2,
                                            Cliente: ctrl.Cliente,
                                            idCliente: ctrl.idCliente,
                                            idPrestamo: ctrl.idPrestamo
                                        }

                                        if (ctrl.deudavalor == ctrl.deudavalor2) {
                                            debugger;
                                            var ref2 = firebase.database().ref("/clientes");
                                            ref2.orderByKey().once("value", function (data) {
                                                try {
                                                    var encontrado2 = false;

                                                    data.forEach(function (data) {
                                                        if (encontrado2) {
                                                            return; // si ya se encontró, se sale de la iteración
                                                        }
                                                        if (data.key == ctrl.idCliente) {
                                                            console.log(data.val());
                                                            ctrl.CreditoDisponible = parseInt(data.val().CreditoDisponible) + ctrl.Prestamo;
                                                            console.log(ctrl.CreditoDisponible);
                                                            console.log(ctrl.Prestamo);
                                                            firebase.database().ref().child('/clientes/' + ctrl.idCliente)
                                                                .update({
                                                                    CreditoDisponible: ctrl.CreditoDisponible
                                                                });
                                                            $scope.ListadoCreditos.$remove(credito);
                                                            encontrado2 = true; // se marca como encontrado
                                                        }
                                                    });
                                                } catch (e) {
                                                    if (e !== BreakException) throw e;
                                                }

                                            });

                                        }

                                        common.RegistrarPago(datos).then(function success(response) {
                                            Swal.fire({
                                                title: '¡Pago realizado!',
                                                text: 'Cantidad: ' + result.value[0],
                                                icon: 'success'
                                            });
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
                                    }
                                    encontrado = true; // se marca como encontrado
                                }
                            });
                        } catch (e) {
                            if (e !== BreakException) throw e;
                        }

                    });

                }
            });

        }

        function Editar(id) {

            localStorage.setItem('$id', id);
            console.log(id);
            $timeout(function () {
                $scope.currentPath = $location.path("/creditos-editar");
            }, 0);

        }

        function removeproducto(credito, prestamo, id) {
            Swal.fire({
                title: 'Estas seguro?',
                text: "Estas apunto de borrar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Si'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: '',
                        text: 'Credito removido.',
                        icon: 'success',
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        showConfirmButton: false,
                        timer: 1500,
                    })
                    var ref2 = firebase.database().ref("/clientes");
                    ref2.orderByKey().once("value", function (data) {
                        try {
                            var encontrado = false;

                            data.forEach(function (data) {
                                if (encontrado) {
                                    return; // si ya se encontró, se sale de la iteración
                                }
                                if (data.key == id) {
                                    console.log(data.val());
                                    ctrl.CreditoDisponible = parseInt(data.val().CreditoDisponible) + parseInt(prestamo);
                                    console.log(ctrl.CreditoDisponible);
                                    console.log(prestamo);
                                    firebase.database().ref().child('/clientes/' + id)
                                        .update({
                                            CreditoDisponible: ctrl.CreditoDisponible
                                        });
                                    encontrado = true; // se marca como encontrado
                                }
                            });
                        } catch (e) {
                            if (e !== BreakException) throw e;
                        }

                    });
                    $scope.ListadoCreditos.$remove(credito);

                }
            })



        }

        function htmlTableToExcel(type) {
            var data = document.getElementById('tblToExcl');
            var excelFile = XLSX.utils.table_to_book(data, { sheet: "sheet1" });
            XLSX.write(excelFile, { bookType: type, bookSST: true, type: 'base64' });
            XLSX.writeFile(excelFile, 'ExportedFile:HTMLTableToExcel.' + type);
        }

        function descargarArchivo(Archivo, Tipo, Nombre) {

            debugger;
            //ctrl.modelo.archivo = taller.Documento;
            //ctrl.modelo.tipo = TipoDocumento;
            var blob = b64toBlob(Archivo, Tipo);


            ////////////////////
            var blobUrl = URL.createObjectURL(blob);
            /////$scope.content = $sce.trustAsResourceUrl(fileURL);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.href = blobUrl;
            a.download = Nombre;
            a.click();
        }

        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }

        function doSearch() {
            const tableReg = document.getElementById('tblToExcl');
            const searchText = document.getElementById('searchTerm2').value.toLowerCase();
            let total = 0;
            let columnTotal = 0; // variable para almacenar la suma de los valores de la columna

            // Recorremos todas las filas con contenido de la tabla
            for (let i = 1; i < tableReg.rows.length; i++) {
                // Si el td tiene la clase "noSearch" no se busca en su cntenido
                if (tableReg.rows[i].classList.contains("noSearch")) {
                    continue;
                }

                let found = false;
                const cellsOfRow = tableReg.rows[i].getElementsByTagName('td');
                // Recorremos todas las celdas
                for (let j = 0; j < cellsOfRow.length && !found; j++) {
                    const compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                    // Buscamos el texto en el contenido de la celda
                    if (searchText.length == 0 || compareWith.indexOf(searchText) > -1) {
                        found = true;
                        total++;
                        // Si encontramos una coincidencia, sumamos el valor de la columna
                        const columnValue = cellsOfRow[10].textContent.trim(); // Suponiendo que la columna que quieres sumar es la tercera (índice 2)
                        const columnNumber = Number(columnValue); // Convertimos el valor de la columna a un número
                        if (!isNaN(columnNumber)) { // Verificamos que el valor de la columna sea numérico
                            columnTotal += columnNumber;
                        }
                    }
                }

                if (found) {
                    tableReg.rows[i].style.display = '';
                } else {
                    // si no ha encontrado ninguna coincidencia, esconde la fila de la tabla
                    tableReg.rows[i].style.display = 'none';
                }
            }

            // mostramos las coincidencias y la suma de la columna
            const lastTR = tableReg.rows[tableReg.rows.length - 1];
            const td = lastTR.querySelector("td");
            lastTR.classList.remove("hide", "red");
            if (searchText == "") {
                lastTR.classList.add("hide");
            } else if (total) {
                td.innerHTML = `Se han encontrado ${total} coincidencia${total > 1 ? 's' : ''}, Total a cobrar: $${columnTotal}.`;
            } else {
                lastTR.classList.add("red");
                td.innerHTML = "No se han encontrado coincidencias";
            }
        }

    }
    //Fin Funcion controlador
}());