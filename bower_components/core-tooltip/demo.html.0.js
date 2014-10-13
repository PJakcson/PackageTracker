
  document.querySelector('#fillbutton').addEventListener('click', function(e) {
    e.stopPropagation();

    var el = document.querySelector('#dynamic');
    el.insertAdjacentHTML('beforeend', '<div tip><b>See</b>. Told ya so!</div>');

  });
