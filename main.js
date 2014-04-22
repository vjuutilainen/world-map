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

	var rotation_dx = 0;
	var rotation_dy = 0;
	var rotation_x = 0;
	var rotation_y = 0;

	svg.append("circle").attr("cx",width/2).attr("cy",height/2).attr("r",radius);
	
	d3.json("topocountries.json",function(data){
		console.log(data);
		mapPaths = svg.selectAll("path")
			.data(topojson.feature(data, data.objects.countries).features)
			.enter()
			.append("path")
			.attr("d",path);


	// naïve implementation of changing rotation according to dragging

	var dragmove = function(d){

		// set delta
		rotation_dx = d3.event.dx;
		rotation_dy = d3.event.dy;

		// set speed limit for the spinning
		
		if(rotation_dx > 0){
		rotation_dx = rotation_dx + d3.event.dx > 5 ? 5 : rotation_dx + d3.event.dx;
		}
		if(rotation_dx < 0){
		rotation_dx = rotation_dx + d3.event.dx < -5 ? -5 : rotation_dx + d3.event.dx;
		}

		if(rotation_dy > 0){
		rotation_dy = rotation_dy + d3.event.dy > 5 ? 5 : rotation_dy + d3.event.dy;
		}
		if(rotation_dy < 0){
		rotation_dy = rotation_dy + d3.event.dy < -5 ? -5 : rotation_dy + d3.event.dy;
		}

	};

	var drag = d3.behavior.drag()
					.on("drag", dragmove);
				
	svg.call(drag);
	moveMap(mapPaths);

	})


	moveMap = function(){

		setTimeout(function() {
			
			// friction
			rotation_dx = rotation_dx * 0.95;
			rotation_dy = rotation_dy * 0.95;

			// add delta
			rotation_x = (rotation_x+rotation_dx)%360;
			rotation_y = (rotation_y+rotation_dy)%360;

			// set rotation of current projection
			projection.rotate([rotation_x,-rotation_y]);
			
			// update paths
			mapPaths.attr("d",function(d,i){
				return path(d) !== undefined ? path(d) : "M0 0"; // fix for getting problems parsing d="" on webkit
			});

			requestAnimationFrame(moveMap);

    		}, 1000 / fps);

	
}


}

