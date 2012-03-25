var w = 1000,
    h = 1000,
	ux = 200,
	uy = 200,
	linklen = 100,
	rdonut = 10;
	ideasnum = 6,
	secwinkel = (360 / ideasnum) * (Math.PI / 180);

var svg = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

svg.append("svg:rect")
    .attr("width", w)
    .attr("height", h);
	
var JFile,
	Trees;

d3.json("rsideas.json", function(root) {
	JFile=root;
	// JFile.Nodes.forEach(function(child) {
		// renameRel(child);
	// });
	Trees = buildtree(JFile);
	
	ideasnum = Trees.length;
	secwinkel = (360 / ideasnum) * (Math.PI / 180);
	
	for(var i = 0; i < Trees.length; i++){
		init(Trees[i], i);
	}
});

function renameRel(node){
	if(typeof node.Relations != "undefined"){
		node.children=node.Relations;
		
		node.children.forEach(function(child) {
			renameRel(child);
		});
	}
};

function init(root, sector){
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes),
	  offset = sector*secwinkel;
  var force = d3.layout.force()
    // .gravity(.2)
    // .charge(function(d) { return -d.size*50; }) // 80
	// .linkDistance(function(d) { return linklen*(d.target.depth); })
	.linkStrength(0.1)
	.friction(0.1)
    .size([w, h]);


  root.fixed = true;
  root.x = ux + Math.cos(offset + secwinkel/2)*rdonut;
  root.y = uy + Math.sin(offset + secwinkel/2)*rdonut;

  force
      .nodes(nodes)
      .links(links)
      .start();

  var link = svg.selectAll("line")
      .data(links, function(d) {return d.source.Id+d.target.Id})
    .enter().insert("svg:line");

  var node = svg.selectAll("circle.node")
      .data(nodes, Object)
    .enter().append("svg:circle") //d.size/4
      // .style("fill", function(d) { return fill(d.group); })
      // .style("stroke", function(d) { return d3.rgb(fill(d.group)).darker(); })
      .attr("r", function(d){return 4;});
     // .call(force.drag);

  force.on("tick", function(e) {

    var kx = 1.2 * e.alpha;
    links.forEach(function(d, i) {
	  
	var winkel = d.target.min + (d.target.max - d.target.min)/2 + offset;
	d.target.x = d.source.x + Math.cos(winkel)*linklen;
	d.target.y = d.source.y + Math.sin(winkel)*linklen;
	var dify = d.target.y - root.y,
		difx = d.target.x - root.x,
		alpha = 0;
	if(difx == 0){
		if(dify > 0){
			alpha = (270) * (Math.PI / 180);
		}else{
			alpha = (90) * (Math.PI / 180);			
		}		
	}else{	
		alpha = Math.atan2(dify,difx);
	}
	rr = d.source.depth * linklen;
	d.target.x = root.x + Math.cos(alpha) * rr;
	d.target.y = root.y + Math.sin(alpha) * rr;
   });

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
};

function buildtree(root) {
	function findNode(id){
		for (var j = 0; j < root.Nodes.length; j++){
			if(root.Nodes[j].Id == id){
				return j;
			}
		}
	}
  var nodes = [];
  for(var i = 0; i < root.Nodes.length; i++){
		
		var childof = "not"
		if(typeof root.Nodes[i].Relations != "undefined") {
		root.Nodes[i].Relations.forEach(function(rel) {
			if(rel.NodeType == "EvolutionOf"){
				childof = rel.Content;
			}
		});
		}
		if(childof != "not"){
			if(typeof root.Nodes[findNode(childof)].children == "undefined"){
				root.Nodes[findNode(childof)].children = new Array();
			}
			root.Nodes[findNode(childof)].children.push(root.Nodes[i]);
		}else{
			nodes.push(root.Nodes[i]);
		}
	}
	console.log(nodes.length + "/" + root.Nodes.length);
  return nodes;
}

function flatten(root) {
  var nodes = [];
 function recurse(node, depth) {
	node.treesize = 1;
    if (node.children) {
	  var kidssort = [];
      node.children.forEach(function(child) {
        node.treesize += recurse(child, depth + 1);
      });
	  node.children.sort(function (a, b) {return a.treesize - b.treesize;});
	var min = 0;
		max = secwinkel;
		sec = 0;
	for (var i = 0; i < node.children.length; i++){
		sec = (node.children[i].treesize / (node.treesize-1))*secwinkel;
		node.children[i].min = min*((i+1)%2) + (max - sec)*(i%2);
		node.children[i].max = node.children[i].min + sec;
		min += sec*((i+1)%2);
		max -= sec*(i%2);
	}
	
    }
	node.depth = depth;
	nodes.push(node);
    return node.treesize;
   }
	function correct(node){
	if (node.children) {
        node.children.forEach(function(child) {
		if (node.depth > 1){
			var help = secwinkel/2;
			child.min -= help - (node.min + (node.max - node.min)/2);
			child.max -= help - (node.min + (node.max - node.min)/2);
		}
        correct(child);
      });
    }
	}
   recurse(root, 1);
   correct(root);

  return nodes;
}




