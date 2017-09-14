export class GameAchievements {
  constructor(appId) {
    this.achievements = null;
    this.appId = appId;
  }

  getData() {
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

      that.achievements = body.game.availableGameStats.achievements;
      console.log(body.game.availableGameStats.achievements);

    });
    this.achievements = that.achievements;
  }

}
