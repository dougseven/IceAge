// JavaScript Document

// Wait for Apache Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() {

    screenTest();
	//Syndication.getTweets('icenium', onTwitterSuccess);
    
	navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);
    
	// Prevent screen bounce
	$(document).bind('touchmove', function (e) {
		e.preventDefault();
	});
}

//=======================Twitter Operations=======================//
function twitterViewInit() {
	var twitterDS = new kendo.data.DataSource({
		transport: {
			read: {
				url: "http://search.twitter.com/search.json?q=telerik",
				dataType: "jsonp"
			}
		},
		schema: {
			data: "results"
		}
	});

	$('#twitter-listview').kendoMobileListView({
		pullToRefresh: true,
		appendOnRefresh: true,
		dataSource: twitterDS,
		template: $("#pull-to-refresh-template").text()
	});
    
}

//=======================Screen Test Operations=======================//
function screenTest() {
	onDeviceOrientationChange();
	var pixRatio = window.devicePixelRatio;
        
	var viewport = {
		width  : $(window).width(),
		height : $(window).height()
	}
    
	$("#device-info").html("Device Name: "      + device.name     + "<br />" + 
						   "Device Cordova: "   + device.cordova  + "<br />" + 
						   "Device Platform: "  + device.platform + "<br />" + 
						   "Device UUID: "      + device.uuid     + "<br />" + 
						   "Device Version: "   + device.version  + "<br />"
	);
    
	$("#screen-info").html("Height: "      + screen.height           + "<br />" + 
	                       "Width: "       + screen.width            + "<br />" + 
                           "Pixel Ratio: " + window.devicePixelRatio + "<br />"
    );
    
    $("#viewport-info").html("Height: " + viewport.height + "<br />" +
                             "Width: "  + viewport.width  + "<br />"
    );
}

function onDeviceOrientationChange(){    
	switch (window.orientation){  
		case 90:
			$("#device-orientation").text("Orientation: Landscape-left");
			break; 
		case -90:
			$("#device-orientation").text("Orientation: Landscape-right");
			break; 
		case 180:
			$("#device-orientation").text("Orientation: Portrait-upsidedown");
			break; 
		default:
			$("#device-orientation").text("Orientation: Portrait");
			break; 
	}
}

window.onorientationchange = function(){
	onDeviceOrientationChange();
};

function onTwitterSuccess(feedList) {
	$("#twitter-listview").kendoMobileListView({
		template : $("#twitterListViewTemplate").html(),
		dataSource: kendo.data.DataSource.create(feedList)
	});
}

//=======================Geolocation Operations=======================//
// onGeolocationSuccess Geolocation
function onGeolocationSuccess(position) {
	// Use Google API to get the location data for the current coordinates
	var geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	geocoder.geocode({ "latLng": latlng }, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if ((results.length > 1) && results[1]) {
				$("#current-address").html(results[0].formatted_address);
			}
		}
	});
}

// onGeolocationError Callback receives a PositionError object
function onGeolocationError(error) {
	console.log("Geolocation error: " + error.message);
	$("#current-address").html("<strong>Unable to get location from device sensor.</strong>");
}