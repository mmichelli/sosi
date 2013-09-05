var fs = require('fs');
var readline = require('readline');
var Stream = require('stream');
var through = require('through');
var join = require('path').join;
var walk = require('walk');



process.stdin.setEncoding('utf8');

module.exports.stream = stream;

function stream(path) {

    var s = new through()

    fs.stat(path, function (err, stats) {
        if (err) throw err;
        if(stats.isDirectory()) {
            var walker  = walk.walk(path, { followLinks: false });
            walker.on('file', function(root, stat, next) {
                // Add this file to the list of files
                if((stat.name.indexOf("\.sos") != -1)) {
                    streamFile(join(root, stat.name),next ).pipe(s);
                }else{
                    next();
                }
            });
            walker.on('end', function() {
               s.queue(null)
            });
        }
        else{
            s = streamFile(path);
        }
    });
    return s;
}

module.exports.streamFile = streamFile;

function streamFile (path, cb) {

    var instream = fs.createReadStream(path,{encoding:'utf8'})
      , outstream = new Stream()
      , rl = readline.createInterface(instream, outstream)
      , stream = new through()
      , bufferlines = [];

    rl.on('line', function(line) {

        if(isEndOfChunk(line) && filterLines(bufferlines).length > 0) {
            stream.queue(sosiLinesToJSON(bufferlines));
            bufferlines = [];
        }

        bufferlines.push(line);
    });

    rl.on('close', function() {
        stream.queue(sosiLinesToJSON(bufferlines));
        bufferlines = null;
        if(cb) {
            cb(null);
        }else{
            stream.queue(null)
        }
    });
    return stream
}

module.exports.sosiLinesToJSON = sosiLinesToJSON;

function sosiLinesToJSON(lines){
    var out = {};
    var dotStack = [out];
    lines = lines;

    for(var i = 0; i < lines.length; i++)
    {
        var line = trim(lines[i]);
        var twoParts = line.split(" ", 2);
        var dots = countDots(twoParts[0]);
        var name = twoParts[0].replace(/\./g, "").toLowerCase();
        var pointer = dotStack[dots - 1] || out ;
        var nextDot = countDots(lines[i+1] );

        dotStack[dots]  = { };

        if(nextDot <= dots && twoParts.length === 2){
            dotStack[dots] = twoParts[1];
        } else if(twoParts.length === 2) {
            dotStack[dots].value = twoParts[1];
        }
        if(dots === 0){
            pointer.coordinates = line.split(" ");
            dotStack[dots] = pointer;
        }
        else if(dots === 1){
            pointer.type = name;
            dotStack[dots] = pointer;
        }
        else{
            pointer[name] = dotStack[dots] ;
            dotStack[dots] = pointer[name];
        }
    }
    return out;
}



function  filterLines(lines){
    return lines.filter(function(n){return n});
}



function isEndOfChunk(str){
    return (/^\./).test(str) && ! (/^\.\./).test(str);
}


function trim(s){
  return ( s || '' ).replace( /^\s+|\s+$/g, '' );
}


function countDots(str){
    var count = 0 ;
    var s = trim(str);
    for(var i = 0; i < s.length; i++)
    {
        if(s[i] === ".")
          count++
        else
          return count
    }
    return count
}