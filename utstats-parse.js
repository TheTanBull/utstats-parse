var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var instream = fs.createReadStream('./Unreal.ngLog.2019.07.09.13.56.14.7777.log');
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);
var match_kills = 0;

rl.on('line', function(line) {
  // process line here
  if(line.split('\t')[1].includes('kill')){
      console.log(line);
      match_kills++;
  }
});

rl.on('close', function() {
  // do something on finish here
  console.log(match_kills);
});