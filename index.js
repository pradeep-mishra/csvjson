var fs = require("fs"),
	util = require("util");

module.exports = {

	toObject : function(data){
		var content = getContentIfFile(data);
		if(content === false){
			content = data;
		}
		if(!content || typeof content !== "string"){
			throw new Error("invalid data");
		}
		content = content.split(/[\n\r]+/ig);
		if(!content.length){
			throw new Error("invalid data");
		}
		var headers = content.shift().split(','),
			hashData = [];
		content.forEach(function(item){
			if(item){
				item = item.split(',');
				var hashItem = {};
				headers.forEach(function(headerItem, index){
					hashItem[headerItem] = item[index];
				});
				hashData.push(hashItem);
			}
		});
		return outputSave(hashData);
	},

	toArray : function(data){
		var content = getContentIfFile(data);
		if(content === false){
			content = data;
		}
		if(!content || typeof content !== "string"){
			throw new Error("invalid data");
		}
		content = content.split(/[\n\r]+/ig);
		if(!content.length){
			throw new Error("invalid data");
		}
		var arrayData = [];	
		content.forEach(function(item){
			if(item){
				item = item.split(',');
				arrayData.push(item);
			}
		});
		return outputSave(arrayData);
	},

	toCSV : function(data){
		var content = getContentIfFile(data);
		if(content === false){
			content = data;
		}
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
	}
}

function getContentIfFile(filepath){
	if (fs.existsSync(filepath)) {
        return fs.readFileSync(filepath, 'utf8');
    }
    return false;
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