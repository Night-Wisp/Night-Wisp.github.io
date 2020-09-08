jewel.useWebglDisplay = function() {
jewel.display = (function() {
var webgl = jewel.webgl, animations = [], previousCycle, firstRun = true, jewels, cursor, paused = false, canvas, gl, cols, rows,
      program, geometry, aVertex, aNormal, uScale, uColor;

function addAnimation(runTime, fncs) {
  var anim = {
    runTime : runTime,
    startTime : Date.now(),
    pos : 0,
    fncs : fncs
  };
  animations.push(anim);
}

function renderAnimations(time, lastTime) {
  var anims = animations.slice(0), // copy list
        n = anims.length,
        animTime,
        anim,
        i;

  // call before() function
  for (i = 0; i < n; i++) {
    anim = anims[i];
    if (anim.fncs.before) {
      anim.fncs.before(anim.pos);
    }
    anim.lastPos = anim.pos;
    animTime = (lastTime - anim.startTime);
    anim.pos = animTime / anim.runTime;
    anim.pos = Math.max(0, Math.min(1, anim.pos));
  }

  animations = []; // reset animation list

  for (i = 0; i < n; i++) {
    anim = anims[i];
    anim.fncs.render(anim.pos, anim.pos - anim.lastPos);
    if (anim.pos == 1) {
      if (anim.fncs.done) {
        anim.fncs.done();
      }
    } else {
      animations.push(anim);
    }
  }
}

function initialize(callback) {
  if (firstRun) {
    setup();
    firstRun = false;
  }
  jewels = [];
  requestAnimationFrame(cycle);
  callback();
}

function cycle() {
  var now = Date.now();
  if (!paused) {
    renderAnimations(now, previousCycle);
    if (geometry) {
      draw();
    }
  }

  previousCycle = now;
  requestAnimationFrame(cycle);
}

function pause() {
  paused = true;
}
function resume(pauseTime) {
  paused = false;
  for (var i = 0; i < animations.length; i++) {
    animations[i].startTime += pauseTime;
  }
}

function setup() {
  var $ = jewel.dom.$, boardElement = $("#game-screen .game-board") [0];

  cols = jewel.settings.cols;
  rows = jewel.settings.rows;

  canvas = document.createElement("canvas");
  gl = webgl.createContext(canvas);

  jewel.dom.addClass(canvas, "board");
  boardElement.appendChild(canvas);

  var rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  setupGL();
}

function setCursor(x, y, selected) {
  cursor = null;
  if (arguments.length > 0) {
    cursor = {
      x : x,
      y : y,
      selected : selected
    };
  }
}

function levelUp(callback) {
  addAnimation(500, {
    render: function(pos) {
      gl.uniform1f(gl.getUniformLocation(program, "uAmbient"), 0.12 + Math.sin(pos * Math.PI) * 0.5);
    },
    done: callback
  });
}

function gameOver(callback) {
  removeJewels(jewels, callback);
}

function redraw(newJewels, callback) {
  var x, y, jewel, type;
  for (x = 0; x < cols; x++) {
    for (y = 0; y < rows; y++) {
      type = newJewels[x] [y];
      jewel = getJewel(x, y);
      if (jewel) {
        jewel.type = type;
      } else {
        createJewel(x, y, type);
      }
    }
  }
  callback();
}

function refill(newJewels, callback) {
  var Jewels = [], x, y, oJewels = [];
  for (x = 0; x < newJewels.length; x++) {
    for (y = 0; y < newJewels[x].length; y++) {
      if (y < 4) {
        Jewels.push({fromX: x, fromY: y, toX: x, toY: y - 4, type: getJewel(x, y).type});
      } else {
        Jewels.push({fromX: x, fromY: y, toX: x, toY: y + 4, type: getJewel(x, y).type});
      }
    }
  }
  Jewels.forEach(function (jwl) {
    oJewels.push({x: jwl.toX, y: jwl.toY});
  });
  for (x = 0; x < newJewels.length; x++) {
    for (y = 0; y < newJewels[x].length; y++) {
      if (x < 4) {
        Jewels.push({fromX: x - 4, fromY: y, toX: x, toY: y, type: newJewels[x] [y]});
      } else {
        Jewels.push({fromX: x + 4, fromY: y, toX: x, toY: y, type: newJewels[x] [y]});
      }
    }
  }
  moveJewels(Jewels, function () {
    oJewels.forEach(function (jwl) {
      jewels.splice(jewels.indexOf(getJewel(jwl.x, jwl.y)), 1);
    });
    callback();
  });
}

function moveJewels(movedJewels, callback, multiplier) {
  var n = movedJewels.length, mult = 1;
  if (multiplier) {
    mult = multiplier;
  }
  movedJewels.forEach(function(mover) {
    var jwl = getJewel(mover.fromX, mover.fromY),
          dx = mover.toX - mover.fromX,
          dy = mover.toY - mover.fromY,
          dist = Math.abs(dx) + Math.abs(dy);

    if (!jwl) { // new jewel entering from the top
      jwl = createJewel(mover.fromX, mover.fromY, mover.type);
    }
    addAnimation((200 / mult) * dist, {
      render: function(pos) {
        pos = Math.sin(pos * Math.PI / 2);
        jwl.x = mover.fromX + dx * pos;
        jwl.y = mover.fromY + dy * pos;
      },
      done: function() {
        jwl.x = mover.toX;
        jwl.y = mover.toY;
        if (--n === 0) { // last one calls callback
          callback();
        }
      }
    });
  });
}

function removeJewels(removedJewels, callback) {
  var n = removedJewels.length;
  removedJewels.forEach(function(removed) {
    var jwl = getJewel(removed.x, removed.y), y = jwl.y, x = jwl.x; // original coordinates
    addAnimation(400, {
      render: function(pos) {
        jwl.x = x + jwl.rnd * pos * 2;
        jwl.y = y + pos * pos * 2;
        jwl.scale = 1 - pos;
      },
      done: function() {
        jewels.splice(jewels.indexOf(jwl), 1);
        if (--n === 0) { // last one calls callback
          callback();
        }
      }
    });
  });
}

function createJewel(x, y, type) {
  var jewel = {
    x : x,
    y : y,
    type : type,
    rnd : Math.random() * 2 - 1,
    scale : 1
  };
  jewels.push(jewel);
  return jewel;
}

function getJewel(x, y) {
  return jewels.filter(function(j) {
    return j.x == x && j.y == y;
  }) [0];
}


function setupGL() {
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  program = setupShaders();
  gl.useProgram(program);
  setupTexture(function() {

   // console.clear();

    aVertex = gl.getAttribLocation(program, "aVertex");
    aNormal = gl.getAttribLocation(program, "aNormal");
    uScale = gl.getUniformLocation(program, "uScale");
    uColor = gl.getUniformLocation(program, "uColor");

    gl.enableVertexAttribArray(aVertex);
    gl.enableVertexAttribArray(aNormal);

    gl.uniform1f(gl.getUniformLocation(program, "uAmbient"), 0.12);
    gl.uniform3f(gl.getUniformLocation(program, "uLightPosition"), 20, 15, -10);

    webgl.loadModel(gl, "models/jewel.dae", function(geom) {
      geometry = geom;
    });
    webgl.setProjection(gl, program, 60, cols/rows, 0.1, 100);
  });
}

function setupTexture(callback) {
  var image = new Image();
  image.addEventListener("load", function ()  {
    var texture = webgl.createTextureObject(gl, image);
    gl.uniform1i(gl.getUniformLocation(program, "uTexture"), "uTexture", 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (callback) {
      callback();
    }
  }, false);
  image.src = "images/jewelpattern.jpg";
}

function setupShaders() {
  var vsource = webgl.parse(jewel.dom.$("#vector") [0].innerHTML);
  var fsource = webgl.parse(jewel.dom.$("#fragment") [0].innerHTML);

  var vshader = webgl.createShaderObject(
                               gl, gl.VERTEX_SHADER, vsource),
         fshader = webgl.createShaderObject(
                                gl, gl.FRAGMENT_SHADER, fsource);

  return webgl.createProgramObject(gl, vshader, fshader);
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vbo);
  gl.vertexAttribPointer(aVertex, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, geometry.nbo);
  gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.ibo);

  jewels.forEach(drawJewel);
}

var colors = [
      [0.1, 0.8, 0.1],
      [0.9, 0.1, 0.1],
      [0.9, 0.3, 0.8],
      [0.8, 1.0, 1.0],
      [0.2, 0.4, 1.0],
      [1.0, 0.4, 0.1],
      [1.0, 0.9, 0.1]
];

function drawJewel(jwl) {
  var x = jwl.x - cols / 2 + 0.5,    // make position
        y = -jwl.y + rows / 2 - 0.5, // relative to center
        scale = jwl.scale, n = geometry.num;

  var mv = webgl.setModelView(gl, program,
        [x * 4.4, y * 4.4, -32], // scale and move back
        Date.now() / 1500 + jwl.rnd * 100, // rotate
        [0, 1, 0.1] // rotation axis
  );
  webgl.setNormalMatrix(gl, program, mv);

  // add effect for selected jewel
  if (cursor && jwl.x == cursor.x && jwl.y == cursor.y) {
    scale *= 1.0 + Math.sin(Date.now() / 100) * 0.1;
  }

  gl.uniform1f(uScale, scale);
  gl.uniform3fv(uColor, colors[jwl.type]);

  gl.cullFace(gl.FRONT);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);

  gl.cullFace(gl.BACK);
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);
}

return {
  initialize: initialize,
  redraw: redraw,
  setCursor: setCursor,
  moveJewels: moveJewels,
  removeJewels: removeJewels,
  refill: refill,
  levelUp: levelUp,
  gameOver: gameOver,
  pause: pause,
  resume: resume
};
}) ();
};
jewel.useWebglDisplay();