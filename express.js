var newrelic = require('newrelic');

var express = require('express');
var WebSocketServer = require('ws').Server
var WebSocket = require('ws');
var path = require('path')
var http = require('http')
var geoip = require("geoip");
var app = express();

// Express Config
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// Start Server
var server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

// Routes: Main App
app.get("/", function(req, res){
  res.sendfile("views/index.html")
})

app.get('/partials/:name', function(req, res) {
	var name = req.params.name;
  res.sendfile('views/partials/' + name);
});


// Routes: IP Lookup API
var geoipCity = new geoip.City("public/lib/3p/GeoLiteCity.dat")
app.get('/iplookup/:ip', function(req, res) {
  var ip = req.params.ip

  geoipCity.lookup(ip, function(err, data) {
    if (err) {res.send(err)}
    if (data) {res.send(data)}
  })
});


// // Socket Server
var wss = new WebSocketServer({
	server: server
});
console.log('websocket server created');
wss.broadcast = function(data) {
	// console.log(this)
    for (i in this.clients) {
    	this.clients[i].send(JSON.stringify(data));
    }
};

wss.on('connection', function(ws) {
	console.log('websocket connection opened');
  ws.on('close', function() {
    console.log('websocket connection closed');
  });
});


// Socket Client
function start(location){
  BlockchainSocket = new WebSocket(location)

  BlockchainSocket.onopen = function(msg) {
		console.log("Blockchain.info Connected!")
		BlockchainSocket.send(JSON.stringify({
			"op":"unconfirmed_sub"
		}))
	}

  BlockchainSocket.onmessage = function(msg) {
		var data = (new BlockchainInfo(msg)).parseTransaction()

		// if (data.value > 25 * 100000000) {
		// 	console.log(data)
		// }
		// console.log(wss)
		wss.broadcast(data)

}


  BlockchainSocket.onclose = function(){
      //try to reconnect in 5 seconds
    setTimeout(function(){start(location)}, 5000);
  };
}

start("ws://ws.blockchain.info/inv")


// Array Helper Module

var ArrayHelper = {
	uniq: function(array){
		var u = {}, a = [];
		for(var i = 0, l = array.length; i < l; ++i){
			if(u.hasOwnProperty(array[i])) {
				continue;
			}
			a.push(array[i]);
			u[array[i]] = 1;
		}
		return a;
	},
	sum: function(array, key) {
		var sum = 0
		for (i in array) {
			if (array.hasOwnProperty(i)) {
				sum += parseFloat(array[i][key])
			}
		}
		return sum
	}
}

// Services

var BlockchainInfo = function(msg) {
	this.data = JSON.parse(msg.data).x
}

BlockchainInfo.prototype = {
	parseTransaction: function() {
		var self = this
		var data = self.data
		var geoData = geoipCity.lookupSync(data.relayed_by) || {};

		return {
			"time": data.time,
			"ip": data.relayed_by,
			"hash": data.hash,
			"numInputs": data.vin_sz,
			"numOutputs": data.vout_sz,
			"firstOutput": data.out[0].value, // first output
			"value": ArrayHelper.sum(data.out, "value"),
			"fee": self.calculateFee(data),
			"addresses": self.concatAddresses(data),
			"map": Object.keys(geoData).length !== 0,
			"longitude": geoData.longitude + Math.random()/100000, // Hack, no dups
			"latitude": geoData.latitude + Math.random()/100000, // Hack, no dups
			"city": geoData.city,
			"country": geoData.country_name,
		}
	},
	concatAddresses: function(data) {
		var addresses = []

		data.inputs.forEach(function(o){
			addresses.push(o.prev_out.addr)
		})

		data.out.forEach(function(o){
			addresses.push(o.addr)
		})

	 	return ArrayHelper.uniq(addresses)
	},
	calculateFee: function(data) {
		var totalFee = 0

		data.inputs.forEach(function(i) {
			totalFee += i.prev_out.value
		})

		data.out.forEach(function(i) {
			totalFee -= i.value
		})
		return totalFee
	}
}
