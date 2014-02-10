var width = window.innerWidth;
var height = window.innerHeight;

window.onload = function(){

	var svg = d3.select("body").append("svg").attr("width",width).attr("height",height);

	d3.json("countries.json",function(data){
		console.log(data);
		

	})

}