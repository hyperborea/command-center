Template.workflow.onCreated(function () {
  this.subscribe('tasks');
});

function taskWithDependencies (task) {
  task = task || {};

  task.children = _.map(task.dependencies || [], function (depId) {
    return taskWithDependencies(Tasks.findOne(depId));
  });

  return task;
}

Template.workflow.rendered = function () {
  var width = 1000,
    height = 300,
    padding = 200;

  var x = function (d) { return width - d.y - padding / 2; };
  var y = function (d) { return d.x; };

  var svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

  Tracker.autorun(function() {
    // data
    var rootProcess = Tasks.findOne({root: true});
    var data = taskWithDependencies(rootProcess);

    // layout
    var tree = d3.layout.tree().size([height, width-padding]),
      nodesData = tree.nodes(data),
      linksData = tree.links(nodesData);

    // link lines
    var links = svg.selectAll(".link").data(linksData);
    links.enter().append("path");
    links
      .attr("class", "link")
      .attr("d", d3.svg.diagonal().projection(function(d) { return [x(d), y(d)]; }));
    links.exit().remove();

    // nodes
    var nodes = svg.selectAll('.node').data(nodesData);
    nodes.enter().append('text');
    nodes
      .attr('class', 'node')
      .attr("text-anchor", "middle")
      .attr('dy', -15)
      .attr('x', function (d) { return x(d); })
      .attr('y', function (d) { return y(d); })
      .text(function (d) { return d.name; });
    nodes.exit().remove();

    var circles = svg.selectAll('circle').data(nodesData);
    circles.enter().append('circle');
    circles
      .attr('r', 10)
      .attr('cx', function (d) { return x(d); })
      .attr('cy', function (d) { return y(d); });
    circles.exit().remove();
  });
};