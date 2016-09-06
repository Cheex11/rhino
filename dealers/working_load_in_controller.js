(function($) {
  $(function() {
    var dealerMap = $('#dealer-map');
	    if (dealerMap.length) {
	      (function(){

	      	var init = function() {

	      		var mapOptions = {
	      		      zoom: 8,
	      		      center: new google.maps.LatLng(-34.397, 150.644),
	      		      mapTypeId: google.maps.MapTypeId.ROADMAP
	      		};

	      		var map = new google.maps.Map(dealerMap[0],mapOptions);

	      	}

		      var script = document.createElement("script");
		      script.type = "text/javascript";
		      document.getElementsByTagName("body")[0].appendChild(script);
		      script.src = "https://maps.googleapis.com/maps/api/js?key=";

		      script.onload=function(){
		      	init();
		      };

      })();
    }
  });
})(Rhino.jQuery);
