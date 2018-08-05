var app = require('./app.js');

module.exports = {
	toColumnArray: toColumnArray,
	toObject: toObject,
	toSchemaObject: toSchemaObject,
	toArray: toArray,
	transform: transform,
	stringify: stringify
}

function chopLines(str) {
	return str.split(/[\n\r]/ig);
}

function transform(func) {
	var stream = require('stream');
	return new stream.Transform({
		readableObjectMode: true,
		writableObjectMode: true,
		transform: func
	});
}

function stringify(space) {
	return transform(function (data, encoding, callback) {
		this.push(JSON.stringify(data, null, space))
		callback()
	});
}

function _toColumnArray(data, encoding, callback, trans) {
	var lines = chopLines(data.toString());
	if (!trans._head) {
		var head = lines.shift();
		trans._head = head;
		trans._opts.headers = head;
	}
	this.push(app.toColumnArray(lines.join('\n'), trans._opts))
	callback()
}

function toColumnArray(opts) {
	opts = opts || {};
	var trans = transform(function (data, encoding, callback) {
		_toColumnArray.call(this, data, encoding, callback, trans);
	});
	trans._head = opts.headers ? opts.headers : null;
	trans._opts = opts;
	return trans;
}

function _toObject(data, encoding, callback, trans) {
	var lines = chopLines(data.toString());
	if (!trans._head) {
		var head = lines.shift();
		trans._head = head;
		trans._opts.headers = head;
	}
	this.push(app.toObject(lines.join('\n'), trans._opts))
	callback()
}

function toObject(opts) {
	opts = opts || {};
	var trans = transform(function (data, encoding, callback) {
		_toObject.call(this, data, encoding, callback, trans);
	});
	trans._head = opts.headers ? opts.headers : null;
	trans._opts = opts;
	return trans;
}

function _toSchemaObject(data, encoding, callback, trans) {
	var lines = chopLines(data.toString());
	if (!trans._head) {
		var head = lines.shift();
		trans._head = head;
		trans._opts.headers = head;
	}
	this.push(app.toSchemaObject(lines.join('\n'), trans._opts))
	callback()
}

function toSchemaObject(opts) {
	opts = opts || {};
	var trans = transform(function (data, encoding, callback) {
		_toSchemaObject.call(this, data, encoding, callback, trans);
	});
	trans._head = opts.headers ? opts.headers : null;
	trans._opts = opts;
	return trans;
}

function _toArray(data, encoding, callback, trans) {
	var lines = chopLines(data.toString());
	this.push(app.toArray(lines.join('\n'), trans._opts))
	callback()
}

function toArray(opts) {
	opts = opts || {};
	var trans = transform(function (data, encoding, callback) {
		_toArray.call(this, data, encoding, callback, trans);
	});
	trans._opts = opts;
	return trans;
}