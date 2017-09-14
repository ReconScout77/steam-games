export class PlayerAchievements {
  constructor(appId, steamId) {

    this.appId = appId;
    this.steamId = steamId;
    this.achievements = [];
    this.achievementIcons = [];
  }

  getData(){
    let that = this;

    let promise = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${that.appId}&key=7AAED77B42E17590FAC15676F062027D&steamid=${that.steamId}&l=english`;

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

    promise.then(function(response) {
      let body = JSON.parse(response);
      for (let i = 0; i < body.playerstats.achievements.length; i++) {
        that.achievements.push(body.playerstats.achievements[i]);
      }

      that.achievements.sort(function(a,b) {
        return b.unlocktime - a.unlocktime;
      });
    });
    this.achievements = that.achievements;

  }

  getGameAchievements() {
    let that = this;
    let promise = new Promise(function(resolve, reject) {

      let request = new XMLHttpRequest();
      let url = ` http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v0001/?appid=${that.appId}&key=7AAED77B42E17590FAC15676F062027D`;

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

    promise.then(function(response) {
      let body = JSON.parse(response);

      for(let i = 0; i < that.achievements.length; i++) {
        let pls = that.achievements[i].apiname;
        if(that.achievements[i].achieved === 1) {
          that.achievementIcons.push(body.game.availableGameStats.achievements[`${pls}`].icon);
        } else {
          that.achievementIcons.push(body.game.availableGameStats.achievements[`${pls}`].icongray);
        }
      }

    });
    this.achievementIcons = that.achievementIcons;
    console.log(this.achievementIcons);
  }
}
