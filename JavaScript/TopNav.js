(function () {
  var nav_links = [{url: "index.html", name: "Home"}, {url: "accounts.html", name: "Accounts"}, {url: "games.html", name: "Games"}];
  
  var style = document.createElement('link');
  style.rel = "stylesheet"; style.type = "text/css"; style.href = "https://night-wisp.github.io/CSS/topbar.css";
  
  var nav_bar = document.createElement('div');
  nav_bar.classList.add("topnav"); nav_bar.id = "myTopnav";
  
  nav_links.forEach(function (data) {
    var link = document.createElement('a');
    link.classList.add("A"); link.href = "https://night-wisp.github.io/" + data.url;
    link.innerHTML = data.name;
    
    nav_bar.appendChild(link);
  });
  
  window.addEventListener("load", function () {
    var head = document.getElementsByTagName('head')[0], body = document.getElementsByTagName('body')[0];
    head.appendChild(style);
    body.insertBefore(nav_bar, body.children[0]);
  });
})();
