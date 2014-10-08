 //this service keep/cashes the current logged user and returns is he authenticated(exists)
 //injectirame $window obecta, za da mojem da vzemem tekushtia user, ako ima takav lognat
 //za da moje pri refresh na stranicata, sled kato servera ni izprati usera da znaem che veche sme lognati
app.factory('identity',['$window', function ($window) {

    console.log($window.bootstrappedZoroObject);
    return {
            //returns currentUser
        currentUser: $window.bootstrappedZoroObject,
            //returns true||flase if there is a currentUser
        isAuthenticated: function () {
            return !!this.currentUser;
        }
    }
}]);
