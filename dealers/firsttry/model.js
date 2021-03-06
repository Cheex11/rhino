function refreshData() {
		if (typeof google == "undefined") {
	    setTimeout(refreshData, 500);
		} else {
			Rhino.DealerMap = (function($) {
				var storeLocator = function() {};
				    window.storeLocator = storeLocator;
				    storeLocator.toRad_ = function(a) {
				        return a * Math.PI / 180
				    };
				    storeLocator.Feature = function(a, b) {
				        this.id_ = a;
				        this.name_ = b
				    };
				    storeLocator.Feature = storeLocator.Feature;
				    storeLocator.Feature.prototype.getId = function() {
				        return this.id_
				    };
				    storeLocator.Feature.prototype.getDisplayName = function() {
				        return this.name_
				    };
				    storeLocator.Feature.prototype.toString = function() {
				        return this.getDisplayName()
				    };
				    storeLocator.FeatureSet = function(a) {
				        this.array_ = [];
				        this.hash_ = {};
				        for (var b = 0, c; c = arguments[b]; b++) this.add(c)
				    };
				    storeLocator.FeatureSet = storeLocator.FeatureSet;
				    storeLocator.FeatureSet.prototype.toggle = function(a) {
				        this.contains(a) ? this.remove(a) : this.add(a)
				    };
				    storeLocator.FeatureSet.prototype.contains = function(a) {
				        return a.getId() in this.hash_
				    };
				    storeLocator.FeatureSet.prototype.getById = function(a) {
				        return a in this.hash_ ? this.array_[this.hash_[a]] : null
				    };
				    storeLocator.FeatureSet.prototype.add = function(a) {
				        a && (this.array_.push(a), this.hash_[a.getId()] = this.array_.length - 1)
				    };
				    storeLocator.FeatureSet.prototype.remove = function(a) {
				        this.contains(a) && (this.array_[this.hash_[a.getId()]] = null, delete this.hash_[a.getId()])
				    };
				    storeLocator.FeatureSet.prototype.asList = function() {
				        for (var a = [], b = 0, c = this.array_.length; b < c; b++) {
				            var d = this.array_[b];
				            null !== d && a.push(d)
				        }
				        return a
				    };
				    storeLocator.FeatureSet.NONE = new storeLocator.FeatureSet;
				    storeLocator.GMEDataFeed = function(a) {
				        this.tableId_ = a.tableId;
				        this.apiKey_ = a.apiKey;
				        a.propertiesModifier && (this.propertiesModifier_ = a.propertiesModifier)
				    };
				    storeLocator.GMEDataFeed = storeLocator.GMEDataFeed;
				    storeLocator.GMEDataFeed.prototype.getStores = function(a, b, c) {

				        var d = this,
				            e = a.getCenter();

				        a = "(ST_INTERSECTS(geometry, " + this.boundsToWkt_(a) + ") OR ST_DISTANCE(geometry, " + this.latLngToWkt_(e) + ") \x3c 20000)";
				        $.getJSON("https://www.googleapis.com/mapsengine/v1/tables/" + this.tableId_ + "/features?callback\x3d?", {
				            key: this.apiKey_,
				            where: a,
				            version: "published",
				            maxResults: 300
				        }, function(a) {
				            a = d.parse_(a);
				            d.sortByDistance_(e, a);
				            c(a)
				        })
				    };
				    storeLocator.GMEDataFeed.prototype.latLngToWkt_ = function(a) {
				        return "ST_POINT(" + a.lng() + ", " + a.lat() + ")"
				    };
				    storeLocator.GMEDataFeed.prototype.boundsToWkt_ = function(a) {
				        var b = a.getNorthEast();
				        a = a.getSouthWest();
				        return ["ST_GEOMFROMTEXT('POLYGON ((", a.lng(), " ", a.lat(), ", ", b.lng(), " ", a.lat(), ", ", b.lng(), " ", b.lat(), ", ", a.lng(), " ", b.lat(), ", ", a.lng(), " ", a.lat(), "))')"].join("")
				    };


				    storeLocator.GMEDataFeed.prototype.parse_ = function(a) {
				        if (a.error) return window.alert(a.error.message), [];
				        a = a.features;
				        if (!a) return [];
				        for (var b = [], c = 0, d; d = a[c]; c++) {
				            var e = d.geometry.coordinates,
				                e = new google.maps.LatLng(e[1], e[0]);
				            d = this.propertiesModifier_(d.properties);
				            d = new storeLocator.Store(d.id, e, null, d);
				            b.push(d)
				        }
				        return b
				    };
				    storeLocator.GMEDataFeed.prototype.propertiesModifier_ = function(a) {
				        return a
				    };

				storeLocator.GMEDataFeed.prototype.sortByDistance_ = function(a, b) {
				        b.sort(function(b, d) {
				            return b.distanceTo(a) - d.distanceTo(a)
				        })
				    };

				storeLocator.GMEDataFeedOptions = function() {};


				storeLocator.Panel = function(a, b) {
				    this.el_ = $(a);
				    this.el_.addClass("storelocator-panel");
				    this.settings_ = $.extend({
				        locationSearch: !0,
				        locationSearchLabel: "Locate a Dealer Near You",
				        featureFilter: !0,
				        directions: !0,
				        view: null
				    }, b);
				    this.directionsRenderer_ = new google.maps.DirectionsRenderer({
				        draggable: !0
				    });
				    this.directionsService_ = new google.maps.DirectionsService;
				    this.init_()
				};
				storeLocator.Panel = storeLocator.Panel;
				storeLocator.Panel.prototype = new google.maps.MVCObject;

				storeLocator.Panel.prototype.init_ = function() {
				    var a = this;
				    this.itemCache_ = {};
				    this.settings_.view && this.set("view", this.settings_.view);
				    this.filter_ = $('\x3cform class\x3d"storelocator-filter"/\x3e');
				    $("#top-banner").append(this.filter_);
				    this.settings_.locationSearch && (this.locationSearch_ = $('\x3cdiv class\x3d"location-search"\x3e\x3ch4\x3e' + this.settings_.locationSearchLabel + "\x3c/h4\x3e\x3cinput id\x3d'top-form' placeholder\x3d'Country, ZiP, State or Dealer'\x3e\x3c/div\x3e"), $(".storelocator-filter").append(this.locationSearch_), "undefined" != typeof google.maps.places ? this.initAutocomplete_() :
				        this.filter_.submit(function() {
				            var b = $("input", a.locationSearch_).val();
				            a.searchPosition(b)
				        }), this.filter_.submit(function() {
				            return !1
				        }), google.maps.event.addListener(this, "geocode", function(b) {
								$('#panel').show();
								$('#map').show();
								$('.css-location-form').hide();
								$('#panel-toggle').css('border-bottom', "solid 2px #0080DA");
								$('#panel-toggle').css('color', "#0080DA");
								$('#panel-toggle').siblings().css('border-bottom', "none");
								$('#panel-toggle').siblings().css('color', "#333333");
				            if (b.geometry) {
				                this.directionsFrom_ = b.geometry.location;
				                a.directionsVisible_ && a.renderDirections_();
				                var c = a.get("view");
				                c.highlight(null);
				                var d = c.getMap();
				                b.geometry.viewport ? d.fitBounds(b.geometry.viewport) : (d.setCenter(b.geometry.location), d.setZoom(13));
				                c.refreshView();
				                a.listenForStoresUpdate_()
				            } else a.searchPosition(b.name)
				        }));
				    if (this.settings_.featureFilter) {
				        this.featureFilter_ = $('\x3cdiv class\x3d"feature-filter"/\x3e');
				        for (var b = this.get("view").getFeatures().asList(), c = 0, d = b.length; c < d; c++) {
				            var e = b[c],
				                f = $('\x3cinput type\x3d"checkbox"/\x3e');
				            f.data("feature", e);
				            $("\x3clabel/\x3e").append(f).append(e.getDisplayName()).appendTo(this.featureFilter_)
				        }
				        this.filter_.append(this.featureFilter_);
				        this.featureFilter_.find("input").change(function() {
				            var b = $(this).data("feature");
				            a.toggleFeatureFilter_(b);
				            a.get("view").refreshView()
				        })
				    }
				    this.storeList_ = $('\x3cul class\x3d"store-list"/\x3e');
				    this.el_.append(this.storeList_);
				    this.settings_.directions && (this.directionsPanel_ = $('\x3cdiv class\x3d"directions-panel"\x3e\x3cform\x3e\x3cinput class\x3d"directions-to"/\x3e\x3cinput type\x3d"submit" value\x3d"Find directions"/\x3e\x3ca href\x3d"#" class\x3d"close-directions"\x3eClose\x3c/a\x3e\x3c/form\x3e\x3cdiv class\x3d"rendered-directions"\x3e\x3c/div\x3e\x3c/div\x3e'), this.directionsPanel_.find(".directions-to").attr("readonly", "readonly"), this.directionsPanel_.hide(),
				        this.directionsVisible_ = !1, this.directionsPanel_.find("form").submit(function() {
				            a.renderDirections_();
				            return !1
				        }), this.directionsPanel_.find(".close-directions").click(function() {
				            a.hideDirections()
				        }), this.el_.append(this.directionsPanel_))
				};

				storeLocator.Panel.prototype.toggleFeatureFilter_ = function(a) {
				    var b = this.get("featureFilter");
				    b.toggle(a);
				    this.set("featureFilter", b)
				};
				storeLocator.geocoder_ = new google.maps.Geocoder;


				storeLocator.Panel.prototype.listenForStoresUpdate_ = function() {
				        var a = this,
				            b = this.get("view");
				        this.storesChangedListener_ && google.maps.event.removeListener(this.storesChangedListener_);
				        this.storesChangedListener_ = google.maps.event.addListenerOnce(b, "stores_changed", function() {
				            a.set("stores", b.get("stores"))
				        })
				    };

				storeLocator.Panel.prototype.searchPosition = function(a) {
					// a is the input string entered in the panel.
				        var b = this;
				        a = {
				            address: a,
				            bounds: this.get("view").getMap().getBounds()
				        };
				        storeLocator.geocoder_.geocode(a, function(a, d) {
				            d == google.maps.GeocoderStatus.OK && google.maps.event.trigger(b, "geocode", a[0])
				        })
				    };
				    storeLocator.Panel.prototype.setView = function(a) {
				        this.set("view", a)
				    };

				storeLocator.Panel.prototype.view_changed = function() {
				        var a = this.get("view");
				        this.bindTo("selectedStore", a);
				        var b = this;
				        this.geolocationListener_ && google.maps.event.removeListener(this.geolocationListener_);
				        this.zoomListener_ && google.maps.event.removeListener(this.zoomListener_);
				        this.idleListener_ && google.maps.event.removeListener(this.idleListener_);
				        a.getMap().getCenter();
				        var c = function() {
				            a.clearMarkers();
				            b.listenForStoresUpdate_()
				        };
				        this.geolocationListener_ = google.maps.event.addListener(a, "load",
				            c);
				        // this.zoomListener_ = google.maps.event.addListener(a.getMap(), "zoom_changed", c);
				        this.idleListener_ = google.maps.event.addListener(a.getMap(), "idle", function() {
				            return b.idle_(a.getMap())
				        });
				        c();
				        this.bindTo("featureFilter", a);
				        this.autoComplete_ && this.autoComplete_.bindTo("bounds", a.getMap())
				    };

				storeLocator.Panel.prototype.initAutocomplete_=function(){var a=this,b=$("input",this.locationSearch_)[0];this.autoComplete_=new google.maps.places.Autocomplete(b);this.get("view")&&this.autoComplete_.bindTo("bounds",this.get("view").getMap());google.maps.event.addListener(this.autoComplete_,"place_changed",function(){google.maps.event.trigger(a,"geocode",this.getPlace())})};
				storeLocator.Panel.prototype.idle_=function(a){this.center_?a.getBounds().contains(this.center_)||(this.center_=a.getCenter(),this.listenForStoresUpdate_()):this.center_=a.getCenter()};storeLocator.Panel.NO_STORES_HTML_='\x3cli class\x3d"no-stores"\x3eThere are no stores in this area.\x3c/li\x3e';storeLocator.Panel.NO_STORES_IN_VIEW_HTML_='\x3cli class\x3d"no-stores"\x3eThere are no stores in this area. However, stores closest to you are listed below.\x3c/li\x3e';


				storeLocator.Panel.prototype.stores_changed = function() {
				        if (this.get("stores")) {
				            var a = this.get("view"),
				                b = a && a.getMap().getBounds(),
				                c = this.get("stores"),
				                d = this.get("selectedStore");
				            this.storeList_.empty();
				            c.length ? b && !b.contains(c[0].getLocation()) && this.storeList_.append(storeLocator.Panel.NO_STORES_IN_VIEW_HTML_) : this.storeList_.append(storeLocator.Panel.NO_STORES_HTML_);
				            for (var b = function() {
				                    a.highlight(this.store, !0)
				                }, e = 0, f = Math.min(10, c.length); e < f; e++) {
				                var g = c[e].getInfoPanelItem();
				                g.store = c[e];
				                d && c[e].getId() == d.getId() && $(g).addClass("highlighted");
				                g.clickHandler_ || (g.clickHandler_ = google.maps.event.addDomListener(g, "click", b));
				                this.storeList_.append(g)
				            }
				        }
				    };

				storeLocator.Panel.prototype.selectedStore_changed = function() {
				        $(".highlighted", this.storeList_).removeClass("highlighted");
				        var a = this,
				            b = this.get("selectedStore");
				        if (b) {
				            this.directionsTo_ = b;
				            this.storeList_.find("#store-" + b.getId()).addClass("highlighted");
				            this.settings_.directions && this.directionsPanel_.find(".directions-to").val(b.getDetails().title);
				            var c = a.get("view").getInfoWindow().getContent(),
				                d = $("\x3ca/\x3e").text("Directions").attr("href", "#").addClass("action").addClass("directions"),
				                e = $("\x3ca/\x3e").text("Zoom here").attr("href",
				                    "#").addClass("action").addClass("zoomhere"),
				                f = $("\x3ca/\x3e").text("Street view").attr("href", "#").addClass("action").addClass("streetview");
				            d.click(function() {
				                a.showDirections();
				                return !1
				            });
				            e.click(function() {
				                a.get("view").getMap().setOptions({
				                    center: b.getLocation(),
				                    zoom: 16
				                })
				            });
				            f.click(function() {
				                var c = a.get("view").getMap().getStreetView();
				                c.setPosition(b.getLocation());
				                c.setVisible(!0)
				            });
				            // Removed Get directions option
				            // $(c).append(d).append(e).append(f)
				        }
				    };


				// storeLocator.Panel.prototype.hideDirections=function(){this.directionsVisible_=!1;this.directionsPanel_.fadeOut();this.featureFilter_.fadeIn();this.storeList_.fadeIn();this.directionsRenderer_.setMap(null)};
				// storeLocator.Panel.prototype.showDirections=function(){var a=this.get("selectedStore");this.featureFilter_.fadeOut();this.storeList_.fadeOut();this.directionsPanel_.find(".directions-to").val(a.getDetails().title);this.directionsPanel_.fadeIn();this.renderDirections_();this.directionsVisible_=!0};
				// storeLocator.Panel.prototype.renderDirections_=function(){var a=this;if(this.directionsFrom_&&this.directionsTo_){var b=this.directionsPanel_.find(".rendered-directions").empty();this.directionsService_.route({origin:this.directionsFrom_,destination:this.directionsTo_.getLocation(),travelMode:google.maps.DirectionsTravelMode.DRIVING},function(c,d){if(d==google.maps.DirectionsStatus.OK){var e=a.directionsRenderer_;e.setPanel(b[0]);e.setMap(a.get("view").getMap());e.setDirections(c)}})}};
				storeLocator.Panel.prototype.featureFilter_changed=function(){this.listenForStoresUpdate_()};storeLocator.PanelOptions=function(){};storeLocator.StaticDataFeed=function(){this.stores_=[]};storeLocator.StaticDataFeed=storeLocator.StaticDataFeed;storeLocator.StaticDataFeed.prototype.setStores=function(a){this.stores_=a;this.firstCallback_?this.firstCallback_():delete this.firstCallback_};


				get_distance = function(lat1,lng1,lat2,lng2) {
				        c = storeLocator.toRad_(lat1),
				        d = storeLocator.toRad_(lng1),
				        b = storeLocator.toRad_(lat2),
				        e = storeLocator.toRad_(lng2);
				    a = b - c;
				    d = e - d;
				    c = Math.sin(a / 2) * Math.sin(a / 2) + Math.cos(c) * Math.cos(b) * Math.sin(d / 2) * Math.sin(d / 2);
				    return 7918 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
				}

				storeLocator.StaticDataFeed.prototype.getStores = function(bounds, features, callback) {

				  // Prevent race condition - if getStores is called before stores are loaded.
				  if (!this.stores_.length) {
				    var that = this;
				    this.firstCallback_ = function() {
				      that.getStores(bounds, features, callback);
				    };
				    return;
				  }

				  // Filter stores for features.
				  var stores = [];
				  for (var i = 0, store; store = this.stores_[i]; i++) {
				    if (store.hasAllFeatures(features)) {
				    	store.props_.distance = get_distance(bounds.getCenter().lat(), bounds.getCenter().lng(), store.location_.lat(),store.location_.lng()).toFixed(0);
				    	if (store.props_.distance < 100) {
				    		stores.push(store);
				    	}
				    }
				  }

				  this.sortByDistance_(bounds.getCenter(), stores);
				  callback(stores);
				};

				storeLocator.StaticDataFeed.prototype.sortByDistance_ = function(a, b) {
					var Alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

				    b.sort(function(b, d) {
				        return b.distanceTo(a) - d.distanceTo(a)
				    })

				    for (i = 0; i < b.length; i++) {

						// b[i].props_.distance = get_distance(a.lat(), a.lng(), b[i].location_.lat(),b[i].location_.lng()).toFixed(0);
						b[i].props_.rank = Alphabet[i];
				    	b[i].props_.distance = b[i].props_.distance.concat(" miles")


						// Adds Miles to the distance
						// if(b[i].props_.distance > 100) {
					      	// b[i].features_.array_[0].id_ = "Visible-NO"
							// b[i].features_.hash_[0] = {};
					    // } else {
					    // }
				    }
				};

				/*
				  Latitude/longitude spherical geodesy formulae & scripts
				  (c) Chris Veness 2002-2010
				  www.movable-type.co.uk/scripts/latlong.html
				*/
				storeLocator.Store=function(a,b,c,d){this.id_=a;this.location_=b;this.features_=c||storeLocator.FeatureSet.NONE;this.props_=d||{}};storeLocator.Store=storeLocator.Store;storeLocator.Store.prototype.setMarker=function(a){this.marker_=a;google.maps.event.trigger(this,"marker_changed",a)};storeLocator.Store.prototype.getMarker=function(){return this.marker_};storeLocator.Store.prototype.getId=function(){return this.id_};storeLocator.Store.prototype.getLocation=function(){return this.location_};
				storeLocator.Store.prototype.getFeatures=function(){return this.features_};storeLocator.Store.prototype.hasFeature=function(a){return this.features_.contains(a)};storeLocator.Store.prototype.hasAllFeatures=function(a){if(!a)return!0;a=a.asList();for(var b=0,c=a.length;b<c;b++)if(!this.hasFeature(a[b]))return!1;return!0};storeLocator.Store.prototype.getDetails=function(){return this.props_};

				// storeLocator.Store.prototype.generateFeaturesHTML_=function(){var a=[];a.push('\x3cul class\x3d"features"\x3e');for(var b=this.features_.asList(),c=0,d;d=b[c];c++)a.push("\x3cli\x3e"),a.push(d.getDisplayName()),a.push("\x3c/li\x3e");a.push("\x3c/ul\x3e");return a.join("")};

				storeLocator.Store.prototype.generateFeaturesHTML_ = function() {
				    var a = [];
				    a.push('\x3cul class\x3d"features"\x3e');
				    for (var b = this.features_.asList(), c = 0, d; d = b[c]; c++) a.push("\x3cli\x3e"), a.push(d.getDisplayName()), a.push("\x3c/li\x3e");
				    a.push("\x3c/ul\x3e");
				    return a.join("")
				};


				storeLocator.Store.prototype.getInfoWindowContent=function(){if(!this.content_){var a=['\x3cdiv class\x3d"store"\x3e'];a.push(this.generateFieldsHTML_(["rank","title","distance","address","phone","misc","web"]));a.push(this.generateFeaturesHTML_());a.push("\x3c/div\x3e");this.content_=a.join("")}return this.content_};storeLocator.Store.prototype.getInfoPanelContent=function(){return this.getInfoWindowContent()};storeLocator.Store.infoPanelCache_={};



				storeLocator.Store.prototype.getInfoPanelItem = function() {
				    var a = storeLocator.Store.infoPanelCache_,
				        b = this.getId();

				    if (!a[b]) {
				        var c = this.getInfoPanelContent();
				        a[b] = $('\x3cli class\x3d"store" id\x3d"store-' + this.getId() + '"\x3e' + c + "\x3c/li\x3e")[0]
				    }
				    return a[b]
				};


				storeLocator.Store.prototype.distanceTo = function(a) {
				    var b = this.getLocation(),
				        c = storeLocator.toRad_(b.lat()),
				        d = storeLocator.toRad_(b.lng()),
				        b = storeLocator.toRad_(a.lat()),
				        e = storeLocator.toRad_(a.lng());
				    a = b - c;
				    d = e - d;
				    c = Math.sin(a / 2) * Math.sin(a / 2) + Math.cos(c) * Math.cos(b) * Math.sin(d / 2) * Math.sin(d / 2);
				    return 12742 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
				};

				storeLocator.DataFeed = function() {};
				storeLocator.DataFeed = storeLocator.DataFeed;
				storeLocator.DataFeed.prototype.getStores = function(a, b, c) {};

				storeLocator.View = function(a, b, c) {
				    this.map_ = a;
				    this.data_ = b;
				    this.settings_ = $.extend({
				        updateOnPan: false,
				        geolocation: !0,
				        features: new storeLocator.FeatureSet
				    }, c);
				    this.init_();
				    google.maps.event.trigger(this, "load");
				    this.set("featureFilter", new storeLocator.FeatureSet)
				};
				storeLocator.View = storeLocator.View;
				storeLocator.View.prototype = new google.maps.MVCObject;




				storeLocator.View.prototype.geolocate_ = function() {
				        var a = this;
				        // This will only be called when geolocate is successful.  It will load a new map at the new center
				        window.navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition(function(b) {
				            b = new google.maps.LatLng(b.coords.latitude, b.coords.longitude);

				            a.getMap().setCenter(b);
				            a.getMap().setZoom(9);
				            google.maps.event.trigger(a, "load")
				        }, void 0, {
				            maximumAge: 6E4,
				            timeout: 1E4
				        })
				    };

				storeLocator.View.prototype.init_ = function() {
				        this.settings_.geolocation && this.geolocate_();
				        this.markerCache_ = {};
				        this.infoWindow_ = new google.maps.InfoWindow;
				        var a = this,
				            b = this.getMap();
				        this.set("updateOnPan", this.settings_.updateOnPan);
				        google.maps.event.addListener(this.infoWindow_, "closeclick", function() {
				            a.highlight(null)
				        });
				        google.maps.event.addListener(b, "click", function() {
				            a.highlight(null);
				            a.infoWindow_.close()
				        })
				    };

				storeLocator.View.prototype.updateOnPan_changed = function() {
				        this.updateOnPanListener_ && google.maps.event.removeListener(this.updateOnPanListener_);
				        if (this.get("updateOnPan") && this.getMap()) {
				            var a = this,
				                b = this.getMap();
				            this.updateOnPanListener_ = google.maps.event.addListener(b, "idle", function() {
				                a.refreshView()
				            })
				        }
				    };


				// Adding the marker to the map:
				storeLocator.View.prototype.addStoreToMap = function(a) {
				        var b = this.getMarker(a);
				        a.setMarker(b);
				        var c = this;
				        b.clickListener_ = google.maps.event.addListener(b, "click", function() {
				            c.highlight(a, !1)
				        });
				        b.getMap() != this.getMap() && b.setMap(this.getMap())
				    };
				    storeLocator.View.prototype.createMarker = function(a) {
				        a = {
				            position: a.getLocation()
				        };
				        var b = this.settings_.markerIcon;
				        b && (a.icon = b);
				        return new google.maps.Marker(a)
				    };
				    storeLocator.View.prototype.getMarker = function(a) {
				        var b = this.markerCache_,
				            c = a.getId();
				        b[c] || (b[c] = this.createMarker(a));
				        return b[c]
				    };
				    storeLocator.View.prototype.getInfoWindow = function(a) {
				        if (!a) return this.infoWindow_;
				        a = $(a.getInfoWindowContent());
				        this.infoWindow_.setContent(a[0]);
				        return this.infoWindow_
				    };
				    storeLocator.View.prototype.getFeatures = function() {
				        return this.settings_.features
				    };


				storeLocator.View.prototype.getFeatureById=function(a){if(!this.featureById_){this.featureById_={};for(var b=0,c;c=this.settings_.features[b];b++)this.featureById_[c.getId()]=c}return this.featureById_[a]};storeLocator.View.prototype.featureFilter_changed=function(){google.maps.event.trigger(this,"featureFilter_changed",this.get("featureFilter"));this.get("stores")&&this.clearMarkers()};
				// storeLocator.View.prototype.clearMarkers=function(){for(var a in this.markerCache_){this.markerCache_[a].setMap(null);var b=this.markerCache_[a].clickListener_;b&&google.maps.event.removeListener(b)}};storeLocator.View.prototype.refreshView=function(){var a=this;this.data_.getStores(this.getMap().getBounds(),this.get("featureFilter"),function(b){var c=a.get("stores");if(c)for(var d=0,e=c.length;d<e;d++)google.maps.event.removeListener(c[d].getMarker().clickListener_);a.set("stores",b)})};

				storeLocator.View.prototype.clearMarkers = function() {
				        for (var a in this.markerCache_) {
				            this.markerCache_[a].setMap(null);
				            var b = this.markerCache_[a].clickListener_;
				            b && google.maps.event.removeListener(b)
				        }
				    };
				    storeLocator.View.prototype.refreshView = function() {
				        var a = this;
				        a.clearMarkers();

				        this.data_.getStores(this.getMap().getBounds(), this.get("featureFilter"), function(b) {

				            var c = a.get("stores");
				            if (c)
				                for (var d = 0, e = c.length; d < e; d++) google.maps.event.removeListener(c[d].getMarker().clickListener_);
				            a.set("stores", b)

				        	if (a.stores.length) {
								$('#panel').show();
								$('#map').show();
								$('.css-location-form').hide();
				        	} else {
								$('#panel').show();
								$('.css-location-form').css('display','inline-block');
				        	}
				        })
				    };


				storeLocator.View.prototype.stores_changed=function(){for(var a=this.get("stores"),b=0,c;c=a[b];b++)this.addStoreToMap(c)};storeLocator.View.prototype.getMap=function(){return this.map_};
				storeLocator.View.prototype.highlight=function(a,b){var c=this.getInfoWindow(a);a?(c=this.getInfoWindow(a),a.getMarker()?c.open(this.getMap(),a.getMarker()):(c.setPosition(a.getLocation()),c.open(this.getMap())),b&&this.getMap().panTo(a.getLocation()),this.getMap().getStreetView().getVisible()&&this.getMap().getStreetView().setPosition(a.getLocation())):c.close();this.set("selectedStore",a)};
				storeLocator.View.prototype.selectedStore_changed=function(){google.maps.event.trigger(this,"selectedStore_changed",this.get("selectedStore"))};storeLocator.ViewOptions=function(){};})(jQuery);

				storeLocator.Store.prototype.generateFieldsHTML_ = function(fields) {
				    for (var output_array = [], index = 0, d = fields.length; index < d; index++) {
				        var current_field = fields[index];
				        	this.props_[current_field] && (output_array.push('\x3cdiv class\x3d"'), output_array.push(current_field), output_array.push('"\x3e'), output_array.push(this.props_[current_field]), output_array.push("\x3c/div\x3e"))
				    }
				    return output_array.join("")
				};
			})(Rhino.jQuery);



		}
}


refreshData();

