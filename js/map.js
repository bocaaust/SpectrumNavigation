
function initialize() {

	var clarifai = new Clarifai.App(
		'fWZiAJZTrGCK8m5HMrNyRgk0oxhpPi7MkOTbzCHC',
		'YBEgjZ_9fJ_1TDPjqygkC9rfCF35fYdbXcGSWySD'
	);
	
	var directionsService = new google.maps.DirectionsService();

	var request = {
		origin: "Bill France & Dunn Ib",
		destination: "600 South Clyde Morris Boulevard, Daytona Beach, FL 32114",
		travelMode: 'DRIVING'
	};

	directionsService.route(request, function(result, status) {

		if (status == 'OK') {

			var mapData = result.routes[0].legs[0];

			var waypointImages = getWaypointImages(mapData);
			
			clarifai.models.predict("e2294ac7deaf4772be0eb31add8b8408", waypointImages ).then(

				function(response) {

					console.log(response)

					// Fix for random 400 responses or 1 result when there should be two.
					if (response.status == 400 || response.data.outputs.length != 2) {
						initialize();
					}
						
					else {
					
						for (var result = 0; result <= response.data.outputs.length; result++) {

							var topConcept = response.data.outputs[result].data.concepts[0];
	
							$("#waypoint" + result).html(topConcept.name + " (" + "<a target='_blank' href='" + response.data.outputs[result].input.data.image.url + "'>" + Math.round(topConcept.value * 100) + "%</a>)")
						}
					}
				},

				function(err) {
					console.log(err)
				}
			);
		}
	});

}

// http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
function toDataUrl(src, outputFormat, callback) {
	var img = new Image();
	img.crossOrigin = 'Anonymous';
	img.onload = function() {
		var canvas = document.createElement('CANVAS');
		var ctx = canvas.getContext('2d');
		var dataURL;
		canvas.height = this.height;
		canvas.width = this.width;
		ctx.drawImage(this, 0, 0);
		dataURL = canvas.toDataURL(outputFormat);
		callback(dataURL);
	};
	
	img.src = src;
	if (img.complete || img.complete === undefined) {
		img.src = src;
	}
}


function getWaypointImages(mapData) {

	var waypointImages= [];

	//for (var leg = 1; leg < mapData.steps.length; leg++) {

		//var latitude = mapData.steps[leg].end_location.lat();
		//var longitude = mapData.steps[leg].end_location.lng();

		//var streetViewUrl = "https://maps.googleapis.com/maps/api/streetview?size=640x640&location=" + latitude + "," + longitude + "&heading=0&pitch=0&key=AIzaSyBs3VUpe0kqnJcv3ZnjG-eG-sA0ZOR2OE0"


	// Substitute for real map data for demonstration purposes.
	mapData = [ 
		"https://maps.googleapis.com/maps/api/streetview?size=640x640&location=29.193084,-81.066914&fov=90&heading=0&pitch=10&key=AIzaSyBs3VUpe0kqnJcv3ZnjG-eG-sA0ZOR2OE0",
		"https://maps.googleapis.com/maps/api/streetview?size=640x640&location=29.197655,-81.054438&fov=90&heading=320&pitch=10&key=AIzaSyBs3VUpe0kqnJcv3ZnjG-eG-sA0ZOR2OE0"
	]
		
	for (var leg = 0; leg < mapData.length; leg++) {	
	
		var streetViewUrl = mapData[leg]
		
		toDataUrl(streetViewUrl, "image/jpeg", function(base64Img) {

			waypointImages.push( { base64: base64Img.split(",")[1] } )
		});
	}
	
	return waypointImages;
}