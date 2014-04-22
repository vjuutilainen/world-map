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
	var speed_x = 0;
	var speed_y = 0;
	var rotation_x = 0;
	var rotation_y = 0;
	var dragging = false;

	svg.append("circle").attr("cx",width/2).attr("cy",height/2).attr("r",radius);
	
	d3.json("topocountries.json",function(data){
		console.log(data);
		mapPaths = svg.selectAll("path")
			.data(topojson.feature(data, data.objects.countries).features)
			.enter()
			.append("path")
			.attr("d",path);


	var dragstart = function(){
		
		dragging = true;
		rotation_dx = 0;
		rotation_dy = 0;

	};

	// naïve implementation of changing rotation according to dragging

	var dragmove = function(){

		// set delta
		rotation_dx = d3.event.dx;
		rotation_dy = d3.event.dy;
		
		speed_x = d3.event.dx < 2 ? 0 : d3.event.dx;
		speed_y = d3.event.dy < 2 ? 0 : d3.event.dy;

		rotation_x = (rotation_x+rotation_dx)%360;
		rotation_y = (rotation_y+rotation_dy)%360;

	};

	var dragend = function(){
		dragging = false;
		
	};

	var click = svg.on("mousedown",dragstart);

	var drag = d3.behavior.drag()
					.on("drag", dragmove)
					.on("dragend", dragend);

				
	svg.call(drag);
	moveMap();

	})


	moveMap = function(){

		setTimeout(function() {

			if(!dragging){
				
				// add delta
				rotation_x = (rotation_x+speed_x)%360;
				rotation_y = (rotation_y+speed_y)%360;

				// friction
				speed_x = speed_x * 0.95;
				speed_y = speed_y * 0.95;	
				
			}

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

