function DealerDataSources() {
  $.extend(this, new storeLocator.StaticDataFeed);
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

    var features = new storeLocator.FeatureSet;
    // features.add(this.FEATURES_.getById('Visible-' + 'YES'));

    var position = new google.maps.LatLng( row.gsx$latitude.$t, row.gsx$longitude.$t);
    var shop = this.join_([row.Shp_num_an, row.Shp_centre], ', ');
    var locality = this.join_([row.Locality, row.Postcode], ', ');
    // Distance calculated in this file.
    // var distance = get_distance(47.186064, -122.253836,row.gsx$latitude.$t,row.gsx$longitude.$t).toFixed(0).concat(" miles");

    // Distance to be calculated dynamically:
    var distance = 0;

    var store = new storeLocator.Store(i, position, features, {
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

// get_distance = function(lat1,lon1,lat2,lon2) {
//         c = storeLocator.toRad_(lat1),
//         d = storeLocator.toRad_(lon1),
//         b = storeLocator.toRad_(lat2),
//         e = storeLocator.toRad_(lon2);
//     a = b - c;
//     d = e - d;
//     c = Math.sin(a / 2) * Math.sin(a / 2) + Math.cos(c) * Math.cos(b) * Math.sin(d / 2) * Math.sin(d / 2);
//     return 7918 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
// }

/**
 * Joins elements of an array that are non-empty and non-null.
 * @private
 * @param {!Array} arr array of elements to join.
 * @param {string} sep the separator.
 * @return {string}
 */
DealerDataSources.prototype.join_ = function(arr, sep) {
  var parts = [];
  for (var i = 0, ii = arr.length; i < ii; i++) {
    arr[i] && parts.push(arr[i]);
  }
  return parts.join(sep);
};


DealerDataSources.prototype.FEATURES_ = new storeLocator.FeatureSet(
  // IF what follows the "-" matches, describe as what in B.
  new storeLocator.Feature('Visible-YES', 'Visible')
);

DealerDataSources.prototype.getFeatures = function() {
  return this.FEATURES_;
};
