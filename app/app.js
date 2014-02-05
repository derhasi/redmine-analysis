(function ($, Rickshaw) {

  $.getJSON("data.json", function (data) {

    var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );

    // Provide color from color palette.
    for (var i in data) {
      data[i].color = palette.color();
    }

    console.log(data);
    var graph = new Rickshaw.Graph({
      element: document.querySelector("#chart"),
      width: 1200,
      height: 800,
      renderer: 'area',
      stroke: true,
      series: data
    });

    graph.render();

    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
      graph: graph
    } );
    var legend = new Rickshaw.Graph.Legend({
      graph: graph,
      element: document.querySelector('#legend')
    });
    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
      graph: graph,
      legend: legend
    });
    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
      graph: graph,
      legend: legend
    });
    var order = new Rickshaw.Graph.Behavior.Series.Order({
      graph: graph,
      legend: legend
    });

  });

}) (jQuery, Rickshaw);



