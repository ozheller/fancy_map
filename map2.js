// Requires: geofield module, views_geojson module, phayes/geophp, library, leafletjs library.

(function ($) {
  // Add basemap tiles and attribution.
  var continentalLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  });


  // Add Project points.

  // Set screen width to variable for use in various places
  var screenWidth = $(window).width();
  var map;
  var officeOn;
  var retailOn;
  var bothOn;
  var inactive;
  // Create map and set center and zoom.
  if (screenWidth > 1999) {
    map = L.map('map-continental', {
      scrollWheelZoom: false,
      zoomControl: false,
      doubleClickZoom: false,
      center: [38.55665748069497,-118.63771682526162],
      zoom: 5,
      zoomDelta: 0.25,
      zoomSnap: 0
    });

    officeOn = $.getJSON('/map-office-on', function (data) {
      officeOn = data;
    });
    retailOn = $.getJSON('/map-retail-on', function (data) {
      retailOn = data;
    });
    bothOn = $.getJSON('/map-both-on', function (data) {
      bothOn = data;
    });
    inactive = $.getJSON('/map-inactive', function (data) {
      inactive = data;
    });
  } else if (screenWidth > 1499) {
    map = L.map('map-continental', {
      scrollWheelZoom: false,
      zoomControl: false,
      doubleClickZoom: false,
      center: [38.55665748069497,-106.63771682526162],
      zoom: 4.85,
      zoomDelta: 0.25,
      zoomSnap: 0
    });

    officeOn = $.getJSON('/map-office-on', function (data) {
      officeOn = data;
    });
    retailOn = $.getJSON('/map-retail-on', function (data) {
      retailOn = data;
    });
    bothOn = $.getJSON('/map-both-on', function (data) {
      bothOn = data;
    });
    inactive = $.getJSON('/map-inactive', function (data) {
      inactive = data;
    });
  } else if (screenWidth > 1199) {
    map = L.map('map-continental', {
      scrollWheelZoom: false,
      zoomControl: false,
      doubleClickZoom: false,
      center: [38.55665748069497,-106.63771682526162],
      zoom: 4.55,
      zoomDelta: 0.25,
      zoomSnap: 0
    });

    officeOn = $.getJSON('/map-office-on', function (data) {
      officeOn = data;
    });
    retailOn = $.getJSON('/map-retail-on', function (data) {
      retailOn = data;
    });
    bothOn = $.getJSON('/map-both-on', function (data) {
      bothOn = data;
    });
    inactive = $.getJSON('/map-inactive', function (data) {
      inactive = data;
    });
  } else if (screenWidth > 767) {
    map = L.map('map-continental', {
      scrollWheelZoom: false,
      zoomControl: false,
      doubleClickZoom: false,
      center: [38.55665748069497,-97.56370531978038],
      zoom: 4.25,
      zoomDelta: 0.25,
      zoomSnap: 0
    });

    officeOn = $.getJSON('/map-office-on', function (data) {
      officeOn = data;
    });
    retailOn = $.getJSON('/map-retail-on', function (data) {
      retailOn = data;
    });
    bothOn = $.getJSON('/map-both-on', function (data) {
      bothOn = data;
    });
    inactive = $.getJSON('/map-inactive', function (data) {
      inactive = data;
    });
  } else {
    return null;
  }

  // add zoom control with your options
  L.control.zoom({
    position: 'topright'
  }).addTo(map);


  // Add basemap to map.
  map.addLayer(continentalLayer);

  // Set path to markers
  L.Icon.Default.imagePath = '/themes/custom/franklin/images/leaflet/';
  var contentIcon = L.Icon.extend({
    options: {
      iconUrl: '/themes/custom/franklin/images/leaflet/listing-pin-inactive.png',
      iconRetinaUrl: '/themes/custom/franklin/images/leaflet/listing-pin-inactive-2x.png',
      iconSize: [34, 53],
      iconAnchor: [17, 53]
    }
  });

  // State Icon Circles Defaults
  var regionTermIcon = L.Icon.extend({
    options: {
      iconSize: [100, 100],
      iconAnchor: [50, 50],
      iconUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-active.png',
      iconRetinaUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-active-2x.png'
    }
  });


  // State Icon Circles Defaults
  var stateTermIcon = L.Icon.extend({
    options: {
      iconSize: [75, 75],
      iconAnchor: [37, 37],
      iconUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-active.png',
      iconRetinaUrl: '/themes/contrib/bridge/images/leaflet/listing-pin-active-2x.png'
    }
  });

  // Icons for Active Project Points
  var officeOnIcon = new contentIcon({
    iconUrl: '/themes/custom/franklin/images/leaflet/office.png',
    iconRetinaUrl: '/themes/custom/franklin/images/leaflet/office-2x.png'
  });
  var officeOnHoverIcon = new contentIcon({
    iconUrl: '/themes/custom/franklin/images/leaflet/officehover.png',
    iconRetinaUrl: '/themes/custom/franklin/images/leaflet/officehover-2x.png'
  });
  var retailOnIcon = new contentIcon({
    iconUrl: '/themes/custom/franklin/images/leaflet/retail.png',
    iconRetinaUrl: '/themes/custom/franklin/images/leaflet/retail-2x.png'
  });
  var retailOnHoverIcon = new contentIcon({
    iconUrl: '/themes/custom/franklin/images/leaflet/retailhover.png',
    iconRetinaUrl: '/themes/custom/franklin/images/leaflet/retailhover-2x.png'
  });
  var bothOnIcon = new contentIcon({
    iconUrl: '/themes/custom/franklin/images/leaflet/both.png',
    iconRetinaUrl: '/themes/custom/franklin/images/leaflet/both-2x.png'
  });
  var bothOnHoverIcon = new contentIcon({
    iconUrl: '/themes/custom/franklin/images/leaflet/bothhover.png',
    iconRetinaUrl: '/themes/custom/franklin/images/leaflet/bothhover-2x.png'
  });

  // var officeOnIcon = new contentIcon({
  //   iconUrl: '/themes/custom/franklin/images/leaflet/listing-pin-inactive.png',
  //   iconRetinaUrl: '/themes/custom/franklin/images/leaflet/listing-pin-inactive-2x.png'
  // });
  // var officeOnHoverIcon = new contentIcon({
  //   iconUrl: '/themes/custom/franklin/images/leaflet/listing-pin-active.png',
  //   iconRetinaUrl: '/themes/custom/franklin/images/leaflet/listing-pin-active-2x.png'
  // });
  // var retailOnIcon = new contentIcon({
  //   iconUrl: '/themes/custom/franklin/images/leaflet/listing-pin-inactive.png',
  //   iconRetinaUrl: '/themes/custom/franklin/images/leaflet/listing-pin-inactive-2x.png'
  // });
  // var retailOnHoverIcon = new contentIcon({
  //   iconUrl: '/themes/custom/franklin/images/leaflet/listing-pin-active.png',
  //   iconRetinaUrl: '/themes/custom/franklin/images/leaflet/listing-pin-active-2x.png'
  // });
  // var bothOnIcon = new contentIcon({
  //   iconUrl: '/themes/custom/franklin/images/leaflet/listing-pin-inactive.png',
  //   iconRetinaUrl: '/themes/custom/franklin/images/leaflet/listing-pin-inactive-2x.png'
  // });
  // var bothOnHoverIcon = new contentIcon({
  //   iconUrl: '/themes/custom/franklin/images/leaflet/listing-pin-active.png',
  //   iconRetinaUrl: '/themes/custom/franklin/images/leaflet/listing-pin-active-2x.png'
  // });

  // Icons for Deactive Project Points
  var deactiveContentIcon = new contentIcon({
    iconUrl: '/themes/custom/franklin/images/leaflet/listing-pin-active.png',
    iconRetinaUrl: '/themes/custom/franklin/images/leaflet/listing-pin-active-2x.png'
  });
  var deinactiveContentIcon = new contentIcon({
    iconUrl: '/themes/custom/franklin/images/leaflet/listing-pin-inactive.png',
    iconRetinaUrl: '/themes/custom/franklin/images/leaflet/listing-pin-inactive-2x.png'
  });

  // Add Region points.
  function addDataToMapRegion(data, map, icon) {
    var dataLayer = L.geoJson(data, {
      pointToLayer: function (feature, latLng) {

        // Add new state icon based on icons uploaded to the taxonomy term.
        var regionIcon = new regionTermIcon({
          iconUrl: feature.properties.field_state_icon,
          iconRetinaUrl: feature.properties.field_state_icon_retina
        });
        return L.marker(latLng, {icon: regionIcon}).addTo(map);
      },
      onEachFeature: function (feature, layer) {
        feature.layer = layer;

        layer.on('click', function (e) {
          var zm = e.target._map._zoom;
          var cM = e.latlng;
          var zmlvl = feature.properties.field_zoom_level;
          var zmloc = [
            feature.properties.field_zoom_location,
            feature.properties.field_zoom_location_1
          ];

          if (zm < 10) {
            // screenWidth = $(window).width();
            // if (screenWidth > 991) {
              // Zoom in to the state view from the North America view.
              if (feature.properties.field_zoom_location.length > 0) {
                if (zmlvl > 0) {
                  map.setView(zmloc, zmlvl, {animate: true});
                } else {
                  map.setView(zmloc, 6, {animate: true});
                }
              } else {
                if (zmlvl > 0) {
                  map.setView(cM, zmlvl, {animate: true});
                } else {
                  map.setView(cM, 6, {animate: true});
                }
              }
            // } else {
            //   map.setView(cM, 8, {animate: true});
            // }

            // Check to see if the state icons are visible.
            if ($('.states').is(':visible')) {
              $('.states').hide();
            }
            // Loads the map content after a state is selected.
            // Uses previously loaded data if possible.
            $('#portfolioreturnlink').removeClass('hidden');
            $('#map-nav').removeClass('hidden');

            $.getJSON('/map-states', function (data) {
              addDataToMapState(data, map);
            });
          }
        });
      }
    });
    dataLayer.addTo(map);
    $('.leaflet-marker-icon').addClass('states');

  }

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
          var zm = e.target._map._zoom;
          var cM = e.latlng;
          var zmlvl = feature.properties.field_zoom_level;
          var zmloc = [
            feature.properties.field_zoom_location,
            feature.properties.field_zoom_location_1
          ];

          if (zm < 10) {
            // screenWidth = $(window).width();
            // if (screenWidth > 991) {
            // Zoom in to the state view from the North America view.
            if (feature.properties.field_zoom_location.length > 0) {
              if (zmlvl > 0) {
                map.setView(zmloc, zmlvl, {animate: true});
              } else {
                map.setView(zmloc, 6, {animate: true});
              }
            } else {
              if (zmlvl > 0) {
                map.setView(cM, zmlvl, {animate: true});
              } else {
                map.setView(cM, 6, {animate: true});
              }
            }
            // } else {
            //   map.setView(cM, 8, {animate: true});
            // }

            // Check to see if the state icons are visible.
            if ($('.states').is(':visible')) {
              $('.states').hide();
            }
            // Loads the map content after a state is selected.
            // Uses previously loaded data if possible.
            if ((officeOn === 'features') &&
              (retailOn === 'features') &&
              (bothOn === 'features')) {
              addOfficeOnToMap(officeOn, map, new contentIcon());
              addRetailOnToMap(retailOn, map, new contentIcon());
              addBothOnToMap(bothOn, map, new contentIcon());
              addDataToMapInactive(inactive, map, new contentIcon());
            } else {
              $.getJSON('/map-office-on', function (data) {
                officeOn = data;
                addOfficeOnToMap(officeOn, map, new contentIcon());
              });
              retailOn = $.getJSON('/map-retail-on', function (data) {
                retailOn = data;
                addRetailOnToMap(retailOn, map, new contentIcon());
              });
              bothOn = $.getJSON('/map-both-on', function (data) {
                bothOn = data;
                addBothOnToMap(bothOn, map, new contentIcon());
              });

              $.getJSON('/map-inactive', function (data) {
                inactive = data;
                addDataToMapInactive(inactive, map, new contentIcon());
              });
            }
          }
        });
      }
    });
    dataLayer.addTo(map);
    $('.leaflet-marker-icon').addClass('states');

  }

  // Function to add Office New Project points to map.
  function addOfficeOnToMap(officeOn, map) {
    var dataLayer = L.geoJson(officeOn, {
      pointToLayer: function (feature, latLng) {
        return L.marker(latLng, {icon: officeOnIcon})
          .bindTooltip(feature.properties.description, {direction:'top', offset: [0,-53]})
          .addTo(map);
      },
      onEachFeature: function (feature, layer) {
        feature.layer = layer;
        feature.layer.openTooltip();
        feature.layer.closeTooltip();
        layer.on('mouseover', function (e) {
          // Hide intro text on hover
          $('#block-mapintro').hide();

          // Set Active Icon.
          e.target.setIcon(officeOnHoverIcon);

          e.target.on('mouseout', function () {
              e.target.setIcon(officeOnIcon);
          });
          e.target.on('click', function() {
              window.location = '/node/' + feature.properties.nid;
          });
        });
      }
    });
    dataLayer.addTo(map);
  }

  // Function to add Retail New Project points to map.
  function addRetailOnToMap(retailOn, map) {
    var dataLayer = L.geoJson(retailOn, {
      pointToLayer: function (feature, latLng) {
        return L.marker(latLng, {icon: retailOnIcon})
          .bindTooltip(feature.properties.description, {direction:'top', offset: [0,-53]})
          .addTo(map);
      },
      onEachFeature: function (feature, layer) {
        feature.layer = layer;
        feature.layer.openTooltip();
        feature.layer.closeTooltip();
        layer.on('mouseover', function (e) {
          // Hide intro text on hover
          $('#block-mapintro').hide();

          // Set Active Icon.
          e.target.setIcon(retailOnHoverIcon);

          e.target.on('mouseout', function () {
            e.target.setIcon(retailOnIcon);
          });
          e.target.on('click', function() {
            window.location = '/node/' + feature.properties.nid;
          });
        });
      }
    });
    dataLayer.addTo(map);
  }

  // Function to add Both Retail and Office New Project points to map.
  function addBothOnToMap(bothOn, map) {
    var dataLayer = L.geoJson(bothOn, {
      pointToLayer: function (feature, latLng) {
        return L.marker(latLng, {icon: bothOnIcon})
          .bindTooltip(feature.properties.description, {direction:'top', offset: [0,-53]})
          .addTo(map);
      },
      onEachFeature: function (feature, layer) {
        feature.layer = layer;
        feature.layer.openTooltip();
        feature.layer.closeTooltip();
        layer.on('mouseover', function (e) {
          // Hide intro text on hover
          $('#block-mapintro').hide();

          // Set Active Icon.
          e.target.setIcon(bothOnHoverIcon);

          e.target.on('mouseout', function () {
            e.target.setIcon(bothOnIcon);
          });
          e.target.on('click', function() {
            window.location = '/node/' + feature.properties.nid;
          });
        });
      }
    });
    dataLayer.addTo(map);
  }

  // Map Functionality for Old Experiences

  function addDataToMapInactive(inactive, map) {
    // Add Inactive points to the map.
    var inactiveDataLayer = L.geoJson(inactive, {
      pointToLayer: function (feature, latLng) {
        return L.marker(latLng, {icon: deinactiveContentIcon})
          .bindTooltip(feature.properties.description, {direction:'top', offset: [0,-53]})
          .addTo(map);
      },
      onEachFeature: function (feature, layer) {
        feature.layer = layer;
        feature.layer.openTooltip();
        feature.layer.closeTooltip();
        layer.on('mouseover', function (e) {

          e.target.setIcon(deactiveContentIcon);

          e.target.on('mouseout', function () {
            e.target.setIcon(deinactiveContentIcon);
          });
        });
      }
    });
    inactiveDataLayer.addTo(map);
  }


  map.on('zoomstart', function () {
    $('#block-mapintro').hide();
  });

  map.on('movestart', function () {
    $('#block-mapintro').hide();
  });

  $.getJSON('/map-regions', function (data) {
    addDataToMapRegion(data, map);
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
