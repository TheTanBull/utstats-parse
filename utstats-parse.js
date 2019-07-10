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
var match_kills = [];
var kill_count = 0;
var players_obj = {};
var headshot = false;

rl.on('line', function(line) {
  // process current line

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
  
  
  // Handles Player Names
  if(sline[1] === 'player' && sline[2] == 'rename'){
    // console.log(sline[3]);
    players_obj[sline[4]] = sline[3]; // Key[Player_Match_ID]: Value[Player_Name]
  }
  
  // Kill was a Headshot
  if(sline[1] === 'headshot'){
    headshot = true;
  }
  // Capture Kill Information
  if(sline[1] === 'kill'){
    kill_count++;
    let kills_obj = {};
    kills_obj.kill_number = kill_count;
    kills_obj.time = sline[0];
    kills_obj.killer = players_obj[sline[2]];
    kills_obj.killer_weapon = sline[3];
    kills_obj.dead = players_obj[sline[4]];
    kills_obj.dead_weapon = sline[5];
    kills_obj.headshot = headshot;
    
    match_kills.push(kills_obj);
  }
  
});

rl.on('close', function() {
  // do something on finish here

  // Add match_info object to the match object
  match_obj.info = match_info;
  // Add map_obj to the match object
  match_obj.map = match_map;
  // Add match_game to the match object
  match_obj.game = match_game;
  // Add match players array to the match object
  match_obj.players = players_obj;
  // Add match kills array to the match object
  match_obj.kills = match_kills;
  console.log(match_obj);
});