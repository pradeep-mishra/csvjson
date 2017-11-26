var csvjson = require('./../index');
var data = require('fs').readFileSync(__dirname + '/qoutecsv.csv', { encoding : 'utf8'} );
console.log(csvjson.toObject(data, { quote : true} ));
