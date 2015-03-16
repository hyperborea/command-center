Template.workflow.helpers({
  rootTasks: function () {
    return Tasks.find({root: true});
  }
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
      .attr('dy', -10)
      .attr('x', function (d) { return x(d); })
      .attr('y', function (d) { return y(d); })
      .text(function (d) { return d.name; });
    nodes.exit().remove();
  });
};


Template.task.helpers({
  dependencies: function () {
    return Tasks.find({ _id: { $in: this.dependencies || [] } });
  },

  tasks: function () {
    return Tasks.find();
  },

  isDependency: function () {
    return Template.parentData();
  },

  showSelect: function () {
    return Session.equals('showSelectForProcess', this._id);
  }
});

Template.task.events({
  'click .js-remove-dep': function (e, template) {
    e.stopPropagation();

    var parent = Template.parentData();
    Tasks.update(parent._id, { $pull: { dependencies: this._id } });
  },

  'click .js-show-select': function (e, template) {
    Session.set('showSelectForProcess', this._id);
  },

  'change select': function (e, template) {
    e.stopPropagation();

    Tasks.update(this._id, { $addToSet: { dependencies: e.target.value } });
    $(e.target).val('');
  }
});