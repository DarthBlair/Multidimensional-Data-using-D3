var width 	= 960,
    height 	= 500,
	r 		= 30;

//Entfernen Force Branche    
	
var pack = d3.layout.pack()
    .size([r - 4, r - 4])
    .value(function(d) { return d.size; });
	
	
	
var color = d3.scale.category20();


var force = d3.layout.force()
    .charge(-300)
    .linkDistance(50)
    .size([width, height]);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
	

d3.json("graph.json", function(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .on("tick", tick)
      .start();

	var link = svg.selectAll("line.link")
			.data(json.links)
		.enter().append("line")
			.attr("class", "link")
			//.style("stroke-width", function(d) { return Math.sqrt(d.value); });
			.style("stroke-width",4);
			
  var node = svg.selectAll("circle")
      .data(json.nodes)
    .enter().append("svg:circle")
      .attr("r", function(d) { return d.load;})
	  .attr("fixed", true)
	  .attr("x", function(d) { return d.x+d.load;})
      .attr("y", function(d) { return d.y+d.load;})
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  function tick(e) {

    // Push sources up and targets down to form a weak tree.
    var k = 6 * e.alpha;
    json.links.forEach(function(d, i) {
      d.source.x -= k;
      d.target.x += k;
    });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
  }
});
	// var node = svg.selectAll("g.node")
			// .data(json.nodes)
		 // .enter().append("svg:g")
			// .attr("class", "node")
			// .call(force.drag);

	// var nodeSVG = node.append("svg")
			// .attr("x",-r/2)
			// .attr("y",-r/2);
	
	// d3.json("pack.json", function(packjson) {
		// var testdata = new Array();
		// for (var i = 0; i < node[0].length; i++) {
			// //testdata[i]=data;
			// testdata.push(packjson);
		// };
		
		// var testmove = nodeSVG.data(testdata).selectAll(".node")
				// .data(pack.nodes)
			// .enter().append("g")
				// .attr("class", function(d) {
									// if(d.children){
										// if (d.depth == 0)return "root";
										// else return "node" ;
									// }else return "leaf";
								// })
				// .append("circle")    
				// .attr("transform", function(d) { return "translate(" + (d.x+2 ) + "," + (d.y+2) + ")"; })
				// .attr("r", function(d) { return d.r; });
			
		// force.on("tick", function() {
		  // link.attr("x1", function(d) { return d.source.x; })
			  // .attr("y1", function(d) { return d.source.y; })
			  // .attr("x2", function(d) { return d.target.x; })
			  // .attr("y2", function(d) { return d.target.y; });

		  // node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		  
		// });
	// });
// });
		