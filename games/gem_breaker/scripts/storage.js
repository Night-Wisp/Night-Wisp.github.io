jewel.storage = (function() {

  function set(key, value) {
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
  }

  function get(key) {
    var value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch(e) {
      return;
    }
  }

  return {
    set: set,
    get: get
  };

}) ();