function show() {
document.getElementById("hidden").style.display='block';
}
function hide() {
document.getElementById("hidden").style.display='none';
}

function coords(event) {
  var shift = "Shift key not pressed";
  if (event.shiftKey == 1) {
   shift = "Shift key pressed"; 
  }
  alert ("X: " + event.clientX + "\nY: " + event.clientY + "\nYou clicked: " + event.button + "\n" + shift);
}
