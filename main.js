var width = window.innerWidth;
var height = window.innerHeight;
var scale = 500;
var fps = 60;
var mapPaths;

window.onload = function(){

	var svg = d3.select("body").append("svg").attr("width",width).attr("height",height);
	var projection = d3.geo.orthographic().rotate([0,0]).scale(scale).translate([width/2, height/2]);
	var path = d3.geo.path().projection(projection);
	
	d3.json("countries.json",function(data){
		console.log(data);

		mapPaths = svg.selectAll("path")
			.data(data.features)
			.enter()
			.append("path")
			.attr("d",path);

		moveMap(mapPaths);

	})


	moveMap = function(){

		setTimeout(function() {
        
			currentRotation = projection.rotate()[0];
			nextRotation = currentRotation+1;
			projection.rotate([nextRotation,0]);
			mapPaths.attr("d",path);
	        
	        requestAnimationFrame(moveMap);
        
    		}, 1000 / fps);

	
}





}

