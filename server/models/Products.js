var mongoose = require('mongoose');

var productSchema = mongoose.Schema ({

    name: String,
    pros:[{
        //userAdded: String,
        dateAdded: Date,
        content: String,
        flagIsNew : Boolean
//        comments: [{
//            comment: String,
//            flagIsNew: Boolean
//        }]
    }],
    cons: [{
        //userAdded: String,
        dateAdded: Date,
        content: String,
        flagIsNew : Boolean
//        comments: [{
//            comment: String,
//            flagIsNew: Boolean
//        }]

    }],
//    picture: [{
//        filename: String,
//        dateAdded: Date
//        //userAdded: String
//    }],
    productNew: Boolean,
    consCount: Number,
    prosCount: Number,
    thumbnail: String,
    //id: Number,
    keyWords: [String],
    //userAdded: String,
    dateAdded: Date,
    category: [String],
    flagIsNew: Boolean,
    flagNewCommentAdded: Boolean
});

var Product = mongoose.model('Product',productSchema);


//module.exports.seedInitialProducts = function() {
//    Product.find({}).exec(function(err, collection) {
//            if (err) {
//                console.log('Cannot find Product: ' + err);
//                return;
//            }
//
//            // if you want to clear the DB and push same data to it just remove the "//", each
//            //Product.remove(function(){
//
//            if (collection.length === 0) {
//                Product.create(
//                    {
//                    name: '1 Пробивна машина',
//                    origin: 'Китай',
//                    maker: 'Budget',
//                    productModel: 'DG1234',
//                    reseller: {
//                        name: 'Практикер',
//                        town: 'Варна',
//                        dateBought: '24.12.2012',
//                        price: '60 лв.'
//                    },
//                    pros:[
//                        {userAdded: 'аз',
//                        dateAdded: 'ТОДО date',
//                        content: 'След 2 години все още работи',
//                        flagIsNew : false}
//                        ],
//                    cons: [
//                        {userAdded: 'аз',
//                        dateAdded: 'ТОДО date',
//                        content: 'На второто ползване се счупи патронника',
//                        flagIsNew : false
//                        },
//                        {userAdded: 'аз',
//                        dateAdded: 'ТОДО',
//                        content: 'Незадържа свредлото',
//                        flagIsNew : false}
//                        ],
//                    picture: [{
//                        filename: 'TODOpicture.jpg',
//                        dateAdded: 'ТОДО date',
//                        userAdded: 'ТОДО username'
//                    }],
//
//                    id: 1,
//                    keyWords: ['Къртач','Пробивна Машина'],
//                    userAdded: 'TODOuseradded',
//                    dateAdded: 'ТОДО date',
//                    category: ['home','tools','къртач'],
//                    flagIsNew: false,
//                });
//
//                Product.create(
//                    {
//                        name: '2 Матрак',
//                        origin: 'BG',
//                        maker: 'matraci TED',
//                        productModel: 'Tai SPA',
//                        reseller: {
//                            name: 'oficialen predstavitel',
//                            town: 'Варна',
//                            dateBought: '24.12.2012',
//                            price: '1000 лв.'
//                        },
//                        pros:[
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО date',
//                                content: 'Нещо хубаво',
//                                flagIsNew : false}
//                        ],
//                        cons: [
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО date',
//                                content: 'Вътрешният чаршаф не е обкантен',
//                                flagIsNew : false
//                            },
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО',
//                                content: 'Матракът хлътна по средата',
//                                flagIsNew : false},
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО',
//                                content: 'След изпиране облицовката се сви',
//                                flagIsNew : false}
//                        ],
//                        picture: [{
//                            filename: 'TODOpicture.jpg',
//                            dateAdded: 'ТОДО date',
//                            userAdded: 'ТОДО username'
//                        }],
//
//                        id: 2,
//                        keyWords: ['марак','спален дюшек'],
//                        userAdded: 'TODO useradded',
//                        dateAdded: 'ТОДО date',
//                        category: ['home','badroom', 'bed'],
//                        flagIsNew: false
//                    });
//                Product.create(
//                    {
//                        name: '3 Пробивна машина',
//                        origin: 'Китай',
//                        maker: 'Budget',
//                        productModel: 'DG1234',
//                        reseller: {
//                            name: 'Практикер',
//                            town: 'Варна',
//                            dateBought: '24.12.2012',
//                            price: '60 лв.'
//                        },
//                        pros:[
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО date',
//                                content: 'След 2 години все още работи',
//                                flagIsNew : false}
//                        ],
//                        cons: [
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО date',
//                                content: 'На второто ползване се счупи патронника',
//                                flagIsNew : false
//                            },
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО',
//                                content: 'Незадържа свредлото',
//                                flagIsNew : false}
//                        ],
//                        picture: [{
//                            filename: 'TODOpicture.jpg',
//                            dateAdded: 'ТОДО date',
//                            userAdded: 'ТОДО username'
//                        }],
//
//                        id: 3,
//                        keyWords: ['Къртач','Пробивна Машина'],
//                        userAdded: 'TODOuseradded',
//                        dateAdded: 'ТОДО date',
//                        category: ['home','tools','къртач'],
//                        flagIsNew: false,
//                    });
//
//                Product.create(
//                    {
//                        name: '4 Матрак',
//                        origin: 'BG',
//                        maker: 'matraci TED',
//                        productModel: 'Tai SPA',
//                        reseller: {
//                            name: 'oficialen predstavitel',
//                            town: 'Варна',
//                            dateBought: '24.12.2012',
//                            price: '1000 лв.'
//                        },
//                        pros:[
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО date',
//                                content: 'Нещо хубаво',
//                                flagIsNew : false}
//                        ],
//                        cons: [
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО date',
//                                content: 'Вътрешният чаршаф не е обкантен',
//                                flagIsNew : false
//                            },
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО',
//                                content: 'Матракът хлътна по средата',
//                                flagIsNew : false},
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО',
//                                content: 'След изпиране облицовката се сви',
//                                flagIsNew : false}
//                        ],
//                        picture: [{
//                            filename: 'TODOpicture.jpg',
//                            dateAdded: 'ТОДО date',
//                            userAdded: 'ТОДО username'
//                        }],
//
//                        id: 4,
//                        keyWords: ['марак','спален дюшек'],
//                        userAdded: 'TODO useradded',
//                        dateAdded: 'ТОДО date',
//                        category: ['home','badroom', 'bed'],
//                        flagIsNew: false
//                    });
//                Product.create(
//                    {
//                        name: '5 Пробивна машина',
//                        origin: 'Китай',
//                        maker: 'Budget',
//                        productModel: 'DG1234',
//                        reseller: {
//                            name: 'Практикер',
//                            town: 'Варна',
//                            dateBought: '24.12.2012',
//                            price: '60 лв.'
//                        },
//                        pros:[
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО date',
//                                content: 'След 2 години все още работи',
//                                flagIsNew : false}
//                        ],
//                        cons: [
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО date',
//                                content: 'На второто ползване се счупи патронника',
//                                flagIsNew : false
//                            },
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО',
//                                content: 'Незадържа свредлото',
//                                flagIsNew : false}
//                        ],
//                        picture: [{
//                            filename: 'TODOpicture.jpg',
//                            dateAdded: 'ТОДО date',
//                            userAdded: 'ТОДО username'
//                        }],
//
//                        id: 5,
//                        keyWords: ['Къртач','Пробивна Машина'],
//                        userAdded: 'TODOuseradded',
//                        dateAdded: 'ТОДО date',
//                        category: ['home','tools','къртач'],
//                        flagIsNew: false,
//                    });
//
//                Product.create(
//                    {
//                        name: '6 Матрак',
//                        origin: 'BG',
//                        maker: 'matraci TED',
//                        productModel: 'Tai SPA',
//                        reseller: {
//                            name: 'oficialen predstavitel',
//                            town: 'Варна',
//                            dateBought: '24.12.2012',
//                            price: '1000 лв.'
//                        },
//                        pros:[
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО date',
//                                content: 'Нещо хубаво',
//                                flagIsNew : false}
//                        ],
//                        cons: [
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО date',
//                                content: 'Вътрешният чаршаф не е обкантен',
//                                flagIsNew : false
//                            },
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО',
//                                content: 'Матракът хлътна по средата',
//                                flagIsNew : false},
//                            {userAdded: 'аз',
//                                dateAdded: 'ТОДО',
//                                content: 'След изпиране облицовката се сви',
//                                flagIsNew : false}
//                        ],
//                        picture: [{
//                            filename: 'TODOpicture.jpg',
//                            dateAdded: 'ТОДО date',
//                            userAdded: 'ТОДО username'
//                        }],
//
//                        id: 6,
//                        keyWords: ['марак','спален дюшек'],
//                        userAdded: 'TODO useradded',
//                        dateAdded: 'ТОДО date',
//                        category: ['home','badroom', 'bed'],
//                        flagIsNew: false
//                    });
//                console.log('New products added to DB ... ');
//            }
//        });
//};
