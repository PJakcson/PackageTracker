
  (function() {

    Polymer('google-map-marker', {

      /**
       * A Google Maps marker object.
       *
       * @property marker
       * @type google.maps.Marker
       * @default null
       */
      marker: null,

      /**
       * The Google map object.
       *
       * @property map
       * @type google.maps.Map
       * @default null
       */
      map: null,

      /**
       * A Google Map Infowindow object.
       *
       * @property info
       * @type google.map.InfoWindow
       * @default null
       */
      info: null,

      /**
       * Image URL for the marker icon.
       *
       * @attribute icon
       * @type string
       * @default null
       */
      icon: null,

      publish: {
        /**
         * The marker's longitude coordinate.
         *
         * @attribute longitude
         * @type number
         * @default null
         */
        longitude: {value: null, reflect: true},

        /**
         * The marker's latitude coordinate.
         *
         * @attribute latitude
         * @type number
         * @default null
         */
        latitude: {value: null, reflect: true}
      },

      observe: {
        latitude: 'updatePosition',
        longitude: 'updatePosition',
      },

      updatePosition: function() {
        if (this.marker && this.latitude != null && this.longitude != null) {
          this.marker.setPosition({lat: this.latitude, lng: this.longitude});
        }
      },

      iconChanged: function() {
        if (this.marker) {
          this.marker.setIcon(this.icon);
        }
      },

      mapChanged: function() {
        if (this.map && this.map instanceof google.maps.Map) {
          this.mapReady();
        }
      },

      contentChanged: function() {
        this.onMutation(this, this.contentChanged); // Watch for future updates.

        var content = this.innerHTML;
        if (content) {
          if (!this.info) {
            // Create a new infowindow
            this.info = new google.maps.InfoWindow();
            this.infoHandler_ = google.maps.event.addListener(this.marker, 'click', function() {
              this.info.open(this.map, this.marker);
            }.bind(this));
          }
          this.info.setContent(content);
        } else {
          if (this.info) {
            // Destroy the existing infowindow.  It doesn't make sense to have an empty one.
            google.maps.event.removeListener(this.infoHandler_);
            this.info = null;
          }
        }
      },

      mapReady: function() {
        this.marker = new google.maps.Marker({
          map: this.map,
          position: new google.maps.LatLng(this.latitude, this.longitude),
          title: this.title,
          draggable: this.draggable,
          visible: !this.hidden,
          icon: this.icon
        });
        this.contentChanged();
        setupDragHandler_.bind(this)();
      },

      attributeChanged: function(attrName, oldVal, newVal) {
        if (!this.marker) {
          return;
        }

        // Cannot use *Changed watchers for native properties.
        switch (attrName) {
          case 'hidden':
            this.marker.setVisible(!this.hidden);
            break;
          case 'draggable':
            this.marker.setDraggable(this.draggable);
            setupDragHandler_.bind(this)();
            break;
          case 'title':
            this.marker.setTitle(this.title);
            break;
        }
      }

    });

    function onDragEnd_(e, details, sender) {
      this.latitude = e.latLng.lat();
      this.longitude = e.latLng.lng();
    }

    function setupDragHandler_() {
      if (this.draggable) {
        this.dragHandler_ = google.maps.event.addListener(
            this.marker, 'dragend', onDragEnd_.bind(this));
      } else {
        google.maps.event.removeListener(this.dragHandler_);
        this.dragHandler_ = null;
      }
    }

  })();

