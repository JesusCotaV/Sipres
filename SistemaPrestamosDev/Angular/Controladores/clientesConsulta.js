(function () {


    angular.module("myApp").controller('clientesConCtrl', clientesConCtrl);
    clientesConCtrl.$inject = ['$scope', '$rootScope', "commonFactory", "$firebaseArray","$timeout","$location"];
    //Inicio Funcion controlador
    function clientesConCtrl($scope, $rootScope, common, $firebaseArray,$timeout,$location) {
        var ctrl = this;
        ////Variables////
        var ref = firebase.database().ref("/clientes");
        $scope.ListadoClientes = $firebaseArray(ref);
        console.log($scope.ListadoClientes);
        //////funciones//////
        ctrl.descargarArchivo = descargarArchivo;
        ctrl.htmlTableToExcel = htmlTableToExcel;
        ctrl.doSearch = doSearch;
        ctrl.Ver = Ver;
        ctrl.Editar = Editar;
        $scope.removeproducto = removeproducto;
        ctrl.emailVer = localStorage.getItem('email');
        if (ctrl.emailVer == "" || ctrl.emailVer == undefined || ctrl.emailVer == null) {
            $scope.currentPath = $location.path("/login");
        }

        function Ver(id) {

            localStorage.setItem('$id', id);
            console.log(id);
            $timeout(function () {
                $scope.currentPath = $location.path("/clientes-Ver");
            }, 0);

        }

        function Editar(id) {

            localStorage.setItem('$id', id);
            console.log(id);
            $timeout(function () {
                $scope.currentPath = $location.path("/clientes-editar");
            }, 0);

        }

        function removeproducto(cliente) {
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
                        text: 'Cliente removido.',
                        icon: 'success',
                        imageHeight: 200,
                        imageAlt: 'Custom image',
                        showConfirmButton: false,
                        timer: 1500,
                    })
        
                    $scope.ListadoClientes.$remove(cliente);
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

                    }

                }

                if (found) {

                    tableReg.rows[i].style.display = '';

                } else {

                    // si no ha encontrado ninguna coincidencia, esconde la

                    // fila de la tabla

                    tableReg.rows[i].style.display = 'none';

                }

            }



            // mostramos las coincidencias

            const lastTR = tableReg.rows[tableReg.rows.length - 1];

            const td = lastTR.querySelector("td");

            lastTR.classList.remove("hide", "red");

            if (searchText == "") {

                lastTR.classList.add("hide");

            } else if (total) {

                td.innerHTML = "Se ha encontrado " + total + " coincidencia" + ((total > 1) ? "s" : "");

            } else {

                lastTR.classList.add("red");

                td.innerHTML = "No se han encontrado coincidencias";

            }

        }


    }
    //Fin Funcion controlador
}());