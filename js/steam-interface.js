import {SteamGames} from './../js/all-games.js';

$(document).ready(function() {
  $('#steam-id-form').submit(function(e) {
    e.preventDefault();
    let steamId = $('#steam-id').val();
    let steamName = $('#steam-id').val();
    // let steamId = "76561197978746585";

    $('#steam-id').val("");

    $('#gameCount').text("");
    $('#table-game-insertion').text("");


    let namePromise = new Promise(function(resolve, reject) {

      let nameRequest = new XMLHttpRequest();
      let steamNameURL = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=7AAED77B42E17590FAC15676F062027D&vanityurl=${steamName}`;

      console.log(steamNameURL);

      nameRequest.onload = function() {
        if (this.status === 200) {
          resolve(nameRequest.response);
        } else {
          reject(Error(nameRequest.statusText));
        }
      };
      nameRequest.open("GET", steamNameURL, true);
      nameRequest.send();
    });

    namePromise.then(function(response) {
      let body = JSON.parse(response);
      steamName = body.response.steamid;

      if(steamName != undefined) {

        let idPromise = new Promise(function(resolve, reject) {
          let request = new XMLHttpRequest();
          let url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=7AAED77B42E17590FAC15676F062027D&steamid=${steamName}&include_appinfo=1&has_community_visible_stats=1&format=json`;

          request.onload = function() {
            if (this.status === 200) {
              resolve(request.response);
            } else {
              reject(Error(request.statusText));
            }
          };
          request.open("GET", url, true);
          request.send();
        });

        idPromise.then(function(response) {
          $('#result').show();
          let body = JSON.parse(response);

          $('#gameName').text("");
          $('#playedTime').text("");

          $('#gameCount').text(`Game Count: ${body.response.game_count}`);

          let allGames = [];
          for (var i = 0; i < body.response.game_count; i++) {
            allGames.push(body.response.games[i]);
          }
          console.log(allGames);

          allGames.sort(function(a,b) {
            return b.playtime_forever - a.playtime_forever;
          });

          for (var j = 0; j < allGames.length; j++) {
            $('#table-game-insertion').append(`<tr>
              <td><img src="http://media.steampowered.com/steamcommunity/public/images/apps/${allGames[j].appid}/${allGames[j].img_logo_url}.jpg"></td><td>${allGames[j].name}</td><td>${allGames[j].playtime_forever}</td></tr>`);
          }
        });
      } else {
        let idPromise = new Promise(function(resolve, reject){

          console.log("SECOND PROMISE: " + steamId);
          let request = new XMLHttpRequest();
          let url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=7AAED77B42E17590FAC15676F062027D&steamid=${steamId}&include_appinfo=1&has_community_visible_stats=1&format=json`;

          request.onload = function() {
            if (this.status === 200) {
              resolve(request.response);
            } else {
              reject(Error(request.statusText));
            }
          };
          request.open("GET", url, true);
          request.send();
        });

        idPromise.then(function(response) {
          $('#result').show();
          let body = JSON.parse(response);

          $('#gameName').text("");
          $('#playedTime').text("");

          $('#gameCount').text(`Game Count: ${body.response.game_count}`);

          let allGames = [];
          for (var i = 0; i < body.response.game_count; i++) {
            allGames.push(body.response.games[i]);
          }
          console.log(allGames);

          allGames.sort(function(a,b) {
            return b.playtime_forever - a.playtime_forever;
          });

          for (var j = 0; j < allGames.length; j++) {

            $('#table-game-insertion').append(`<tr value="${allGames[j].appid}">
              <td><img src="http://media.steampowered.com/steamcommunity/public/images/apps/${allGames[j].appid}/${allGames[j].img_logo_url}.jpg"></td><td><a href="game-achievements.html">${allGames[j].name}</a></td><td>${allGames[j].playtime_forever}</td></tr>`);
          }

        }, function(error) {

          alert("Not a valid Steam name/id.");

        });
      }
    });

  });
});
