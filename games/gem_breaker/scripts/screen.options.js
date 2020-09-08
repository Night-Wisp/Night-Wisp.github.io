jewel.screens["options"] = (function () {
var firstRun = true, d3, WW, snd;

function setup() {
  var $ = jewel.dom.$, bind = jewel.dom.bind, backButton = $("#options button[name=back]") [0];
  d3 = $("#webglMode") [0];
  WW = $("#webWorker") [0];
  snd = $("#sound") [0];
  bind(backButton, "click", function() {
    jewel.showScreen("main-menu");
  });

  if (jewel.hasWebGL() && jewel.online()) {
    jewel.settings.options.useWebgl = true;
    bind(d3, "click", function() {
      if (d3.checked) {
        jewel.useWebglDisplay();
        jewel.settings.options.useWebgl = true;
      } else {
        jewel.useCanvasDisplay();
        jewel.settings.options.useWebgl = false;
      }
      if (!$(".board") [0]) {
        return;
      }
      var q = $(".board");
      for (var i = 0; i < q.length; i++) {
        q[i].parentElement.removeChild(q[i]);
      }
      updateSettings();
    });
    d3.checked = jewel.settings.options.useWebgl;
    $("#webglModeSwitch") [0].style.display = "block";
  }

  if (jewel.hasWebWorkers() && jewel.online()) {
    jewel.settings.options.useWebWorkers = true;
    bind(WW, "click", function() {
      if (WW.checked) {
        jewel.useWorkerBoard();
        jewel.settings.options.useWebWorkers = true;
      } else {
        jewel.useNormalBoard();
        jewel.settings.options.useWebWorkers = false;
      }
      updateSettings();
    });
    WW.checked = jewel.settings.options.useWebWorkers;
    $("#webWorkerSwitch") [0].style.display = "block";
  }

  bind(snd, "click", function() {
    if (snd.checked) {
      jewel.settings.options.soundOn = true;
    } else {
      jewel.settings.options.soundOn = false;
    }
    updateSettings();
  });
  snd.checked = jewel.settings.options.soundOn;
}

function updateSettings() {
  jewel.storage.set("options", jewel.settings.options);
  var d = Date.now();
  jewel.display.pause();
  jewel.display.resume(Date.now() - d);
}

function run() {
  if (firstRun) {
    setup();
    firstRun = false;
  }
}

return {
  run: run
};
}) ();