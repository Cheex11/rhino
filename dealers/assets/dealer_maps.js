$( document ).ready(function() {

    function init_map() {
        var mapOptions = {
            zoom: 11,
            center: new google.maps.LatLng(47.181033, -122.255857),
            styles: [{"featureType":"administrative.country","elementType":"geometry","stylers":[{"visibility":"simplified"},{"hue":"#ff0000"}]}]
        };

        var mapElement = document.getElementById('css-the-map');

        // Create the Google Map using our element and options defined above
        var map = new google.maps.Map(mapElement, mapOptions);

        // Let's also add a marker while we're at it
        // var marker = new google.maps.Marker({
        //     position: new google.maps.LatLng(47.181033, -122.255857),
        //     map: map,
        //     title: 'Rhino!'
        // });

		$( "#search-form" ).submit(function( event ) {
			console.log($("#search-field").val());
		  	event.preventDefault();
		});

    }



    // Google Spreadhseet
    // ID of the Google Spreadsheet
    var spreadsheetID = "1ktfOe2rvSK8G_BFHY5qeazF6hZ5J_7Mka5QiVYQmwnI";

    // Make sure it is public or set to Anyone with link can view
    var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";

    $.getJSON(url, function(data) {
    	var entries = data.feed.entry;

	    $(entries).each(function(){
	    	$('.results').prepend('<h2>'+this.gsx$dealer.$t+'</h2>');
	    });
    });


	init_map();


	//GEO COORDS
	var options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 0
	};

	function success(pos) {
	  var crd = pos.coords;

	  console.log('Your current position is:');
	  console.log('Latitude : ' + crd.latitude);
	  console.log('Longitude: ' + crd.longitude);
	  console.log('More or less ' + crd.accuracy + ' meters.');
	};

	function error(err) {
	  console.warn('ERROR(' + err.code + '): ' + err.message);
	};

	navigator.geolocation.getCurrentPosition(success, error, options);




});

