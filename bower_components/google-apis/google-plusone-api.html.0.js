
  Polymer({
    defaultUrl: 'https://apis.google.com/js/plusone.js?onload=%%callback%%',
    notifyEvent: 'api-load',
    get api() {
      return gapi;
    }
  });
