
    Polymer('google-map-search', {

      /**
       * TAhe Google map object.
       *
       * @attribute map
       * @type google.maps.Map
       * @default null
       */
      map: null,

      /**
       * The search query.
       *
       * @attribute query
       * @type string
       * @default null
       */
      query: null,

      /**
       * The search result.
       *
       * @attribute result
       * @type object
       */

      observe: {
        query: 'search',
        map: 'search'
      },

      /**
       * Performance a search using for `query` for the search term.
       *
       * @method search
       */
      search: function() {
        if (this.query && this.map) {
          var places = new google.maps.places.PlacesService(this.map);
          places.textSearch({query: this.query}, this.gotResults.bind(this));
        }
      },
      gotResults: function(results, status) {
        this.result = {
          latitude: results[0].geometry.location.lat(),
          longitude: results[0].geometry.location.lng(),
          show: true
        }
      }
    });
  