
  Polymer({
    defaultUrl: 'https://apis.google.com/js/client.js?onload=%%callback%%',
    notifyEvent: 'api-load',
    get api() {
      return gapi.client;
    },
    get auth() {
      return gapi.auth;
    }
  });
