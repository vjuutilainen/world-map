var width = window.innerWidth;
var height = window.innerHeight;
var scale = height / 2;
var radius = height / 2;
var fps = 60;
var mapPaths;

window.onload = function(){

	var svg = d3.select("body").append("svg").attr("width",width).attr("height",height);
	var projection = d3.geo.orthographic().rotate([0,0]).center([0,0]).scale(scale).translate([width/2, height/2]).clipAngle(90);
	var path = d3.geo.path().projection(projection);

	svg.append("circle").attr("cx",width/2).attr("cy",height/2).attr("r",radius);
	
	d3.json("topocountries.json",function(data){
		console.log(data);
		mapPaths = svg.selectAll("path")
			.data(topojson.feature(data, data.objects.countries).features)
			.enter()
			.append("path")
			.attr("d",path);

		moveMap(mapPaths);

	})


	moveMap = function(){

		setTimeout(function() {
			currentRotation = projection.rotate()[0];
			nextRotation = (currentRotation-1)%360;
			projection.rotate([nextRotation,0]);
			
			mapPaths.attr("d",function(d,i){
				return path(d) !== undefined ? path(d) : "M0 0"; // fix for getting problems parsing d="" on webkit
			});

			requestAnimationFrame(moveMap);

    		}, 1000 / fps);

	
}


}

