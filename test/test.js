var csvjson = require('../index');
var headers = "sr,name,age,gender";
var fs = require('fs');
var content = fs.readFileSync('./sample.csv', { encoding : 'utf8' });

console.log(csvjson.toColumnArray(content, {headers : headers}));