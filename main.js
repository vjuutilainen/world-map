var width = window.innerWidth;
var height = window.innerHeight;
var scale = 500;
window.onload = function(){

	var svg = d3.select("body").append("svg").attr("width",width).attr("height",height);
	var projection = d3.geo.mercator().scale(scale).translate([width/2, height/2]);
	var path = d3.geo.path().projection(projection);
	
	d3.json("countries.json",function(data){
		console.log(data);

		var mapPaths = svg.selectAll("path")
			.data(data.features)
			.enter()
			.append("path")
			.attr("d",path);


	})

}