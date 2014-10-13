

  Polymer('google-map', {

    /**
     * A Maps API key. To obtain an API key, see developers.google.com/maps/documentation/javascript/tutorial#api_key.
     *
     * @property apiKey
     * @type string
     */
    apiKey: null,

    /**
     * A latitude to center the map on.
     *
     * @attribute latitude
     * @type number
     * @default 37.77493
     */
    latitude: 37.77493,

    /**
     * A longitude to center the map on.
     *
     * @attribute longitude
     * @type number
     * @default -122.41942
     */
    longitude: -122.41942,

    /**
     * A zoom level to set the map to.
     *
     * @attribute zoom
     * @type number
     * @default 10
     */
    zoom: 10,

    /**
     * When set, displays a map marker at the center point.
     *
     * @attribute showCenterMarker
     * @type boolean
     * @default false
     */
    showCenterMarker: false,

    /**
     * Map type to display. One of 'roadmap', 'satellite', 'hybrid', 'terrain'.
     *
     * @attribute mapType
     * @type string
     * @default roadmap
     */
    mapType: 'roadmap', // roadmap, satellite, hybrid, terrain

    /**
     * Version of the Google Maps API to use.
     *
     * @attribute version
     * @type string
     * @default 3.exp
     */
    version: '3.exp',

    /**
     * If set, removes the map's default UI controls.
     *
     * @attribute disableDefaultUI
     * @type boolean
     * @default false
     */
    disableDefaultUI: false,

    /**
     * If set, the zoom level is set such that all markers (google-map-marker children) are brought into view.
     *
     * @attribute fitToMarkers
     * @type boolean
     * @default false
     */
    fitToMarkers: false,

    /**
     * If false, prevent the user from zooming the map interactively.
     *
     * @attribute zoomable
     * @type boolean
     * @default true
     */
    zoomable: true,

    /**
     * If set, custom styles can be applied to the map.
     * For style doucmentation see developers.google.com/maps/documentation/javascript/reference#MapTypeStyle
     *
     * @attribute styles
     * @type JSON encoded array
     * @default null
     */
    styles: {},

    observe: {
      latitude: 'updateCenter',
      longitude: 'updateCenter'
    },

    created: function() {
      this.markers = [];
    },

    attached: function() {
      this.resize();
    },

    mapApiLoaded: function() {
      this.map = new google.maps.Map(this.$.map, this.getMapOptions());

      this.updateCenter();
      this.updateMarkers();

      this.fire('google-map-ready');
    },

    getMapOptions: function() {
      var mapOptions = {
        zoom: this.zoom,
        mapTypeId: this.mapType,
        disableDefaultUI: this.disableDefaultUI,
        disableDoubleClickZoom: !this.zoomable,
        scrollwheel: this.zoomable,
        styles: this.styles
      };

      // Only override the default if set.
      // We use getAttribute here because the default value of this.draggable = false even when not set.
      if (this.getAttribute("draggable") != null) {
        mapOptions.draggable = this.draggable
      }
      return mapOptions;
    },

    updateMarkers: function() {
      this.markers = Array.prototype.slice.call(
          this.$.markers.getDistributedNodes());

      if (this.centerMarker) {
        this.markers.push(this.centerMarker);
      }

      this.onMutation(this, this.updateMarkers); // Watch for future updates.

      // Set the map on each marker and zoom viewport to ensure they're in view.
      if (this.markers.length && this.map) {
        for (var i = 0, m; m = this.markers[i]; ++i) {
          m.map = this.map;
        }

        if (this.fitToMarkers) {
          this.fitToMarkersChanged();
        }
      }
    },

    /**
     * Clears all markers from the map.
     *
     * @method clear
     */
    clear: function() {
      for (var i = 0, m; m = this.markers[i]; ++i) {
        m.marker.setMap(null);
      }
    },

    resize: function() {
      if (this.map) {
        google.maps.event.trigger(this.map, 'resize');
        this.updateCenter();
      }
    },

    updateCenter: function() {
      if (!this.map || this.latitude == null || this.longitude == null ||
          typeof this.latitude === 'object' ||
          typeof this.longitude === 'object') {
        return;
      }
      var center = new google.maps.LatLng(this.latitude, this.longitude);
      if (!this.map.getCenter()) {
        // If the map does not have a center, set it right away.
        this.map.setCenter(center);
      } else {
        // If the map currently has a center, slowly pan to the new one.
        this.map.panTo(center);
      }
      this.showCenterMarkerChanged();
    },

    zoomChanged: function() {
      if (this.map) {
        this.map.setZoom(Number(this.zoom));
      }
    },

    mapTypeChanged: function() {
      if (this.map) {
        this.map.setMapTypeId(this.mapType);
      }
    },

    showCenterMarkerChanged: function() {
      if (!this.map) {
        return;
      }
      if (this.showCenterMarker) {
        if (!this.centerMarker) {
          this.centerMarker = document.createElement('google-map-marker');
        }
        var center = this.map.getCenter();
        this.centerMarker.latitude = center.lat();
        this.centerMarker.longitude = center.lng();
      } else {
        if (this.centerMarker) {
          //TODO(bamnet): Clean up markers so they can be removed easier from a map.
          this.centerMarker.marker.setMap(null);
          this.centerMarker = null;
        }
      }
      this.updateMarkers();
    },

    disableDefaultUIChanged: function() {
      if (!this.map) {
        return;
      }
      this.map.setOptions({disableDefaultUI: this.disableDefaultUI});
    },

    zoomableChanged: function() {
      if (!this.map) {
        return;
      }
      this.map.setOptions({
        disableDoubleClickZoom: !this.zoomable,
        scrollwheel: this.zoomable
      });
    },

    attributeChanged: function(attrName, oldVal, newVal) {
      if (!this.map) {
        return;
      }
      // Cannot use *Changed watchers for native properties.
      switch (attrName) {
        case 'draggable':
          this.map.setOptions({draggable: this.draggable});
          break;
      }
    },

    fitToMarkersChanged: function() {
      // TODO(ericbidelman): respect user's zoom level.

      if (this.map && this.fitToMarkers) {
        var latLngBounds = new google.maps.LatLngBounds();
        for (var i = 0, m; m = this.markers[i]; ++i) {
          latLngBounds.extend(
              new google.maps.LatLng(m.latitude, m.longitude));
        }

        // For one marker, don't alter zoom, just center it.
        if (this.markers.length > 1) {
          this.map.fitBounds(latLngBounds);
        }

        this.map.setCenter(latLngBounds.getCenter());
      }
    }

  });

