var csvjson = require('../index');
var fs      = require('fs');
var expect  = require('chai').expect;
var path    = require('path');

var sampleCsvPath = path.join(__dirname, './samples/sample.csv');
var schemaSampleCsv = path.join(__dirname, './samples/schema_sample.csv');
var schemaSampleCsv1 = path.join(__dirname, './samples/schema_sample1.csv');
var schemaSampleCsv2 = path.join(__dirname, './samples/schema_sample2.csv');
var jsonCsv = path.join(__dirname, './samples/jsoncsv.json');


describe('csvjson', function() {
  it('should be an object', function(done) {
    expect(csvjson).to.be.an('object');
    done();
  });
  it('should have all exposed functions', function(done) {
    expect(csvjson).to.have.keys(['toObject', 'toArray', 'toCSV', 'toColumnArray', 'toSchemaObject', 'stream']);
    done();
  });
  it('should have all exposed functions for stream', function(done) {
    expect(csvjson.stream).to.have.keys(['toObject', 'toArray','toColumnArray', 'toSchemaObject', 'transform', 'stringify']);
    done();
  });
});

describe('toObject', function() {
  var result = csvjson.toObject(fs.readFileSync(sampleCsvPath, { encoding : 'utf8'}));
  it('should return an array of objects', function(done) {
    expect(result).to.be.an('array');
    expect(result[0]).to.be.an('object');
    done();
  });
});


describe('toArray', function() {
  var result = csvjson.toArray(fs.readFileSync(sampleCsvPath, { encoding : 'utf8'}));
  it('should return an array of arrays', function(done) {
    expect(result).to.be.an('array');
    expect(result[0]).to.be.an('array');
    done();
  });
});

describe('toColumnArray', function() {
  var result = csvjson.toColumnArray(fs.readFileSync(sampleCsvPath, { encoding : 'utf8'}));
  it('should return an object of arrays', function(done) {
    expect(result).to.be.an('object');
    expect(result.sr).to.be.an('array');
    done();
  });
});

describe('toSchemaObject', function() {
  var result = csvjson.toSchemaObject(fs.readFileSync(schemaSampleCsv, { encoding : 'utf8'}));
  it('should return an array of objects with nested objects', function(done) {
    expect(result).to.be.an('array');
    expect(result[0]).to.be.an('object');
    expect(result[0]['contact']).to.be.an('object');
    done();
  });
});

describe('toSchemaObject with nested and delimited arrays', function() {
  var result = csvjson.toSchemaObject(fs.readFileSync(schemaSampleCsv1, { encoding : 'utf8'}));

  it('should return a nested array of objects with next objects', function(done) {
    expect(result).to.be.an('array');
    expect(result[0]).to.be.an('object');
    expect(result[0]['instruments']).to.be.an('object');
    expect(result[0]['instruments']['current']).to.be.an('array');
    expect(result[0]['instruments']['current']).to.have.length(2);
    done();
  });

  it('should return a nested array from ";" delimiter', function(done) {
    var groups = result[0]['groups'];
    expect(groups).to.be.an('array');
    expect(groups).to.have.length(3);
    done();
  });
});

describe('toSchemaObject with nested arrays of objects', function() {
  var result = csvjson.toSchemaObject(fs.readFileSync(schemaSampleCsv2, { encoding : 'utf8'}));

  it('should return an array of objects', function(done) {
    expect(result[0]['contacts']).to.be.an('array');
    expect(result[0]['contacts'][1]).to.be.an('object');
    expect(result[1]['contacts'][1]).to.have.keys(['name', 'phone']);
    done();
  });

  it('should return name as a string', function(done) {
    expect(result[0]['name']).to.be.a('string');
    expect(result[0]['name']).to.equal('Mark');
    done();
  });

  it('should return instruments as an object with an array', function(done) {
    expect(result[0]['instruments']).to.be.an('object');
    expect(result[0]['instruments']['current']).to.be.an('array');
    done();
  });
});



describe('toCSV', function() {
  it('should match output', function(done) {
      var result = csvjson.toCSV(fs.readFileSync(jsonCsv, { encoding : 'utf8'}));
      expect(result).to.be.an('string');
      done();
  });
  
});


describe('stream.toArray', function() {
  var transform = csvjson.stream.toArray();
  var stream = fs.createReadStream(sampleCsvPath);
  it('should return an array of objects', function(done) {
    stream.pipe(transform).pipe(csvjson.stream.transform(function(d,e,c){
      expect(d).to.be.an('array');
      expect(d[0]).to.be.an('array');
      c();
      done();
    }));
  });
});

describe('stream.toObject', function() {
  var transform = csvjson.stream.toObject();
  var stream = fs.createReadStream(sampleCsvPath);
  it('should return an array of objects', function(done) {
    stream.pipe(transform).pipe(csvjson.stream.transform(function(d,e,c){
      expect(d).to.be.an('array');
      expect(d[0]).to.be.an('object');
      c();
      done();
    }));
  });
});

describe('stream.toColumnArray', function() {
  var transform = csvjson.stream.toColumnArray();
  var stream = fs.createReadStream(sampleCsvPath);
  it('should return an array of objects', function(done) {
    stream.pipe(transform).pipe(csvjson.stream.transform(function(d,e,c){
      expect(d).to.be.an('object');
      expect(d.sr).to.be.an('array');
      c();
      done();
    }));
  });
});

describe('stream.toSchemaObject', function() {
  var transform = csvjson.stream.toSchemaObject();
  var stream = fs.createReadStream(sampleCsvPath);
  it('should return an array of objects', function(done) {
    stream.pipe(transform).pipe(csvjson.stream.transform(function(d,e,c){
      expect(d).to.be.an('array');
      expect(d[0]).to.be.an('object');
      expect(d[0]['name']).to.be.an('string');
      c();
      done();
    }));
  });
});

var rstream = fs.createReadStream(sampleCsvPath);
var wstream = fs.createWriteStream(path.join(__dirname, './samples/samplexx.json'));
rstream.pipe(csvjson.stream.toObject()).pipe(csvjson.stream.stringify(2)).pipe(wstream);
