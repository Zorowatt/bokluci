var mongoose = require('mongoose');

var searchBufferSchema = mongoose.Schema ({

    name: String,
    buffer: [String]

});

var SearchBuffer = mongoose.model('SearchBuffer',searchBufferSchema);

