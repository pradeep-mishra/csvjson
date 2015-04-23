[![NPM](https://nodei.co/npm/csvjson.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/csvjson/)&nbsp;&nbsp;
[![Build Status](https://travis-ci.org/pradeep-mishra/csvjson.svg?branch=master)](https://travis-ci.org/pradeep-mishra/csvjson)

csvjson
=======

csv to json and json to csv converter
-------------------------------------

&copy; Pradeep Mishra, Licensed under the MIT-LICENSE



Features
--------

* csv to json object
* csv to schema json object
* csv to array object
* csv to column array object
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


/*
    schema_sample.csv
   
    created,contact.name,contact.age+,contact.number+,address[],address[],contact.hobbies[],contact.hobbies[],-id
    2014-11-12,Pradeep,25,4352436,MG Road,Mumbai,pc games,guitar,5
    2014-10-06,Arnav,16,7364537,KB Road,Mumbai,pc games,traveling,7


*/
```

convert csv data to json object 
----------------------------------------
```javascript
csvjson.toObject('./sample.csv').output

/*
	return 

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

```
convert csv data to schema json object 
-----------------------------------------------
```javascript

/*
    for creating schema of json object following key can be used in header of csv file:
    
    .   for defining nested json object
    []  for defining data as array (suffix)
        -- can add delimiter in the array (i.e. [;] for delimiter of ;)
        -- can nest objects in the array, index must be listed (i.e. [1] for index 1)
    +   for defining data as integer (suffix)
    -   for omitting data from result output (prefix)

*/


/*
    schema_sample.csv
   
    created,contact.name,contact.age+,contact.number+,address[],address[],contact.hobbies[;],-id,friends[0].name,friends[0].phone,friends[1].name,friends[1].phone
    2014-11-12,Pradeep,25,4352436,MG Road,Mumbai,pc games; guitar,5,Jeff,8761234567,Mike,1234567890
    2014-10-06,Arnav,16,7364537,KB Road,Mumbai,pc games; traveling,7,Steve,555555555,Pradeep,4352436

*/

csvjson.toSchemaObject('./schema_sample.csv').output

/*
    return
    
    [
        {
            "created":"2014-11-12",
            "contact":{
                "name":"Pradeep","
                age":25,
                "number":4352436,
                "hobbies":["pc games","guitar"]
                
            },
            "address":["MG Road","Mumbai"],
            "friends":[
                {
                    "name": "Jeff",
                    "phone": "8761234567"
                },
                {
                    "name": "Mike",
                    "phone": "1234567890"
                }
            ]
        },
        {
            "created":"2014-10-06",
            "contact":{"
                name":"Arnav",
                "age":16,
                "number":7364537,
                "hobbies":["pc games","traveling"]
                
            },
            "address":["KB Road","Mumbai"],
            "friends":[
                {
                    "name": "Steve",
                    "phone": "5555555555"
                },
                {
                    "name": "Pradeep",
                    "phone": "4352436"
                }
            ]
        }
        
    ]


*/

csvjson.toSchemaObject('./schema_sample.csv').save('./schema_sample.json');

```
convert csv data to array object
-----------------------------------------
```javascript
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

```
convert csv data to column array object
---------------------------------------
```javascript
csvjson.toColumnArray('./sample.csv').output

/*
	return 

	{ 
	    sr: [ '1', '2', '3' ],
        name: [ 'rocky', 'jacky', 'suzy' ],
        age: [ '33', '22', '21' ],
        gender: [ 'male', 'male', 'female' ] 
	}

*/
csvjson.toColumnArray('./sample.csv').save('./sample.json');


```
convert json object to csv data
-------------------------------
```javascript
csvjson.toCSV('./sample.json').output;

csvjson.toCSV('./sample.json').save('./sample.csv');

```

```bash
npm install csvjson --save
```
