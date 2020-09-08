jewel.screens["exit-screen"] = (function() {

function run() {
if (jewel.isStandalone()) {
jewel.showScreen("splash-screen");
} else {
jewel.showScreen("install-screen");
}
}

return {
run: run
};
}) ();