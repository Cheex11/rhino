(function waitForElement($, DealerMap){
  if (typeof google === "undefined") {
    setTimeout(function(){
        waitForElement($, Rhino.DealerMap);
    },100);
  } else {

      window.map = new google.maps.Map(document.getElementById('dealer-map'), {
        center: new google.maps.LatLng(47, -122),
        zoom: 9,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      var panelDiv = document.getElementById('dealer-panel');
      var data = new DealerMap.DealerDataSources;
      var view = new storeLocator.View(map, data, {
        geolocation: true,
        features: data.getFeatures()
      });

      new storeLocator.Panel(panelDiv, {view: view});

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(pos);
          $('#top-form').val(pos.lat + ',' + pos.lng);
          $('#top-form').submit();
          $('#top-form').val('');
        });
      }


      var ui = {
        map_element: $('#dealer-map'),
        dealer_element: $('#dealer-panel'),
        toggle: $('.map-container-toggle')
      }

      ui.toggle.click(function() {
        $(this).css('border-bottom', "solid 2px #0080DA");
        $(this).css('color', "#0080DA");
        $(this).siblings().css('border-bottom', "none");
        $(this).siblings().css('color', "#333333");

        var id_to_make_visible = $(this).attr('id').substring(0, $(this).attr('id').indexOf('-toggle'));
        var id_to_hide = $(this).siblings().attr('id').substring(0, $(this).siblings().attr('id').indexOf('-toggle'));

        $('#' + id_to_make_visible + '').css('display','block');
        $('#' + id_to_hide + '').css('display','none');
        center = map.getCenter();
        google.maps.event.trigger(map, 'resize');
        map.setCenter(center);
        map.setZoom(8);

      })
    }
})(Rhino.jQuery, Rhino.DealerMap);


