(function () {
  var nav_links = ["index.html"];
  
  var style = document.createElement('link');
  style.rel = "stylesheet"; style.type = "text/css"; style.href = "night-wisp.github.io/CSS/topbar.css";
  
  var nav_bar = document.createElement('div');
  nav_bar.class = "topnav"; nav_bar.id = "myTopnav";
  
  nav_links.forEach(function (url) {
    var link = document.createElement('a');
    link.class = "A"; link.href = "night-wisp.github.io/" + url;
    
    nav_bar.appendElement(link);
  });
  
  var head = document.getElementsByTagName('head'), body = document.getElementsByTagName('body');
  head.appendElement(style); body.appendElement(nav_bar);
})();
