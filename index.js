var fs = require("fs"),
	util = require("util");

module.exports = {

	toObject : function(data){
		var content = getContentIfFile(data);
		if(!content || typeof content !== "string"){
			throw new Error("invalid data");
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
		return outputSave(hashData);
	},

	toArray : function(data){
		var content = getContentIfFile(data);
		if(!content || typeof content !== "string"){
			throw new Error("invalid data");
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
		return outputSave(arrayData);
	},

	toCSV : function(data){
		var content = getContentIfFile(data);
		if(!content){
			throw new Error("invalid data");
		}
		if(typeof content === "string"){
			content = JSON.parse(content);
		}	
		if(!content.length){
			throw new Error("invalid data");
		}
		var textContent = [],
			headers = false;
		content.forEach(function(item){
			if(util.isArray(item)){
				textContent.push(item.join(','));
			}else{
				headers = Object.keys(item).join(',');
				var data = [];
				for(var i in item){
					data.push(item[i]);
				}
				textContent.push(data.join(','));
			}
		});
		if(headers){
			textContent.unshift(headers);
		}
		return outputSave(textContent.join("\n")) ;
	},

	toColumnArray : function(data){
		var content = getContentIfFile(data);
		if(!content || typeof content !== "string"){
			throw new Error("invalid data");
		}
		content = content.split(/[\n\r]+/ig);
		var headers = content.shift().split(','),
			hashData = {};
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
		return outputSave(hashData);
	},

	toSchemaObject : function(data){
		var content = getContentIfFile(data);
		if(!content || typeof content !== "string"){
			throw new Error("invalid data");
		}
		content = content.split(/[\n\r]+/ig);
		var headers = content.shift().split(','),
			hashData = [];

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
		return outputSave(hashData);
	}
}

function putDataInSchema(header, item, schema){
	var match = header.match(/\.|\[\]|\[(.)\]|-|\+/ig);
	if(match){
		if(match.indexOf('-') !== -1){
			return true;
		}else if(match.indexOf('.') !== -1){
			var headParts = header.split('.');
			var currentPoint = headParts.shift();
			schema[currentPoint] = schema[currentPoint] || {};
			putDataInSchema(headParts.join("."), item, schema[currentPoint]);
		}else if(match.indexOf('[]') !== -1){
			var headerName = header.replace(/\[\]/ig,"");
			if(!schema[headerName]){
				schema[headerName] = [];
			}
			schema[headerName].push(item);	
		}else if(/\[(.)\]/.test(match[0])){
			var delimiter = match[0].match(/\[(.)\]/)[1];
			var headerName = header.replace(/\[(.)\]/ig,"");
			schema[headerName] = convertArray(item, delimiter);
		}else if(match.indexOf('+') !== -1){
			var headerName = header.replace(/\+/ig,"");
			schema[headerName] = Number(item);
		}
	}else{
		schema[header] = trimQuote(item);
	}
	return schema ;
}

function getContentIfFile(filepath){
	if (fs.existsSync(filepath)) {
        return fs.readFileSync(filepath, 'utf8');
    }
    return filepath;
}


function outputSave(data){
	return {
		output : data,
		save : function(filepath){
			if(typeof data === "object"){
				data = JSON.stringify(data);
			}
			fs.writeFileSync(filepath, data, {encoding:'utf8'});
			return this;
		}
	}
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
