(function () {
  var game_list = [
{name:"Gem Breaker", url:"games/gem_breaker/index.html", imgUrl:"games/gem_breaker/screenshot.png", description:"Break Gems in this insanely fun game!", version:"1.0.0"}];

  window.addEventListener("load", function () {
    var temp = document.getElementById("game_box_temp");
    var game_data = document.getElementById("gamelist");

    for (var i = 0; i < game_list.length; i ++) {
      var game_hold = document.createElement("div");
      //game_hold.innerHTML = temp.innerHTML;
      game_hold.className = temp.className;
      game_hold.setAttribute("data-href", game_list[i].url);

      game_hold.addEventListener("click", function () {
        document.location = /*game_list[i].url*/this.getAttribute("data-href");
      });

      var game_info = document.createElement("div");
      var game_info_name = document.createElement("h3");
      var game_info_ver = document.createElement("span");
      var game_info_desc = document.createElement("p");

      game_info.style.display = "block";
      game_info.setAttribute("width", "150px");
      game_info.style.width = "150px";
      game_info.setAttribute("height", "180px");
      game_info.style.height = "180px";
      game_info.style.position = "relative";
      game_info.style.top = "-200px";
      game_info.style.left = "150px";

      game_info_name.innerText = game_list[i].name;
      game_info_name.style.marginBlockEnd = "0em";

      game_info_ver.innerText = "Version " + game_list[i].version;

      game_info_desc.innerText = game_list[i].description;

      game_info.appendChild(game_info_desc);
      game_info.insertBefore(game_info_ver, game_info_desc);
      game_info.insertBefore(game_info_name, game_info_ver);

      var game_img = document.createElement("img");
      game_img.src = game_list[i].imgUrl;
      game_img.setAttribute("width", "150px");
      game_img.setAttribute("height", "200px");
      game_img.style.display = "block";

      game_hold.appendChild(game_info);
      game_hold.insertBefore(game_img, game_info);

      game_data.insertBefore(game_hold, game_data.children[game_data.childElementCount]);
    }
  });
})();