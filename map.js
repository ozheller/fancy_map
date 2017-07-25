//Additional needs: geofield module, views_geojson module, phayes/geophp library, leafletjs library.

(function ($) {
  // Add basemap tiles and attribution.
  var baseLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  });

  // Create map and set center and zoom.
  var map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false,
    doubleClickZoom: false,
    center: [41.643095, -96.0938637],
    zoom: 4
  });

  // Add basemap to map.
  map.addLayer(baseLayer);

  // Set path to markers
  L.Icon.Default.imagePath = '/themes/contrib/bridge/images/leaflet/';
  var contentIcon = L.Icon.extend({
    options: {
      iconUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-inactive.png',
      iconRetinaUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-inactive-2x.png',
      // iconSize: [26, 30], Original
      iconSize: [26, 30],
      iconAnchor: [13, 40],
      popupAnchor: [1, -46]
    }
  });

  // State Icon Circles Defaults
  var stateTermIcon = L.Icon.extend({
    options: {
      iconSize: [60, 60],
      iconAnchor: [13, 40],
      popupAnchor: [1, -46],
      iconUrl: '/themes/contrib/bridge/images/leaflet/marker-pin.png',
      iconRetinaUrl: '/themes/contrib/bridge/images/leaflet/marker-pin-2x.png'
    }
  });

  // Icons for Project Points
  var activeContentIcon = new contentIcon({
    iconUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-active.png',
    iconRetinaUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-active-2x.png',
    // iconSize: [44, 50], Original
    iconSize: [44, 50]
  });
  var inactiveContentIcon = new contentIcon({
    iconUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-inactive.png',
    iconRetinaUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-inactive-2x.png'
  });

  // Add State points.
  function addDataToMapState(data, map, icon) {
    var dataLayer = L.geoJson(data, {
      pointToLayer: function (feature, latLng) {

        // Add new state icon based on icons uploaded to the taxonomy term.
        var stateIcon = new stateTermIcon({
          iconUrl: feature.properties.field_state_icon,
          iconRetinaUrl: feature.properties.field_state_icon_retina
        });
        return L.marker(latLng, {icon: stateIcon}).addTo(map);
      },
      onEachFeature: function (feature, layer) {
        feature.layer = layer;

        layer.on('click', function (e) {
          // Populate sidebar with dynamic content.
          $("div.sidebarContent").html(feature.properties.description);
          var zm = e.target._map._zoom;
          var cM = map.project(e.latlng);
          // var offset = map.getSize();

          if (zm < 10) {
            //Zoom in to the state view from the North America view.
            map.setView(map.unproject(cM), 10, {animate: true});

            // Check to see if the state icons are visible.
            if ($(".states").is(':visible')) {
              // Generates and loads the state menu items that appear when zoomed in
              $.getJSON('/map-terms', function (data) {
                addDataToMapMenu(data, map);
              });
              $(".states").hide();
              $(".statemenu").addClass("is-info-active");
              $(".sidebarContent").addClass("is-info-active");
            }
        // Loads the map content after a state is selected.
        // Once loaded all the maps data is present.
      $.getJSON('/map-content', function (data) {
        addDataToMapContent(data, map, new contentIcon);
      });
          }
        })

      }
    });
    dataLayer.addTo(map);
    $(".leaflet-marker-icon").addClass('states');

  }

  $.getJSON('/map-terms', function(data) {
    addDataToMapState(data, map);
  });

// Build the State menu for state and project levels.
  function addDataToMapMenu(data, map) {
    L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        feature.layer = layer;
          var $listItem = $('<li>').html(feature.properties.name).appendTo('.sidebarMenu ul');
          $listItem.on('click', function () {
            if (lastpoint) {
              lastpoint.setIcon(inactiveContentIcon);
            }
            $('.statemenu li').removeClass('is-menu-active');
            var thisLat = feature.geometry.coordinates[1];
            var thisLon = feature.geometry.coordinates[0];
            map.setView([thisLat, thisLon], 10, {animate: true});
            $("div.sidebarContent").html(feature.properties.description);
            $(this).addClass('is-menu-active');
          });
        }
    });
}

// Add Project points.
  var lastpoint;

  // Function to add project points to map.
  function addDataToMapContent(data, map, icon) {
    var dataLayer = L.geoJson(data, {
      pointToLayer: function (feature, latLng) {
        return L.marker(latLng, {icon: icon}).addTo(map);
      },
      onEachFeature: function (feature, layer) {
        feature.layer = layer;
        layer.on('click', function (e) {
          // Check to see if the last point has been set if so,
          // set the icon back to the inactive icon.
          if (lastpoint) {
            lastpoint.setIcon(inactiveContentIcon);
          }
          // Change the sidebar content to match the point selected.
          $("div.sidebarContent").html(feature.properties.description);
          // Set Active Icon.
          e.target.setIcon(activeContentIcon);
          // Assign object to lastpoint for resetting of icon
          // when the next point is selected.
          lastpoint = e.target;

          /**
           * Implement Zoom and Pan for Project points
           */
          // var zm = e.target._map._zoom;
          // var cM = map.project(e.latlng);
          // if (zm === 10) {
          //   map.setView(map.unproject(cM), 12, {animate: true});
          // }
          // if (zm === 12) {
          //   map.panTo(e.latlng);
          // }
        })
      }
    });
    // Add points to the map.
    dataLayer.addTo(map);
  }



})(jQuery);
