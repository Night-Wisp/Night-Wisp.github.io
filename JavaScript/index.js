function show() {
document.getElementById("hidden").style.display='block';
}
function hide() {
document.getElementById("hidden").style.display='none';
}

function coords(event) {
  alert ("X: " + event.clientX + "/nY: " + event.clientY + "/nYou clicked: " + event.button);
}
