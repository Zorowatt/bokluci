app.controller('ProductCtrl',['$scope', '$http',  'productsCRUD','$upload','identity' , function($scope, $http,  productsCRUD, $upload, identity) {


    var fff = [];

    $scope.myThumbnail = false;
    var p = {
        name : '',
        productModel: '',
        maker: '',
        origin: '',
        reseller: {
            name: '',
            town: '',
            price: '',
            dateBought: ''
        }

    };
    $scope.product = p;
    $scope.proscon = '';
    $scope.conscon = '';
    $scope.error = 'No file selected';

    $('.prevImg').attr('src','');

    $scope.removeImage = function(){
        $('.prevImg').attr('src','');
        $scope.myThumbnail = false;
        $scope.product.filedata = '';
        //$scope.$apply();
    };

    $scope.onFileSelect = function ($file) {

            fff = $file;
            var file = $file[0];
            var f = true;
            if (file.type.indexOf('image') == -1) {
                $scope.error = 'image extension not allowed, please choose a JPEG or PNG file.';
                f = false;
                // this string represents Red Dot
                //$scope.product.filedata = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
            }
            if (file.size > 5000000){
                $scope.error ='File size cannot exceed 5 MB!';
                f = false;
                // this string represents Red Dot
                //$scope.product.filedata = "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
            }
            if (f) {
                $scope.error ='File OK and ready for uploading!';
                var fileReader = new FileReader();
                fileReader.readAsDataURL($file[0]);
                fileReader.onload = function (e) {
                    $scope.product.filename = file.name;
                    $scope.myThumbnail = true;
                    $('.prevImg').attr('src',e.target.result);
                    $scope.$apply();
                }
            }
    };

    $scope.addProduct = function (product) {
        //if image exists
        if (!!$('#zozo').attr('src')){
                if (confirm('Are you sure you want to save this thing into the database?')) {
                    // Save it!
                    if (!!$scope.product.name) {
                        //TODO validate all product fields
                        var pp = {
                            name : $scope.product.name,
                            productModel: $scope.product.productModel || '--',
                            maker: $scope.product.maker || '--',
                            origin: $scope.product.origin || '--',
                            reseller: {
                                name: $scope.product.reseller.name || '--',
                                town: $scope.product.reseller.town || '--',
                                price: $scope.product.reseller.price || '--',
                                dateBought: $scope.product.reseller.dateBought || '--'
                            },
                            pros: [{userAdded: identity.currentUser.username,
                                dateAdded: new Date(),
                                content: $scope.proscon || '--',
                                flagIsNew: true}],
                            cons: [{userAdded: identity.currentUser.username,
                                dateAdded: new Date(),
                                content: $scope.conscon || '--',
                                flagIsNew: true}],
                            id : 99,
                            userAdded : identity.currentUser.username,
                            dateAdded : new Date(),
                            flagIsNew : true,
                            flagNewCommentAdded : true,
                            picture:[{
                                filename : $scope.product.filename,
                                dateAdded: new Date(),
                                userAdded: identity.currentUser.username
                            }],
                            keyWords: ['n/a'],
                            category: ['n/a']
                        };

                        //Uploads product
                        //productsCRUD.create(pp);

                        //Uploads image/as file and product/as data
                        $upload.upload({
                        url: '/upload_image',
                        file: fff[0],
                        data: pp,
                        progress: function(e){}
                    }).then(function(data, status, headers, config) {
                        // file is uploaded successfully
                        //console.log(data);
                    });
                        $scope.product.name = '';
                        $scope.product.productModel = '';
                        $scope.product.maker = '';
                        $scope.product.origin = '';
                        $scope.product.reseller.name = '';
                        $scope.product.reseller.town = '';
                        $scope.product.reseller.price = '';
                        $scope.product.reseller.dateBought = '';
                        $scope.proscon = '';
                        $scope.conscon = '';
                        $('.prevImg').attr('src','');
                        $scope.myThumbnail = false;
                        $scope.error = 'No file selected';
                        alert('Product created!');
                    }
                    else {
                        alert('Write some name!');
                    }
                }
        }
        //if no image exists
        else{
            if (confirm('Are you sure you want to save this thing into the database?')) {
                // Save it!
                if (!!$scope.product.name) {

                    //TODO validate all product fields

                    var pp = {
                        name : $scope.product.name,
                        productModel: $scope.product.productModel || '--',
                        maker: $scope.product.maker || '--',
                        origin: $scope.product.origin || '--',
                        reseller: {
                            name: $scope.product.reseller.name || '--',
                            town: $scope.product.reseller.town || '--',
                            price: $scope.product.reseller.price || '--',
                            dateBought: $scope.product.reseller.dateBought || '--'
                        },
                        pros: [{userAdded: identity.currentUser.username,
                            dateAdded: new Date(),
                            content: $scope.proscon || '--',
                            flagIsNew: true}],
                        cons: [{userAdded: identity.currentUser.username,
                            dateAdded: new Date(),
                            content: $scope.conscon || '--',
                            flagIsNew: true}],
                        picture:[{
                            filename : 'noPicture',
                            dateAdded: new Date(),
                            userAdded: identity.currentUser.username
                        }],
                        id : 99,
                        userAdded : identity.currentUser.username,
                        dateAdded : new Date(),
                        flagIsNew : true,
                        flagNewCommentAdded : true,
                        keyWords: ['n/a'],
                        category: ['n/a']
                    };

                    //productsCRUD.create(pp);

                    //Uploads product/as data
                    $upload.upload({
                        url: '/upload_image',
                        //file: fff[0],
                        data: pp,
                        progress: function(e){}
                    }).then(function(data, status, headers, config) {
                        // file is uploaded successfully
                        //console.log(data);
                    });
                    $scope.product.name = '';
                    $scope.product.productModel = '';
                    $scope.product.maker = '';
                    $scope.product.origin = '';
                    $scope.product.reseller.name = '';
                    $scope.product.reseller.town = '';
                    $scope.product.reseller.price = '';
                    $scope.product.reseller.dateBought = '';
                    $scope.proscon = '';
                    $scope.conscon = '';
                    $('.prevImg').attr('src','');
                    $scope.myThumbnail = false;
                    $scope.error = 'No file selected';
                    alert('Product created!');
                }
                else {
                    alert('Write some name!');
                }
            }
        }
    }
}]);
