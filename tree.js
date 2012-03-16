var width 	= 960,
    height 	= 500,
	r 		= 30;
	normaldistance = 0.5;
	
var treeData = {
	"name" : "A", "load" : "10", "posx" : "50", "posy" : "250",
	"children" : [{
			"name" : "A1", "load" : "53", "posx" : "250", "posy" : "150"
		}, {
			"name" : "A2", "load" : "33", "posx" : "250", "posy" : "250"
		}, {
			"name" : "A3", "load" : "42", "posx" : "250", "posy" : "350",
			"children" : [{
					"name" : "A31", "load" : "50", "posx" : "450", "posy" : "350",
					"children" : [{
							"name" : "A311", "load" : "10", "posx" : "650", "posy" : "250"
						}, {
							"name" : "A312", "load" : "20", "posx" : "650", "posy" : "350"
						}
					]
				}
			]
		}
	]
};

var vis = d3.select("#viz").append("svg:svg")
	.attr("width", width+80)
	.attr("height", height+80)
	.append("svg:g")
	.attr("transform", "translate(40, 0)");

// var pack = d3.layout.pack()
	// .size([r - 4, r - 4])
	// .value(function (d) {
		// return d.size;
	// });

var tree = d3.layout.tree()
	.size([height, width]);
	// .separation(function separation(a, b) {
			// // return (a.parent == b.parent ? (((a.load+b.load)/2)*normaldistance) : 1) /a.depth;
			// return (a.parent == b.parent ? (((a.load+b.load)/2)*normaldistance) : (((a.load+b.load)/2)*normaldistance));
	// });


	
var diagonal = d3.svg.diagonal()
	// .source(function source(d) {
				// return [d.source.posx, d.source.posy];
	// })
	// .target(function target(d) {
				// return [d.target.posx, d.target.posy];
	// })
	// .attr("x1", function(d) { return d.source.posx; })
	// .attr("y1", function(d) { return d.source.posy; })
	// .attr("x2", function(d) { return d.target.posx; })
	// .attr("y2", function(d) { return d.target.posy; });
	.projection(function (d, i) {
		return [d.y, d.x];
	});

var nodes = tree.nodes(treeData);

var link = vis.selectAll("pathlink")
	.data(tree.links(nodes))
	.enter().append("svg:path")
	.attr("class", "link")
	// .attr("x1", function(d) { return d.source.posx; })
	// .attr("y1", function(d) { return d.source.posy; })
	// .attr("x2", function(d) { return d.target.posx; })
	// .attr("y2", function(d) { return d.target.posy; });
	.attr("d", diagonal);
	
var node = vis.selectAll("g.node")
	.data(nodes)
	.enter().append("svg:g");
	// .attr("transform", function (d, i) {
		// return "translate(" + d.posx + "," + d.posy + ")";
	// });
	
	// var nodeSVG = node.append("svg")
	// .attr("r", function(d) { return d.load; })
	// .attr("x", -r/2)
	// .attr("y", -r/2);
	
node.append("svg:circle")
.attr("r", function(d) { return d.load; })
.attr("cx", function(d) { return d.posx; })
.attr("cy", function(d) { return d.posy; });
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
