(function($) {
  $(function() {
    var dealerMap = $('#dealer-map');
	    if (dealerMap.length) {
	      (function(){

	      	var init = function() {
				function DealerDataSources() {
				  $.extend(this, new Rhino.storeLocator.StaticDataFeed);
				    var spreadsheetID = "1ktfOe2rvSK8G_BFHY5qeazF6hZ5J_7Mka5QiVYQmwnI";
				    var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";
				    var that = this;
				    var dealers = []

				    $.getJSON(url, function(data) {
				        var entries = data.feed.entry;
				        $(entries).each(function(){
				            // console.log(Object.keys(this));
				            dealers.push(this);
				        });
				        that.setStores(that.parse_(dealers));
				    });
				  }

				DealerDataSources.prototype.parse_ = function(csv) {
				  var stores = [];
				  var rows = csv;

				  for (var i = 1, row; row = rows[i]; i++) {

				    // console.log(this);

				    var features = new Rhino.storeLocator.FeatureSet;
				    // features.add(this.FEATURES_.getById('Visible-' + 'YES'));

				    var position = new google.maps.LatLng( row.gsx$latitude.$t, row.gsx$longitude.$t);
				    var shop = this.join_([row.Shp_num_an, row.Shp_centre], ', ');
				    var locality = this.join_([row.Locality, row.Postcode], ', ');
				    // Distance calculated in this file.
				    // var distance = get_distance(47.186064, -122.253836,row.gsx$latitude.$t,row.gsx$longitude.$t).toFixed(0).concat(" miles");

				    // Distance to be calculated dynamically:
				    var distance = 0;

				    var store = new Rhino.storeLocator.Store(i, position, features, {
				      title: row.gsx$dealer.$t,
				      distance: distance,
				      address: row.gsx$address.$t,
				      web: "<a href='" + row.gsx$website.$t + "'>View Website</a>",
				      phone: row.gsx$phone.$t
				    });
				    stores.push(store);
				  }
				  return stores;
				};

				DealerDataSources.prototype.join_ = function(arr, sep) {
				  var parts = [];
				  for (var i = 0, ii = arr.length; i < ii; i++) {
				    arr[i] && parts.push(arr[i]);
				  }
				  return parts.join(sep);
				};


				DealerDataSources.prototype.FEATURES_ = new Rhino.storeLocator.FeatureSet(
				);

				DealerDataSources.prototype.getFeatures = function() {
				  return this.FEATURES_;
				};

				var map = new google.maps.Map(document.getElementById('dealer-map'), {
				  center: new google.maps.LatLng(47.186064, -122.253836),
				  zoom: 9,
				  mapTypeId: google.maps.MapTypeId.ROADMAP
				});

				var panelDiv = document.getElementById('panel');

				var data = new DealerDataSources;

				var view = new Rhino.storeLocator.View(map, data, {
				  geolocation: true,
				  features: data.getFeatures()
				});

				new Rhino.storeLocator.Panel(panelDiv, {
				  view: view
				});
	      	}




		      	init();


      })();
    }
  });
})(Rhino.jQuery);
