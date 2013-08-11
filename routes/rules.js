var util = require('util');
var soap = require('soap');

exports.fire = function(req, res){
  	var soap = require('soap');
	var url = "http://localhost:9999/ws/rules/fire?wsdl";

	var args = {name:'test'};

	var client = soap.createClient(url, function(err, client){
		console.log(client);
		if (err) throw err;
	    client.DroolsImplService.DroolsImplPort.fireRules(null, function(err, result){
	            // if (err) throw err;
	            console.log(result);
	            console.log(client.describe());
	            console.log(err);
	    });
	});
  // res.render('read', { title: 'Fire Rule' });
  res.send(client);
};


// WORKING - Existing SOAP service
// var url = "http://www.restfulwebservices.net/wcf/StockQuoteService.svc?wsdl";

// var args = {"tns:request":"GOOG"};

// var client = soap.createClient(url, function(err, client){

//     client.StockQuoteService.BasicHttpBinding_IStockQuoteService.GetStockQuote(args, function(err, result){
//             if (err) throw err;
//             console.log(result);
//     });
//  });
