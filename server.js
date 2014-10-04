var express = require('express');

var serverApp = express();
var port = process.env.PORT || 3030;

require('./server/config/express')(serverApp);
require('./server/config/mongoose')();
require('./server/config/routes')(serverApp);

serverApp.listen(port);
console.log("Server running on port:" + port);
