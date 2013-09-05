# SOSi (Node.js)

Streaming .sos files.
Very basic functionality 

``` js

var  join = require('path').join
  , file = join(__dirname, "data",'Grimstad Vest-Landvik 1.sos')
  , dir = join(__dirname, "data")
  , SOSI = require('../');
  
  
   var stream = new SOSI.stream(dir);   
   stream.on("data",function(data) {
        console.log(data); 
   });


   var streamFile = new SOSI.streamFile(file);   
   streamFile.on("data",function(data) {
        console.log(data);
   });
 
 
  
  
```

The objects returned are: 

``` js
expected = { type: 'punkt',
                     objtype: 'StolpeStor',
                     kvalitet: '96',
                     driftsmerking: '"LB.NAU.MO.S-AG.HOLBE"',
                     'g-nord': '"6467771.091100',
                     'g-øst': '"474086.635900',
                     mastenummer: '"29"',
                     plassering: '"GRI-LANDVIK"',
                     'nøh': {},
                     coordinates: [ '646777109', '47408663', '0' ] };
                     
```                     
