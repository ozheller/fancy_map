// Requires: geofield module, views_geojson module, phayes/geophp, library, leafletjs library.

(function ($) {
  // Add basemap tiles and attribution.
  var baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
  });

  // Add Project points.
  var lastpoint;
  var operating;
  var lastoperating;

  // Set screen width to variable for use in various places
  var screenWidth = $(window).width();
  var map;
  // Create map and set center and zoom.
  if (screenWidth > 991) {
    map = L.map('map', {
      scrollWheelZoom: false,
      zoomControl: false,
      doubleClickZoom: false,
      center: [41.643095, -96.0938637],
      zoom: 4,
      zoomDelta: 0.25,
      zoomSnap: 0
    });
  }
  else {
    map = L.map('map', {
      scrollWheelZoom: false,
      zoomControl: false,
      doubleClickZoom: false,
      center: [37.643095, -93.0938637],
      zoom: 3.1,
      zoomDelta: 0.25,
      zoomSnap: 0
    });
  }

  // add zoom control with your options
  L.control.zoom({
    position: 'topright'
  }).addTo(map);


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
      iconSize: [75, 75],
      iconAnchor: [13, 40],
      popupAnchor: [1, -46],
      iconUrl: '/themes/contrib/bridge/images/leaflet/marker-pin.png',
      iconRetinaUrl: '/themes/contrib/bridge/images/leaflet/marker-pin-2x.png'
    }
  });

  // Icons for Active Project Points
  var activeContentIcon = new contentIcon({
    iconUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-active.png',
    iconRetinaUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-active-2x.png',
    // iconSize: [44, 50], Original
    iconSize: [44, 50],
    iconAnchor: [22, 60]
  });
  var inactiveContentIcon = new contentIcon({
    iconUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-inactive.png',
    iconRetinaUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-inactive-2x.png'
  });
  // Icons for Deactive Project Points
  var deactiveContentIcon = new contentIcon({
    iconUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-active-gray.png',
    iconRetinaUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-active-gray-2x.png',
    // iconSize: [44, 50], Original
    iconSize: [44, 50],
    iconAnchor: [22, 60]
  });
  var deinactiveContentIcon = new contentIcon({
    iconUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-inactive-gray.png',
    iconRetinaUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-inactive-gray-2x.png'
  });

  // Get and save the properties information on page load
  var land = $.getJSON('/map-content', function (data) {
    land = data;
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
          var stateLink = feature.properties.name;
          // Populate sidebar with dynamic content.
          $('div.sidebarContent').html(feature.properties.description);
          var zm = e.target._map._zoom;
          var origLoc = e.latlng;
          var mobZmLvl = feature.properties.field_mobile_zlevel;
          var zmlvl = feature.properties.field_zoom_level;
          var mobZmLoc = [
            feature.properties.field_mobile_location,
            feature.properties.field_mobile_location_1
          ];
          var zmloc = [
            feature.properties.field_zoom_location,
            feature.properties.field_zoom_location_1
          ];
          // var offset = map.getSize();

          screenWidth = $(window).outerWidth();
          if (screenWidth > 991) {
            // Zoom in to the state view from the North America view.
            if (feature.properties.field_zoom_location.length > 0) {
              if (zmlvl > 0) {
                map.setView(zmloc, zmlvl, {animate: true});
              } else {
                map.setView(zmloc, 10, {animate: true});
              }
            } else {
              if (zmlvl > 0) {
                map.setView(origLoc, zmlvl, {animate: true});
              } else {
                map.setView(origLoc, 10, {animate: true});
              }
            }
          }
          else {
            if (feature.properties.field_mobile_location.length > 0) {
              if (mobZmLvl > 0) {
                map.setView(mobZmLoc, mobZmLvl, {animate: true});
              } else {
                map.setView(mobZmLoc, 8, {animate: true});
              }
            } else {
              if (mobZmLvl > 0) {
                map.setView(origLoc, mobZmLvl, {animate: true});
              } else {
                map.setView(origLoc, 8, {animate: true});
              }
            }
          }
          // Check to see if the state icons are visible.
          if ($('.states').is(':visible')) {
            // Generates and loads the state menu items that appear when zoomed in
            $.getJSON('/map-terms', function (data) {
              addDataToMapMenu(data, map, stateLink);
            });
            $('.states').hide();
            $('.statemenu').addClass('is-info-active');
            $('.sidebarContent').addClass('is-info-active');
          }
          // Loads the map content after a state is selected.
          // Uses previously loaded data if possible.
          if (land == 'features') {
            addDataToMapContent(land, map, new contentIcon());
          } else {
            $.getJSON('/map-content', function (data) {
              land = data;
              addDataToMapContent(land, map, new contentIcon());
            });
          }
        });
      }
    });
    dataLayer.addTo(map);
    $('.leaflet-marker-icon').addClass('states');

  }

  // Build the State menu for state and project levels.
  function addDataToMapMenu(data, map, stateLink) {
    L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        feature.layer = layer;
        var listItem;
        if (stateLink === feature.properties.name) {
          listItem = $('<li class="is-menu-active">')
            .html(feature.properties.name).appendTo('.sidebarMenu ul');
        } else {
          listItem = $('<li>').html(feature.properties.name).appendTo('.sidebarMenu ul');
        }
        listItem.on('click', function () {
          if (lastpoint) {
            lastpoint.setIcon(inactiveContentIcon);
          }
          $('.statemenu li').removeClass('is-menu-active');
          var zmlvl = feature.properties.field_zoom_level;
          var mobZmLvl = feature.properties.field_mobile_zlevel;
          var origLoc = [
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
          ];
          var mobZmLoc = [
            feature.properties.field_mobile_location,
            feature.properties.field_mobile_location_1
          ];
          var zmloc = [
            feature.properties.field_zoom_location,
            feature.properties.field_zoom_location_1
          ];
          // var offset = map.getSize();
          screenWidth = $(window).outerWidth();
          if (screenWidth > 991) {
            // Zoom in to the state view from the North America view.
            if (feature.properties.field_zoom_location.length > 0) {
              if (zmlvl > 0) {
                map.setView(zmloc, zmlvl, {animate: true});
              } else {
                map.setView(zmloc, 10, {animate: true});
              }
            } else {
              if (zmlvl > 0) {
                map.setView(origLoc, zmlvl, {animate: true});
              } else {
                map.setView(origLoc, 10, {animate: true});
              }
            }
          }
          else {
            if (feature.properties.field_mobile_location.length > 0) {
              if (mobZmLvl > 0) {
                map.setView(mobZmLoc, mobZmLvl, {animate: true});
              } else {
                map.setView(mobZmLoc, 8, {animate: true});
              }
            } else {
              if (mobZmLvl > 0) {
                map.setView(origLoc, mobZmLvl, {animate: true});
              } else {
                map.setView(origLoc, 8, {animate: true});
              }
            }
          }
          $('div.sidebarContent').html(feature.properties.description);
          $(this).addClass('is-menu-active');

        });
      }
    });
  }

  // Function to add project points to map.
  function addDataToMapContent(land, map, icon) {
    var dataLayer = L.geoJson(land, {
      pointToLayer: function (feature, latLng) {
        operating = feature.properties.field_operating;
        var initIcon;
        if (operating === 'True') {
          initIcon = inactiveContentIcon;
        }
        else {
          initIcon = deinactiveContentIcon;
        }
        return L.marker(latLng, {icon: initIcon}).addTo(map);
      },
      onEachFeature: function (feature, layer) {
        feature.layer = layer;
        layer.on('click', function (e) {
          operating = feature.properties.field_operating;
          // Check to see if the last point has been set if so,
          // set the icon back to the inactive icon.
          if (lastpoint) {
            if (lastoperating === 'True') {
              lastpoint.setIcon(inactiveContentIcon);
            }
            else {
              lastpoint.setIcon(deinactiveContentIcon);
            }
          }
          // Change the sidebar content to match the point selected.
          $('div.sidebarContent').html(feature.properties.description);
          // Update the modal for video to match the point selectd.
          var videoUrl = feature.properties.field_external_video_link;
          if (videoUrl) {
            var video = '<iframe width=1920 height=1980 src=';
            video += videoUrl;
            video += ' frameborder=0 allowfullscreen></iframe>';
          } else {
            video = '';
          }
          $('div.video-container').html(video);

          // Set Active Icon.
          if (operating === 'True') {
            e.target.setIcon(activeContentIcon);
          }
          else {
            e.target.setIcon(deactiveContentIcon);
          }

          /**
           * Assign object to last point and if the past point was operating
           * for resetting of icon when the next point is selected.
           */
          lastpoint = e.target;
          lastoperating = e.target.feature.properties.field_operating;

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
        });
      }
    });
    // Add points to the map.
    dataLayer.addTo(map);
  }

  $.getJSON('/map-terms', function (data) {
    addDataToMapState(data, map);
  });

  /**
   * Helper events to find good zoom level and lat/long for viewing
   */
  map.on("click", function (event) {
    console.log(event.latlng);
  });

  // Add zoom level to console to better get region zoom level
  map.on('zoomend', function() {
    var zoomeLev = map.getZoom();
    console.log(zoomeLev);
  });

})(jQuery);
