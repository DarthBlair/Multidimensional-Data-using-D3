var w = 1000,
    h = 1000,
	ux = 500,
	uy = 500,
	linklen = 100,
	ideasnum = 6,
	secwinkel = (360 / ideasnum) * (Math.PI / 180),
	offset = (270) * (Math.PI / 180);

var force = d3.layout.force()
    // .gravity(.2)
    // .charge(function(d) { return -d.size*50; }) // 80
	// .linkDistance(function(d) { return linklen*(d.target.depth); })
	.linkStrength(0.1)
	.friction(0.1)
    .size([w, h]);

var svg = d3.select("#chart").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

svg.append("svg:rect")
    .attr("width", w)
    .attr("height", h);

d3.json("immobtree2.json", function(root) {
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);

  root.fixed = true;
  root.x = ux;
  root.y = uy;

  force
      .nodes(nodes)
      .links(links)
      .start();

  var link = svg.selectAll("line")
      .data(links)
    .enter().insert("svg:line");

  var node = svg.selectAll("circle.node")
      .data(nodes)
    .enter().append("svg:circle")
      .attr("r", function(d){return d.size/4;})
      .call(force.drag);

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
});

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




