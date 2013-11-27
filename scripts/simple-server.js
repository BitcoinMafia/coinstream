#!/usr/bin/env node

var connect = require('connect');
var port = process.env.PORT || 3000
connect.createServer(
  connect.static("app")
).listen(port);
