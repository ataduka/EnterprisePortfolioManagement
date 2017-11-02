var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("masterData.json", function(error, data) {
  if (error) throw error;

  var ndx = crossfilter(data);

  var Pl1FARDdim = ndx.dimension(function(d) {
    return [d["PL1"], d["FARD"]];
  })

  var PL1FARDGroup = Pl1FARDdim.group()

  var pl1Accessor = function(d) {
    return d.key[0];
  }

  var fardAccessor = function(d) {
    return d.key[1];
  }

  var countAccessor = function(d) {
    return d.value;
  }

  var filteredData = PL1FARDGroup.all();
  console.log('filteredData', filteredData);

  var ageNames = d3.set(filteredData.map(fardAccessor)).values()
  var states = d3.set(filteredData.map(pl1Accessor)).values()
  var maxPopulation = d3.max(filteredData.map(countAccessor));
  console.log(maxPopulation)

  x0.domain(states);
  x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, maxPopulation]);


  var nestedData = d3.nest()
    .key(pl1Accessor)
    .key(fardAccessor)
    .rollup(function(d) {
      return {"value": countAccessor(d[0])};
    })
    .entries(filteredData)

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Population");

  var state = svg.selectAll(".state")
      .data(nestedData)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x0(d.key) + ",0)"; });

  state.selectAll("rect")
      .data(function(d) { return d.values } )
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { console.log((d.values.value)); return x1( d.key ); })
      .attr("y", function(d) { return y(d.values.value); })
      .attr("height", function(d) { return height - y(d.values.value); })
      .style("fill", function(d) { return color(d.key); });

  var legend = svg.selectAll(".legend")
      .data(ageNames.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});