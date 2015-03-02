Template.workflow.helpers({
  rootProcesses: function () {
    return Processes.find({root: true});
  }
});

function procWithDependencies (proc) {
  proc = proc || {};

  proc.children = _.map(proc.dependencies || [], function (depId) {
    return procWithDependencies(Processes.findOne(depId));
  });

  return proc;
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
    var rootProcess = Processes.findOne({root: true});
    var data = procWithDependencies(rootProcess);

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
      .attr('dy', -10)
      .attr('x', function (d) { return x(d); })
      .attr('y', function (d) { return y(d); })
      .text(function (d) { return d.name; });
    nodes.exit().remove();
  });
};


Template.process.helpers({
  dependencies: function () {
    return Processes.find({ _id: { $in: this.dependencies || [] } });
  },

  processes: function () {
    return Processes.find();
  },

  isDependency: function () {
    return Template.parentData();
  }
});

Template.process.events({
  'click .js-remove-dep': function (e, template) {
    e.stopPropagation();

    var parent = Template.parentData();
    Processes.update(parent._id, { $pull: { dependencies: this._id } });
  },

  'change select': function (e, template) {
    e.stopPropagation();

    Processes.update(this._id, { $addToSet: { dependencies: e.target.value } });
    $(e.target).val('');
  }
});