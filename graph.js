var width 	= 960,
    height 	= 500,
    r 		= 30;

//Entfernen Pack Branche    

/**
 * Layouts initialisieren
 */
var pack = d3.layout.pack()
    .size([r - 4, r - 4])
    .value(function(d) { return d.size; });

var force = d3.layout.force()
    .charge(-300)
    .linkDistance(30)
    .size([width, height]);
	


var color = d3.scale.category20();


var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);
	
var node,nodeSVG,pJson;
	

d3.json("graph.json", function(json) {
	updateForce(json);
});



function updateForce(json){
	
	force
		.nodes(json.nodes)
		.links(json.links)
		.start();

	var link = svg.selectAll("line.link")
			.data(json.links)
		.enter().append("line")
			.attr("class", "link")
			//.style("stroke-width", function(d) { return Math.sqrt(d.value); });
			.style("stroke-width",4);
			
			
	node = svg.selectAll("g.node")
			.data(json.nodes)
		 .enter().append("svg:g")
			.attr("class", "nod")
			.call(force.drag);

	nodeSVG = node.append("svg")
			.attr("x",-r/2)
			.attr("y",-r/2);
	
	d3.json("pack.json", function(json) {
			pJson=json;
			updatePack();
		});
		
		force.on("tick", function() {
		  link.attr("x1", function(d) { return d.source.x; })
			  .attr("y1", function(d) { return d.source.y; })
			  .attr("x2", function(d) { return d.target.x; })
			  .attr("y2", function(d) { return d.target.y; });

		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	});
}

function addPack(){
	var testeintrag = {"name": "test1","size":6}
	pJson[0].children.push(testeintrag);
	restart();
}

function restart(){
	var testmove = nodeSVG.data(pJson).selectAll(".node")
				.data(pack.nodes)
			
				
	var nodeEnter = testmove.enter()
		.append("g")
		.attr("class", function(d) {
									if(d.children){
										if (d.depth == 0)return "root";
										else return "node" ;
									}else return "leaf";
								});
	nodeEnter.append("circle")   
		.attr("transform", function(d) { return "translate(" + (d.x+2 ) + "," + (d.y+2) + ")"; })
		.attr("r", function(d) { return d.r; });
	
	testmove.exit().remove()
      
}

function updatePack(){
		var testdata = new Array();
		for (var i = 0; i < node[0].length; i++) {
			//testdata[i]=data;
			testdata.push(clone(pJson));
		};
		pJson=testdata;
		
		restart();
		/*
		var testmove = nodeSVG.data(testdata).selectAll(".node")
				.data(pack.nodes, function(d) { return d.name;})
			.enter().append("g")
				.attr("class", function(d) {
									if(d.children){
										if (d.depth == 0)return "root";
										else return "node" ;
									}else return "leaf";
								})
				.append("circle")    
				.attr("transform", function(d) { return "translate(" + (d.x+2 ) + "," + (d.y+2) + ")"; })
				.attr("r", function(d) { return d.r; });*/
}

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
		