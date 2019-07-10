var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var instream = fs.createReadStream('./logs/Unreal.ngLog.2019.07.09.13.56.14.7777.log');
var outstream = new stream;
var rl = readline.createInterface(instream, outstream);
var match_obj = {};
var match_info = {};
var match_map = {};
var match_game = {};
var match_kills = 0;
var players_arr = [];

rl.on('line', function(line) {
  // process line here
  // Handles Player Names
  let sline = line.toLowerCase().split('\t');

  // Capture Match Info
  if(sline[1] === 'info'){
    match_info[sline[2]] = sline[3];
  }

  // Capture Map Info
  if(sline[1] === 'map'){
    match_map[sline[2]] = sline[3];
  }
  
  // Caputure Game Info
  if(sline[1] === 'game'){
    match_game[sline[2]] = sline[3];
  }
  
  

  if(sline[1] === 'player' && sline[2] == 'rename'){
    console.log(sline[3]);
    players_arr.push({name: sline[3],pmi: sline[4]}); // [Name, Player_Match_ID]
  }
  // Handles Kill Information
  // if(line.split('\t')[1].includes('kill')){
  //     console.log(line);
  //     match_kills++;
  // }
});

rl.on('close', function() {
  // do something on finish here
  console.log(match_kills);
  console.log(players_arr);

  // Add match_info object to the match object
  match_obj.info = match_info;
  // Add map_obj to the match object
  match_obj.map = match_map;
  // Add match_game to the match object
  match_obj.game = match_game;
  // Add match players array to the match object
  match_obj.players = players_arr;
  console.log(match_obj);
});