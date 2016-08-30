/**
 * @extends storeLocator.StaticDataFeed
 * @constructor
 */
function MedicareDataSource() {
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
        console.log(dealers);
        that.setStores(that.parse_(dealers));
    });
}

/**
 * @const
 * @type {!storeLocator.FeatureSet}
 * @private
 */
MedicareDataSource.prototype.FEATURES_ = new storeLocator.FeatureSet(
  // new storeLocator.Feature('Wheelchair-YES', 'Wheelchair access'),
  // new storeLocator.Feature('Audio-YES', 'Audio')
);

/**
 * @return {!storeLocator.FeatureSet}
 */
MedicareDataSource.prototype.getFeatures = function() {
  return this.FEATURES_;
};

/**
 * @private
 * @param {string} csv
 * @return {!Array.<!storeLocator.Store>}
 */


MedicareDataSource.prototype.parse_ = function(csv) {
  var stores = [];
  var rows = csv;
  // var headings = Object.keys(csv);

  // console.log(headings);


  console.log(rows[1].gsx$latitude.$t);



  for (var i = 1, row; row = rows[i]; i++) {

    // row = this.toObject_(headings, this.parseRow_(row));

    var features = new storeLocator.FeatureSet;
    // features.add(this.FEATURES_.getById('Wheelchair-' + row.Wheelchair));
    // features.add(this.FEATURES_.getById('Audio-' + row.Audio));

    var position = new google.maps.LatLng( row.gsx$latitude.$t, row.gsx$longitude.$t);
    // var position = new google.maps.LatLng( -35.352484, 149.23532);



    var shop = this.join_([row.Shp_num_an, row.Shp_centre], ', ');
    var locality = this.join_([row.Locality, row.Postcode], ', ');

    var store = new storeLocator.Store(i, position, features, {
      title: row.gsx$dealer.$t,
      address: row.gsx$address.$t,
    });
    stores.push(store);
  }
  console.log(stores);
  return stores;
};

/**
 * Joins elements of an array that are non-empty and non-null.
 * @private
 * @param {!Array} arr array of elements to join.
 * @param {string} sep the separator.
 * @return {string}
 */
MedicareDataSource.prototype.join_ = function(arr, sep) {
  var parts = [];
  for (var i = 0, ii = arr.length; i < ii; i++) {
    arr[i] && parts.push(arr[i]);
  }
  return parts.join(sep);
};

/**
 * Very rudimentary CSV parsing - we know how this particular CSV is formatted.
 * IMPORTANT: Don't use this for general CSV parsing!
 * @private
 * @param {string} row
 * @return {Array.<string>}
 */
MedicareDataSource.prototype.parseRow_ = function(row) {
  // Strip leading quote.
  if (row.charAt(0) == '"') {
    row = row.substring(1);
  }
  // Strip trailing quote. There seems to be a character between the last quote
  // and the line ending, hence 2 instead of 1.
  if (row.charAt(row.length - 2) == '"') {
    row = row.substring(0, row.length - 2);
  }

  row = row.split('","');

  return row;
};

/**
 * Creates an object mapping headings to row elements.
 * @private
 * @param {Array.<string>} headings
 * @param {Array.<string>} row
 * @return {Object}
 */
MedicareDataSource.prototype.toObject_ = function(headings, row) {
  var result = {};
  for (var i = 0, ii = row.length; i < ii; i++) {
    // console.log(headings);
    // console.log(row);
    result[headings[i]] = row[i];
  }

  return result;
};

