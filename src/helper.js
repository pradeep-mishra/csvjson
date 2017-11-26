module.exports = {
    getQuoteChar : getQuoteChar,
    dataType : dataType,
    toCsv : toCsv,
    putData : putData,
    allObjsOrArray : allObjsOrArray,
    getHeaders : getHeaders,
    getLengthyItem : getLengthyItem,
    addDataInSchema : addDataInSchema,
    removeQuote : removeQuote,
    arrayToCsv : arrayToCsv,
    objectToCsv : objectToCsv,
    convertArray : convertArray,
    csvToArray : csvToArray
}

function getQuoteChar(q){
  if(typeof(q) === "string"){
    return q;
  }else if(q === true){
    return '"';
  }
  return null;
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


function toCsv(data, table, parent, row, opt){
    if(dataType(data) === 'undefined'){
        return putData('', table, parent, row, opt);
    }else if(dataType(data) === 'null'){
        return putData('null', table, parent, row, opt);
    }else if(Array.isArray(data)){
        return arrayToCsv(data, table, parent, row, opt);
    }else if(typeof(data) === "object"){
        return objectToCsv(data, table, parent, row, opt);
    }else{
        return putData(String(data), table, parent, row, opt);
    }
}

function putData(data, table, parent, row, opt){
  if(!table || !table[parent]){
      table[parent] = [ ];
  }
  if(row < table[parent].length){
    row = table[parent].length;
  }
  table[parent][row] = data;
  return table;
}


function allObjsOrArray(array){
  return array.every(function(item){
        var datatype = dataType(item);
        if(!datatype.match(/array|object/)){
          return true;
        }
        return false;
  });
}


function getHeaders(headerType, table, opt){
  var keyMatchPattern       = /([^\[\]\.]+)$/;
  var relativeMatchPattern  = /\[\]\.?([^\[\]]+)$/;
  switch(headerType){
    case "none":
      return null;
    case "full":
      return Object.keys(table);
    case "key":
      return Object.keys(table).map(function(header){
        var head = header.match(keyMatchPattern);
        if(head && head.length === 2){
          return head[1];
        }
        return header;
      });
    case "relative":
      return Object.keys(table).map(function(header){
        var head = header.match(relativeMatchPattern);
        if(head && head.length === 2){
          return head[1];
        }
        return header;
      });
  }
}

function getLengthyItem(table){
  var len = 0;
  Object.keys(table).forEach(function(item){
      if(Array.isArray(table[item]) && table[item].length > len){
        len = table[item].length;
      }
  });
  return len;
}

function addDataInSchema(header, item, schema, delimiter, quote){
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
            addDataInSchema(headParts.join('.'), item, schema[currentPoint], delimiter, quote);
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
            schema[headerName] = convertArray(item, delimiter, quote);
        }else if(match.indexOf('+') !== -1){
            headerName = header.replace(/\+/ig,"");
            schema[headerName] = Number(item);
        }
    }else{
        schema[header] = removeQuote(item);
    }
    return schema ;
}

function removeQuote(str){
    if(str){
        return String(str).trim().replace(/^["|'](.*)["|']$/, '$1');
    }
    return "";
}

function arrayToCsv(data, table, parent, row, opt){
    if(allObjsOrArray(data)){
      return putData(data.join(';'), table, parent + opt.arrayDenote, row, opt);
    }
    data.forEach(function(item, index){
        return toCsv(item, table, parent + opt.arrayDenote, index, opt);
    });
}

function objectToCsv(data, table, parent, row, opt){
  Object.keys(data).forEach(function(item){
      return toCsv(data[item], table, parent + opt.objectDenote + item, row, opt);
  });
}

function convertArray(str, delimiter, quote) {
    if(quote && str.indexOf(quote) !== -1){
      return csvToArray(str, delimiter, quote);
    }
    var output = [];
    var arr = str.split(delimiter);
    arr.forEach(function(val) {
        var trimmed = val.trim();
        output.push(trimmed);
    });
    return output;
}

function csvToArray(text, delimit, quote) {

    delimit = delimit || ",";
    quote   = quote || '"';

    var value = new RegExp("(?!\\s*$)\\s*(?:" +  quote + "([^" +  quote + "\\\\]*(?:\\\\[\\S\\s][^" +  quote + "\\\\]*)*)" +  quote + "|([^" +  delimit  +  quote + "\\s\\\\]*(?:\\s+[^" +  delimit  +  quote + "\\s\\\\]+)*))\\s*(?:" +  delimit + "|$)", "g");

    var a = [ ];

    text.replace(value,
        function(m0, m1, m2) {
            if(m1 !== undefined){
                a.push(m1.replace(/\\'/g, "'"));
            }else if(m2 !== undefined){
                a.push(m2);
            }
            return '';
        }
    );

    if (/,\s*$/.test(text)){
        a.push('');
    }
    return a;
}
