$( document ).ready(function() {

  var hide_the_map = function() {
    console.log('i will hide the map!');
  }

  google.maps.event.addDomListener(window, 'load', function() {
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: new google.maps.LatLng(47.186064, -122.253836),
      zoom: 9,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var panelDiv = document.getElementById('panel');

    var data = new DealerDataSources;

    var view = new storeLocator.View(map, data, {
      geolocation: true,
      features: data.getFeatures()
    });

    new storeLocator.Panel(panelDiv, {
      view: view
    });
  });
});
