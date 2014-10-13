  
    var msg = document.querySelector('div');
    window.addEventListener('api-load', function(e) {
      msg.innerHTML += e.target.localName + ' loaded' + '<br>';
      console.log(e.target.localName + ' loaded');
    });
  