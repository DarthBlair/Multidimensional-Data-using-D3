      var treeData = {"name" : "A", "children" : [
{"name" : "A1" },
{"name" : "A2" },
{"name" : "A3", "children": [
{"name" : "A31", "children" :[
{"name" : "A311" },
{"name" : "A312" }
]}] }
      ]};

      var vis = d3.select("#viz").append("svg:svg")
.attr("width", 400)
.attr("height", 300)
.append("svg:g")
.attr("transform", "translate(40, 0)");

      var tree = d3.layout.tree()
.size([300,150]);

      var diagonal = d3.svg.diagonal()
.projection(function(d) { return [d.y, d.x]; });

      var nodes = tree.nodes(treeData);
      var link = vis.selectAll("pathlink")
.data(tree.links(nodes))
.enter().append("svg:path")
.attr("class", "link")
.attr("d", diagonal);

      var node = vis.selectAll("g.node")
.data(nodes)
.enter().append("svg:g")
.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

      node.append("svg:circle")
.attr("r", 4.5);

      node.append("svg:text")
.attr("dx", function(d) { return d.children ? -8 : 8; })
.attr("dy", 3)
.attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
.text(function(d) { return d.name; });

d3.json("pack.json", function(packjson) {
		var testdata = new Array();
		for (var i = 0; i < node[0].length; i++) {
			//testdata[i]=data;
			testdata.push(packjson);
		};
		
		var testmove = nodeSVG.data(testdata).selectAll(".node")
				.data(pack.nodes)
			.enter().append("g")
				.attr("class", function(d) {
									if(d.children){
										if (d.depth == 0)return "root";
										else return "node" ;
									}else return "leaf";
								})
				.append("circle")    
				.attr("transform", function(d) { return "translate(" + (d.x+2 ) + "," + (d.y+2) + ")"; })
				.attr("r", function(d) { return d.r; });
	});