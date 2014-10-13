
  Polymer({
    defaultUrl: 'https://www.google.com/jsapi?callback=%%callback%%',
    notifyEvent: 'api-load',
    get api() {
      return google;
    }
  });
