var width 	= 960,
    height 	= 500,
	r 		= 30;
	normaldistance = 0.5;
    fill = d3.scale.category20();

var color = d3.scale.category20();


var force = d3.layout.force()
    .charge(-300)
    .linkDistance(50)
    .size([width, height]);

var svg = d3.select("#viz").append("svg")
    .attr("width", width)
    .attr("height", height);
	

d3.json("nothertree.json", function(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
	  .on("tick", tick)
	  .start();

	var link = svg.selectAll("line.link")
			.data(json.links)
		.enter().append("svg:line")
			.attr("class", "link")
			//.style("stroke-width", function(d) { return Math.sqrt(d.value); });
			.attr("x1", function(d) {return d.source.posx;})
			.attr("y1", function(d) {return d.source.posy;})
			.attr("x2", function(d) {return d.target.posx;})
			.attr("y2", function(d) {return d.target.posy;})
			.style("stroke-width",4);
			
  var node = svg.selectAll("circle")
      .data(json.nodes)
    .enter().append("svg:circle")
      .attr("r", function(d) { return d.load;})
	  .attr("fixed", true)
	  .attr("cx", function(d) { return d.posx;})
      .attr("cy", function(d) { return d.posy;})
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  // force.start();
  force.stop();
  
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



// d3.json("graph.json", function(json) {
	
// var vis = d3.select("#viz").append("svg:svg")
	// .attr("width", width+80)
	// .attr("height", height+80)
	// .append("svg:g")
	// .attr("transform", "translate(40, 0)");

// // var pack = d3.layout.pack()
	// // .size([r - 4, r - 4])
	// // .value(function (d) {
		// // return d.size;
	// // });

// var tree = d3.layout.tree()
	// .size([height, width])
	// .nodes(json.nodes);
	// // .separation(function separation(a, b) {
			// // // return (a.parent == b.parent ? (((a.load+b.load)/2)*normaldistance) : 1) /a.depth;
			// // return (a.parent == b.parent ? (((a.load+b.load)/2)*normaldistance) : (((a.load+b.load)/2)*normaldistance));
	// // });


// // var diagonal = d3.svg.diagonal()
	// // // .source(function source(d) {
				// // // return [d.source.posx, d.source.posy];
	// // // })
	// // // .target(function target(d) {
				// // // return [d.target.posx, d.target.posy];
	// // // })
	// // // .attr("x1", function(d) { return d.source.posx; })
	// // // .attr("y1", function(d) { return d.source.posy; })
	// // // .attr("x2", function(d) { return d.target.posx; })
	// // // .attr("y2", function(d) { return d.target.posy; });
	// // .projection(function (d, i) {
		// // return [d.y, d.x];
	// // });

// var link = vis.selectAll("line")
      // .data(json.links)
    // .enter().append("svg:line");
	
// var node = vis.selectAll("circle")
      // .data(json.nodes)
    // .enter().append("svg:circle")
      // .attr("r", function(d) {return d.load})
	  // .attr("cx", function(d) {return d.posx})
	  // .attr("cy", function(d) {return d.poy})
      // .style("fill", function(d) { return fill(d.group); })
      // .style("stroke", function(d) { return d3.rgb(fill(d.group)).darker(); });
	  
// });

	
// var nodes = tree.nodes(json.nodes);


// var link = vis.selectAll("pathlink")
	// .data(tree.links(json.links))
	// .enter().append("svg:path")
	// .attr("class", "link")
	// // .attr("x1", function(d) { return d.source.posx; })
	// // .attr("y1", function(d) { return d.source.posy; })
	// // .attr("x2", function(d) { return d.target.posx; })
	// // .attr("y2", function(d) { return d.target.posy; });
	// .attr("d", diagonal);
	
// var node = vis.selectAll("g.node")
	// .data(nodes)
	// .enter().append("svg:g");
	// // .attr("transform", function (d, i) {
		// // return "translate(" + d.posx + "," + d.posy + ")";
	// // });
	
	// // var nodeSVG = node.append("svg")
	// // .attr("r", function(d) { return d.load; })
	// // .attr("x", -r/2)
	// // .attr("y", -r/2);
	
// node.append("svg:circle")
// .attr("r", function(d) { return d.load; })
// .attr("cx", function(d) { return d.posx; })
// .attr("cy", function(d) { return d.posy; });
// });
// node.append("svg:text")
// .attr("dx", function(d) { return d.children ? -8 : 8; })
// .attr("dy", 3)
// // .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
// .text(function(d) { return d.name; });


// d3.json("pack.json", function (packjson) {
	// var testdata = new Array();
	// for (var i = 0; i < node[0].length; i++) {
		// //testdata[i]=data;
		// testdata.push(packjson);
	// };
	
	// var testmove = nodeSVG.data(testdata).selectAll(".node")
		// .data(pack.nodes)
		// .enter().append("g")
		// .attr("class", function (d) {
			// if (d.children) {
				// if (d.depth == 0)
					// return "root";
				// else
					// return "node";
			// } else
				// return "leaf";
		// })
		// .append("circle")
		// .attr("transform", function (d) {
			// return "translate(" + (d.x + 2) + "," + (d.y + 2) + ")";
		// })
		// .attr("r", function (d) {
			// return d.r;
		// });
// });
