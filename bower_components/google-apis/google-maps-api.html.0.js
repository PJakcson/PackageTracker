

  Polymer({

    defaultUrl: 'https://maps.googleapis.com/maps/api/js?callback=%%callback%%',

    /**
     * A Maps API key. To obtain an API key, see developers.google.com/maps/documentation/javascript/tutorial#api_key.
     *
     * @attribute apiKey
     * @type string
     */
    apiKey: null,

   /**
     * A Maps API for Business Client ID. To obtain a Maps API for Business Client ID, see developers.google.com/maps/documentation/business/.
     * If set, a Client ID will take precedence over an API Key.
     *
     * @attribute clientId
     * @type string
     */
    clientId: null,

    /**
     * The libraries to load with this api. Defaults to "places", but an example
     * value might be, "places,geometry"
     * see developers.google.com/maps/documentation/javascript/libraries
     *
     * @attribute libraries
     * @type string
     */
    libraries: "places",

    /**
     * Version of the Maps API to use.
     *
     * @attribute version
     * @type string
     * @default '3.exp'
     */
    version: '3.exp',

    notifyEvent: 'api-load',

    ready: function() {
      var url = this.defaultUrl + '&v=' + this.version;
      url += "&libraries=" + this.libraries;
      if (this.apiKey && !this.clientId) {
        url += '&key=' + this.apiKey;
      }
      if (this.clientId) {
        url += '&client=' + this.clientId;
      }
      this.url = url;
    },

    /**
     * Provides the google.maps JS API namespace.
     *
     * @property api
     * @type google.maps
     */
    get api() {
      return google.maps;
    }
  });
