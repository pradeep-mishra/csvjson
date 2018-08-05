
csvjson
=================

Simple CSV to JSON and JSON to CSV converter with stream support
-----------------------------------------
for Node.js and Browser.
-------------------------------------

&copy; Pradeep Mishra, Licensed under the MIT-LICENSE



Features
--------

* CSV to JSON object
* CSV to schema JSON object
* CSV to array object
* CSV to column array object
* JSON object to CSV
* JSON array to CSV
* Stream support



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


/*
schema_sample2.csv

name,age,contacts[0].name,contacts[0].phone,contacts[1].name,contacts[1].phone,musician,instruments.past,instruments.current[],instruments.current[]
Mark,33,Jim Palmer,8888888888,Marcus Aurelius,7309899877,Yes,Guitar,Drums,Bass Guitar
Jeff,27,John Doe,8009008000,Michael Corleone,2121001000,Yes,Drums,Flute,Trumpet

*/

/*
jsoncsv.json


{
 "book": {
   "person": [
     {
       "firstName": "Jane",
       "lastName": "Doe",
       "age": "25",
       "address": {
         "streetAddress": "21 2nd Street",
         "city": "Las Vegas",
         "state": "NV",
         "postalCode": "10021-3100"
       },
       "hobbies" : ["gaming", "volleyball"]
     },
     {
       "firstName": "Agatha",
       "lastName": "Doe",
       "age": "25",
       "address": {
         "streetAddress": "21 2nd Street",
         "city": "Las Vegas",
         "state": "NV",
         "postalCode": "10021-3100"
       },
       "hobbies" : ["dancing", "politics"]
     }
   ]
 }
}


*/


```

convert csv data to json object
----------------------------------------
```javascript
var data = fs.readFileSync(path.join(__dirname, 'schema_sample2.csv'), { encoding : 'utf8'});
/*
{
    delimiter : <String> optional default is ","
    quote     : <String|Boolean> default is null
}
*/
var options = {
  delimiter : ',', // optional
  quote     : '"' // optional
};
// for multiple delimiter you can use regex pattern like this /[,|;]+/

/* 
  for importing headers from different source you can use headers property in options 
  var options = {
    headers : "sr,name,age,gender"
  };
*/

csvjson.toObject(data, options);

/*
    returns

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

var data = fs.readFileSync(path.join(__dirname, 'schema_sample.csv'), { encoding : 'utf8'});
/*
{
    delimiter : <String> optional default is ","
    quote     : <String|Boolean> default is null
}
*/
var options = {
  delimiter : ',', // optional
  quote     : '"' // optional
};

// for multiple delimiter you can use regex pattern like this /[,|;]+/

/* 
  for importing headers from different source you can use headers property in options 
  var options = {
    headers : "created,contact.name,contact.age+,contact.number+,address[],address[],contact.hobbies[;],-id,friends[0].name,friends[0].phone,friends[1].name,friends[1].phone"
  };
*/

csvjson.toSchemaObject(data, options)

/*
    returns

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

```
convert csv data to array object
-----------------------------------------
```javascript

var data = fs.readFileSync(path.join(__dirname, 'sample.csv'), { encoding : 'utf8'});

/*
{
    delimiter : <String> optional default is ","
    quote     : <String|Boolean> default is null
}
*/
var options = {
  delimiter : ',', // optional
  quote     : '"' // optional
};

// for multiple delimiter you can use regex pattern like this /[,|;]+/

csvjson.toArray(data, options);

/*
    returns
    [
        ["sr","name","age","gender"],
        ["1","rocky","33","male"],
        ["2","jacky","22","male"],
        ["3","suzy","21","female"]
    ]

*/

```
convert csv data to column array object
---------------------------------------
```javascript

var data = fs.readFileSync(path.join(__dirname, 'sample.csv'), { encoding : 'utf8'});

/*
{
    delimiter : <String> optional default is ","
    quote     : <String|Boolean> default is null
}
*/
var options = {
  delimiter : ',', // optional
  quote     : '"' // optional
};

// for multiple delimiter you can use regex pattern like this /[,|;]+/

/* 
  for importing headers from different source you can use headers property in options 
  var options = {
    headers : "sr,name,age,gender"
  };
*/

csvjson.toColumnArray(data, options);

/*
    returns

    {
        sr: [ '1', '2', '3' ],
        name: [ 'rocky', 'jacky', 'suzy' ],
        age: [ '33', '22', '21' ],
        gender: [ 'male', 'male', 'female' ]
    }

*/


```
convert json object to csv data
-------------------------------
```javascript

var data = fs.readFileSync(path.join(__dirname, 'jsoncsv.json'), { encoding : 'utf8'});
var options = {
    delimiter   : ",",
    wrap        : false
}

/* supported options

    delimiter = <String> optional default value is ","
    wrap  = <String|Boolean> optional default value is false
    headers = <String> optional supported values are "full", "none", "relative", "key"
    objectDenote = <String> optional default value is "."
    arrayDenote = <String> optional default value is "[]"
*/


csvjson.toCSV(data, options);

/*
returns

book.person[].firstName,book.person[].lastName,book.person[].age,book.person[].address.streetAddress,book.person[].address.city,book.person[].address.state,book.person[].address.postalCode,book.person[].hobbies[]
Jane,Doe,25,21 2nd Street,Las Vegas,NV,10021-3100,gaming;volleyball
Agatha,Doe,25,21 2nd Street,Las Vegas,NV,10021-3100,dancing;politics

*/
```
convert csv to json using stream
-----------------------------------------
```javascript

var read = fs.createReadStream(path.join(__dirname, 'sample.csv'));
var write = fs.createWriteStream(path.join(__dirname, 'sample.json'));
var toObject = csvjson.stream.toObject();
var stringify = csvjson.stream.stringify();
read.pipe(toObject).pipe(stringify).pipe(write);

/*
following functions available for stream transformation
csvjson.stream.toObject()
csvjson.stream.toArray()
csvjson.stream.toColumnArray()
csvjson.stream.toSchemaObject()
*/

/*
csvjson.stream.stringify([space<number>])
stringify function accepts optional space parameter to format output
*/

```
```bash
npm install csvjson --save
```
