Template.workflow.rendered = function () {
  var svg = d3.select('svg')
    .attr('width', 100)
    .attr('height', 100)
    .style('background-color', '#eee');

  Tracker.autorun(function() {
    var circles = svg.selectAll('circle')
      .data(Applications.find().fetch());

    circles
      .enter()
      .append('circle')
      .attr('cx', function (d, i) { return (i+1) * 20; })
      .attr('cy', 50)
      .attr('r', 5)
      .style('fill', 'red');

    circles.exit().remove();
  });
};