
function MedicareDataSource() {

  $.extend(this, new storeLocator.StaticDataFeed);

  var that = this;
  // $.get('medicare.csv', function(data) {
  //   that.setStores(that.parse_(data));
  // });

	var spreadsheetID = "1ktfOe2rvSK8G_BFHY5qeazF6hZ5J_7Mka5QiVYQmwnI";
	var rows = 0
	var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetID + "/od6/public/values?alt=json";


  $.getJSON(url, function(data) {
		var entries = data.feed.entry;

	    $(entries).each(function(){

	    	console.log(this);

	    	that.setStores(that.parse_(this));
	    	// $('.results').prepend('<h2>'+this.gsx$dealer.$t+'</h2>');
	    	// var position = new google.maps.LatLng(this.gsx$latitude.$t, this.gsx$longitude.$t);
	    });
	});
}

    // $.getJSON(url, function(data) {
    // 	var entries = data.feed.entry;

	   //  $(entries).each(function(){
	   //  	// $('.results').prepend('<h2>'+this.gsx$dealer.$t+'</h2>');
	   //  	var position = new google.maps.LatLng(this.gsx$latitude.$t, this.gsx$longitude.$t);
	   //  });
    // });

/**
 * @const
 * @type {!storeLocator.FeatureSet}
 * @private
 */
// MedicareDataSource.prototype.FEATURES_ = new storeLocator.FeatureSet(
//   new storeLocator.Feature('Wheelchair-YES', 'Wheelchair access'),
//   new storeLocator.Feature('Audio-YES', 'Audio')
// );

/**
 * @return {!storeLocator.FeatureSet}
 */
// MedicareDataSource.prototype.getFeatures = function() {
//   return this.FEATURES_;
// };

/**
 * @private
 * @param {string} csv
 * @return {!Array.<!storeLocator.Store>}
 */
MedicareDataSource.prototype.parse_ = function(csv) {
  	var stores = [];

	var position = new google.maps.LatLng(this.gsx$laltitude.$t, this.gsx$longitude.$t);

    var store = new storeLocator.Store(position, {
      title: this.gsx$dealer,
      address: this.gsx$Address
    });
    stores.push(store);
  }
  return stores;
};
