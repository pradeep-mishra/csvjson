
module.exports = {
    toObject        : toObject,
    toArray         : toArray,
    toCSV           : toCSV,
    toColumnArray   : toColumnArray,
    toSchemaObject  : toSchemaObject
}

function putDataInSchema(header, item, schema){
    var match = header.match(/\[*[\d]\]\.(\w+)|\.|\[\]|\[(.)\]|-|\+/ig);
    var headerName, currentPoint;
    if(match){
        var testMatch = match[0];
        if(match.indexOf('-') !== -1){
            return true;
        }else if(match.indexOf('.') !== -1){
            var headParts = header.split('.');
            currentPoint = headParts.shift();
            schema[currentPoint] = schema[currentPoint] || {};
            putDataInSchema(headParts.join('.'), item, schema[currentPoint]);
        }else if(match.indexOf('[]') !== -1){
            headerName = header.replace(/\[\]/ig,'');
            if(!schema[headerName]){
            schema[headerName] = [];
            }
            schema[headerName].push(item);
        }else if(/\[*[\d]\]\.(\w+)/.test(testMatch)){
            headerName = header.split('[').shift();
            var index = parseInt(testMatch.match(/\[(.)\]/).pop(),10);
            currentPoint = header.split('.').pop();
            schema[headerName] = schema[headerName] || [];
            schema[headerName][index] = schema[headerName][index] || {};
            schema[headerName][index][currentPoint] = item;
        }else if(/\[(.)\]/.test(testMatch)){
            var delimiter = testMatch.match(/\[(.)\]/).pop();
            headerName = header.replace(/\[(.)\]/ig,'');
            schema[headerName] = convertArray(item, delimiter);
        }else if(match.indexOf('+') !== -1){
            headerName = header.replace(/\+/ig,"");
            schema[headerName] = Number(item);
        }
    }else{
        schema[header] = trimQuote(item);
    }
    return schema ;
}

function toColumnArray(data){

    var content = data;
    if(typeof(content) !== "string"){
        throw new Error("Invalid input, input data should be a string");
    }
    content         = content.split(/[\n\r]+/ig);
    var headers     = content.shift().split(',');
    var hashData    = { };

    headers.forEach(function(item){
        hashData[item] = [];
    });

    content.forEach(function(item){
        if(item){
            item = item.split(',');
            item.forEach(function(val, index){
                hashData[headers[index]].push(trimQuote(val));
            });
        }
    });

    return hashData;
}

function toObject(data){
    var content = data;
    if(typeof(content) !== "string"){
        throw new Error("Invalid input, input data should be a string");
    }
    content = content.split(/[\n\r]+/ig);
    var headers = content.shift().split(','),
        hashData = [];
    content.forEach(function(item){
        if(item){
            item = item.split(',');
            var hashItem = {};
            headers.forEach(function(headerItem, index){
                hashItem[headerItem] = trimQuote(item[index]);
            });
            hashData.push(hashItem);
        }
    });
    return hashData;
}

function toSchemaObject(data){

    var content = data;
    if(typeof(content) !== "string"){
        throw new Error("Invalid input, input should be a string");
    }
    content         = content.split(/[\n\r]+/ig);
    var headers     = content.shift().split(',');
    var hashData    = [ ];

    content.forEach(function(item){
        if(item){
            item = item.split(',');
            var schemaObject = {};
            item.forEach(function(val, index){
                putDataInSchema(headers[index], val, schemaObject);
            });
            hashData.push(schemaObject);
        }
    });

    return hashData;
}


function toArray(data){
    var content = data;

    if(typeof(content) !== "string"){
        throw new Error("Invalid input, input data should be a string");
    }

    content = content.split(/[\n\r]+/ig);
    var arrayData = [];
    content.forEach(function(item){
        if(item){
            item = item.split(',').map(function(cItem){
                return trimQuote(cItem);
            });
            arrayData.push(item);
        }
    });
    return arrayData;
}


function trimQuote(str){
    return str.trim().replace(/^["|'](.*)["|']$/, '$1');
}

function convertArray(str, delimiter) {
    var output = [];
    var arr = str.split(delimiter);
    arr.forEach(function(val) {
        var trimmed = val.trim();
        output.push(trimmed);
    });
    return output;
}


function dataType(arg) {
    if (arg === null) {
        return 'null';
    }
    else if (arg && (arg.nodeType === 1 || arg.nodeType === 9)) {
        return 'element';
    }
    var type = (Object.prototype.toString.call(arg)).match(/\[object (.*?)\]/)[1].toLowerCase();
    if (type === 'number') {
        if (isNaN(arg)) {
            return 'nan';
        }
        if (!isFinite(arg)) {
            return 'infinity';
        }
    }
    return type;
}

function getKeyNameForObject(title, origin, key, opts){
  if(opts.headers === 'key' || opts.headers === 'none'){
    return key;
  }else{
    if(origin){
      return (title ? title : '') + key;
    }else{
      return (title ? title + opts.objectDenote : '') + key;
    }
  }
}

function getKeyNameForArray(title, opts, contentIsObject){
  if(contentIsObject && opts.headers === "relative"){
     return "";
  }
  return title + opts.arrayDenote;
}

function _toCSV(data, csv, title, opts, origin){
    if(!data){
        return data;
    }else if(Array.isArray(data)){
        data.some(function(i){
            if(dataType(i) === 'string'){
                _toCSV(
                  data.join(';'),
                  csv,
                  getKeyNameForArray(title, opts, false),
                  opts
                );
                return true;
            }
            return _toCSV(
              i,
              csv,
              getKeyNameForArray(title, opts, true),
              opts
            );
        });
    }else if(dataType(data) === 'object'){
        return Object.keys(data).forEach(function(key){
            return _toCSV(
              data[key],
              csv,
              getKeyNameForObject(title, origin, key, opts),
              opts
            );
        });
    }else{
        if(csv[title]){
            csv[title].push(data);
        }else{
            csv[title] = [ data ];
        }
    }
}

function toCSV(data, opts){

    opts                = opts || { };
    opts.delimiter      = opts.delimiter || ',';

    opts.wrap           = opts.wrap || '';

    opts.arrayDenote    = opts.arrayDenote && String(opts.arrayDenote).trim() ? opts.arrayDenote : '[]';

    opts.objectDenote   = opts.objectDenote && String(opts.objectDenote).trim() ? opts.objectDenote : '.';

    opts.detailedOutput  = typeof(opts.detailedOutput) !== "boolean" ? true : opts.detailedOutput;

    opts.headers  = String(opts.headers).toLowerCase();

    if(!opts.headers.match(/none|full|relative|key/)){
      opts.headers = 'full';
    }else{
      opts.headers = opts.headers.match(/none|full|relative|key/)[0];
    }



    var csvJSON         = { };
    var csvData         = "";
    var topLength       = 0;
    var headers         = null;

    if(opts.wrap === true){
        opts.wrap = '"';
    }

    if(dataType(data) === "string"){
        data = JSON.parse(data);
    }


    _toCSV(data, csvJSON, '', opts, true);

    if(opts.wrap){
        headers = Object.keys(csvJSON).map(function(i){
            return opts.wrap + i + opts.wrap;
        }).join(opts.delimiter) + '\n';
    }else{
        headers = Object.keys(csvJSON).join(opts.delimiter) + '\n';
    }

    csvData += opts.headers !== 'none' ? headers : '';

    Object.keys(csvJSON).forEach(function(i){
        if(Array.isArray(csvJSON[i]) && csvJSON[i].length > topLength){
            topLength = csvJSON[i].length;
        }
    });

    for(var i = 0; i < topLength; i++){
        var thisLine = [ ];
        Object.keys(csvJSON).forEach(function(j){
            if(Array.isArray(csvJSON[j]) && csvJSON[j][i]){
                if(opts.wrap){
                    thisLine.push( opts.wrap + csvJSON[j][i] + opts.wrap);
                }else{
                    thisLine.push(csvJSON[j][i]);
                }

            }else{
                if(opts.wrap){
                    thisLine.push( opts.wrap + opts.wrap);
                }else{
                    thisLine.push('');
                }
            }
        });
        csvData += thisLine.join(opts.delimiter) + '\n' ;
    }

    return csvData;

}
