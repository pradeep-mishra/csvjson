csvjson
=======

csv to json and json to csv converter
-------------------------------------

&copy; Pradeep Mishra, Licensed under the MIT-LICENSE



Features
--------

* csv to json object
* csv to array object
* json object to csv
* array object to csv
 


Example usage
-------------

```javascript
var csvjson = require('csvjson');

/*
  sample.csv

  sr,name,age,gender
  1,rocky,33,male
  2,jacky,22,male
  3,suzy,21,female

*/

// convert csv data to array of json object 

csvjson.toObject('./sample.csv').output

/*
	return json object

	[
		{
			sr : 1,
			name : "rocky",
			age : 33,
			gender : "male"
		},
		{
			sr : 2,
			name : "jacky",
			age : 22,
			gender : "male"
		},
		{
			sr : 3,
			name : "suzy",
			age : 21,
			gender : "female"
		}

	]

*/

csvjson.toObject('./sample.csv').save('./sample.json');

// convert csv data to array of array object

csvjson.toArray('./sample.csv').output

/*
	return array object
	[
		["sr","name","age","gender"],
		["1","rocky","33","male"],
		["2","jacky","22","male"],
		["3","suzy","21","female"]
	]

*/

csvjson.toArray('./sample.csv').save('./sample.json');

// convert json object to csv data

csvjson.toCSV('./sample.json').output;

csvjson.toCSV('./sample.json').save('./sample.csv');

```

```bash
npm install csvjson --save
```
