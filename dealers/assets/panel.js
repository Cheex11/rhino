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


  $('.map-container-toggle').click(function() {
    $(this).css('border-bottom', "solid 2px #0080DA");
    $(this).css('color', "#0080DA");
    $(this).siblings().css('border-bottom', "none");
    $(this).siblings().css('color', "#333333");

    var id_to_make_visible = $(this).attr('id').substring(0, $(this).attr('id').indexOf('-toggle'));
    var id_to_hide = $(this).siblings().attr('id').substring(0, $(this).siblings().attr('id').indexOf('-toggle'));


    $('#' + id_to_make_visible + '').css('display','block');
    $('#' + id_to_hide + '').css('display','none');

  })

});
