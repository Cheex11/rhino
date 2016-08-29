$( document ).ready(function() {
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

  // var Alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

  // setTimeout(
  //   function()
  //   {
  //     $(".store-list li").each(function( index ) {
  //         $(this).prepend("<div class='rank'>"+Alphabet[index]+"</div>");
  //       });
  //   }, 3000);


});
