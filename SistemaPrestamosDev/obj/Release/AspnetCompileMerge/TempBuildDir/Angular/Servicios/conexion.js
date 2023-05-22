(function () {
    angular.module('myApp').config(function () {

        var config = {

            // For Firebase JS SDK v7.20.0 and later, measurementId is optional

                apiKey: "AIzaSyBxKz77wiouBLj06iDmmWoyL9JRjjj0Jtw",
                authDomain: "sistema-de-prestamos-dev.firebaseapp.com",
                databaseURL: "https://sistema-de-prestamos-dev-default-rtdb.firebaseio.com",
                projectId: "sistema-de-prestamos-dev",
                storageBucket: "sistema-de-prestamos-dev.appspot.com",
                messagingSenderId: "180251260428",
                appId: "1:180251260428:web:8bf2df2ca1c7f496e42029",
                measurementId: "G-7D12Q9KZFP"
   
        };
        firebase.initializeApp(config);
    });
}());