
  Polymer({
    defaultUrl: 'https://www.youtube.com/iframe_api',
    notifyEvent: 'api-load',
    callbackName: 'onYouTubeIframeAPIReady',
    get api() {
      return YT;
    }
  });
