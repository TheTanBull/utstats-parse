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
var player_stats = {};
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
    players_obj[sline[4]] = {'name': sline[3]}; // Key[Player_Match_ID]: Value{name}]
  }
  // Adds Player Connect Time  
  if(sline[1] === 'player' && sline[2] == 'connect'){
    players_obj[sline[4]].connect = sline[0]; // Key[Player_Match_ID]: Value[Player_Name]
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
    kills_obj.killer = players_obj[sline[2]].name;
    kills_obj.killer_weapon = sline[3];
    kills_obj.victim = players_obj[sline[4]].name;
    kills_obj.victim_weapon = sline[5];
    kills_obj.death_type = sline[6];
    kills_obj.headshot = headshot;
    match_kills.push(kills_obj);
    //Add deaths to player stats
    if(player_stats[sline[4]]){
      if(player_stats[sline[4]].death_times){
        player_stats[sline[4]].death_times.push([sline[0]]);
      }else{
        player_stats[sline[4]].death_times = [];
        player_stats[sline[4]].death_times.push([sline[0]]);
      }
    } else{
      player_stats[sline[4]] = {};
      player_stats[sline[4]].death_times = [];
      player_stats[sline[4]].death_times.push([sline[0]]);
    }
    // Add kills to player stats
    if(player_stats[sline[2]]){
      if(player_stats[sline[2]].kill_times){
        player_stats[sline[2]].kill_times.push([sline[0]]);
      }else{
        player_stats[sline[2]].kill_times = [];
        player_stats[sline[2]].kill_times.push([sline[0]]);
      }
    } else{
      player_stats[sline[2]] = {};
      player_stats[sline[2]].kill_times = [];
      player_stats[sline[2]].kill_times.push([sline[0]]);
    }
    headshot = false;
  }
  // Count Suicides and add to deaths
  if(sline[1] === 'suicide'){
    if(player_stats[sline[2]]){
      if(player_stats[sline[2]].death_times){
        player_stats[sline[2]].death_times.push([sline[0], 'suicide']);
      }else{
        player_stats[sline[2]].death_times = [];
        player_stats[sline[2]].death_times.push([sline[0], 'suicide']);
      }
    } else{
      player_stats[sline[2]] = {};
      player_stats[sline[2]].death_times = [];
      player_stats[sline[2]].death_times.push([sline[0], 'suicide']);
    }
  }

  // Adds ending player stats 
  if(sline[1] === 'stat_player'){
    player_stats[sline[3]][sline[2]] = sline[4];
  }

  if(sline[1].includes('weap')){
    if(player_stats[sline[3]].weapon_stats){
      if(player_stats[sline[3]].weapon_stats[sline[2]]){
          player_stats[sline[3]].weapon_stats[sline[2]][sline[1]] = sline[4];
      }else {
        player_stats[sline[3]].weapon_stats[sline[2]] = {};
        player_stats[sline[3]].weapon_stats[sline[2]][sline[1]] = sline[4];
      }
    } else {
      player_stats[sline[3]].weapon_stats = {};
      player_stats[sline[3]].weapon_stats[sline[2]] = {};
      player_stats[sline[3]].weapon_stats[sline[2]][sline[1]] = sline[4];
    }
  }
  
});

rl.on('close', function() {
  // do something on finish here
  var longest_life = 0;
  var longest_life_player;
  for(player in player_stats){
    var last_life = players_obj[player].connect;
    console.log("setting " + players_obj[player].name + "'s starting time to " + players_obj[player].connect)
    player_stats[player].death_times.forEach((time) => {
      if(longest_life < time[0] - last_life){
        longest_life = time[0] - last_life;
        longest_life_player = player;
        console.log(players_obj[player].name + longest_life);
      }
      last_life = time[0];
    });
  }

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
  // Add player stats obj to the match object
  match_obj.player_stats = player_stats;
  // console.log(match_obj.player_stats);
});