var assert = require("assert")
  , SosStream = require("../")
  , fs = require ('fs')
  , join = require('path').join
  , file = join(__dirname, "data",'Grimstad Vest-Landvik 1.sos')
  , dir = join(__dirname, "data")
  , SOSI = require('../');







describe('SOSI stream a directory', function(){
    var stream = new SOSI.stream(dir);


    it('should return a stream', function(done){
        assert(stream);
        done();
    })


    var groups = [];

    stream.on("data",function(data) {
        groups.push(data);
    });


    it('Should loop through all the files',  function(done) {

           setTimeout(function() {
               assert.equal(groups.length, 549);
               assert.equal(groups[0].type , "hode");
               assert.equal(groups[1].type , "punkt");
               assert.equal(groups[2].type , "punkt");
               assert.equal(groups[groups.length -1].type , "slutt");
               done();
           }, 1000);
       })
});



describe('SOSI stream a file', function(){
    var stream = new SOSI.streamFile(file);


    it('should return a stream', function(done){
        assert(stream);
        done();
    })


    var groups = [];

    stream.on("data",function(data) {
        groups.push(data);
    });


    it('Should return two objects',  function(done) {

           setTimeout(function() {
               assert.equal(groups.length , 3);
               assert.equal(groups[0].type , "hode");
               assert.equal(groups[1].type , "punkt");
               assert.equal(groups[2].type , "slutt");
               done();

           }, 1000);

       })
});

describe('SOSIStream convert head into js object', function(){
    var lines = [
        '.HODE ',
        '..TEGNSETT ISO8859-1',
        '..TRANSPAR',
        '...KOORDSYS 22',
        '...ORIGO-NØ 0 0',
        '...ENHET 0.01',
        '..OMRÅDE',
        '...MIN-NØ 6466843 462422',
        '...MAX-NØ 6482487 474723',
        '..SOSI-VERSJON 4.0',
        '..SOSI-NIVÅ 2',
        '..DATO 20130827']

      , expected =
        { type: 'hode',
          tegnsett: 'ISO8859-1',
          transpar: { koordsys: '22', 'origo-nø': '0 0', enhet: '0.01' },
          'område': { 'min-nø': '6466843 462422', 'max-nø': '6482487 474723' },
          'sosi-versjon': '4.0',
          'sosi-nivå': '2',
          dato: '20130827' };

    it('should return an object', function(){
        var actual = SOSI.sosiLinesToJSON(lines);
        assert.deepEqual(actual, expected)
    })
});

describe('SOSIStream convert head into js object', function(){
    var lines = [
        '.PUNKT 1240421:',
        '..OBJTYPE StolpeStor',
        '..KVALITET 96 20 0',
        '..DRIFTSMERKING "LB.NAU.MO.S-AG.HOLBE"',
        '..G-NORD "6467771.091100 m"',
        '..G-ØST "474086.635900 m"',
        '..MASTENUMMER "29"',
        '..PLASSERING "GRI-LANDVIK"',
        '..NØH',
        '646777109 47408663 0']

      , expected = { type: 'punkt',
                     id: '1240421:',
                     objtype: 'StolpeStor',
                     kvalitet: '96 20 0',
                     driftsmerking: '"LB.NAU.MO.S-AG.HOLBE"',
                     'g-nord': '"6467771.091100 m"',
                     'g-øst': '"474086.635900 m"',
                     mastenummer: '"29"',
                     plassering: '"GRI-LANDVIK"',
                     'nøh': {},
                     coordinates: [ '646777109', '47408663', '0' ] };


    it('should return an object', function(){
        var actual = SOSI.sosiLinesToJSON(lines);
        assert.deepEqual(actual, expected)
    })
});