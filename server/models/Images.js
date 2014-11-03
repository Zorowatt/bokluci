var mongoose = require('mongoose');

var imageSchema = mongoose.Schema ({
    name: String,
    dataFile: Buffer,
    dataThumb: Buffer,
    contentType: String,
    ready: Boolean

});

var Images = mongoose.model('Images',imageSchema);