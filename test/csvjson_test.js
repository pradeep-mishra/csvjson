var csvjson = require('../index.js');

var expect = require('chai').expect;

describe('csvjson', function() {
  it('should be an object', function(done) {
    expect(csvjson).to.be.an('object');
    done();
  });
});

describe('csvjson of sample.csv', function() {
  it('should return an array of objects', function(done) {
    var result = csvjson.toObject('./test/sample.csv').output;

    expect(result).to.be.an('array');
    expect(result[0]).to.be.an('object');
    done();
  });
});

describe('csvjson of sample_schema.csv', function() {
  it('should return an array of objects with next objects', function(done) {
    var result = csvjson.toSchemaObject('./test/schema_sample.csv').output;

    expect(result).to.be.an('array');
    expect(result[0]).to.be.an('object');
    expect(result[0]['contact']).to.be.an('object');
    done();
  });
});

describe('csvjson of sample_schema1.csv', function() {
  var result = csvjson.toSchemaObject('./test/schema_sample1.csv').output;
  it('should return an array of objects with next objects', function(done) {
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