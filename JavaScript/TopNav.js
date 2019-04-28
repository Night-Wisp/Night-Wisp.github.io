(function () {
  var nav_links = ["index.html"];
  
  var style = document.createElement('link');
  style.rel = "stylesheet"; style.type = "text/css"; style.href = "night-wisp.github.io/CSS/topbar.css";
  
  var nav_bar = document.createElement('div');
  nav_bar.class = "topnav"; nav_bar.id = "myTopnav";
  
  nav_links.forEach(function (url) {
    var link = document.createElement('a');
    link.class = "A"; link.href = "night-wisp.github.io/" + url;
    
    nav_bar.appendChild(link);
  });
  
  var head = document.getElementsByTagName('head')[0], body = document.getElementsByTagName('body')[0];
  head.appendChild(style); body.appendChild(nav_bar);
})();
