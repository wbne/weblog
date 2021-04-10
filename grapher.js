window.onload = function() {
console.log("hello?")
d3.select("#graphArea").html("")
svg = d3.select("#graphArea")
.append("svg")
  .classed("graph", true)
  .attr("width", 400 + 50)
  .attr("height", 400 + 50)
  .append("g")
    .attr("transform",
          "translate(" + 25 + "," + 25 + ")");
console.log("graphing area made")

var data = urlNames.map(function(d) {
  return {
    website: d[0],
    timeSpent: d[1]
  };
});

console.log("data obtainted")

var x = d3.scaleBand()
.range([ 0, width ])
.domain(data.map(function(d) { return d[data.columns[xAxisVar]]; }))
.padding(0.2);
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x))
.selectAll("text")
  .attr("transform", "translate(-10,0)rotate(-45)")
  .style("text-anchor", "end");
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height+40 )
    .text(""+data.columns[xAxisVar])

var y = d3.scaleLinear()
.domain([0, d3.max(data, function(d) {return +d[data.columns[selectedData[0]]]})])
.range([ height, 0]);
svg.append("g")
.call(d3.axisLeft(y));
svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", 50)
  .attr("y", -10)
  .text(""+data.columns[selectedData[0]])

svg.selectAll("mybar")
.data(data)
.enter()
.append("rect")
  .attr("x", function(d) { return x(d[data.columns[xAxisVar]]); })
  .attr("y", function(d) { return y(d[data.columns[selectedData[0]]]); })
  .attr("width", x.bandwidth())
  .attr("height", function(d) { return height - y(d[data.columns[selectedData[0]]]); })
  .attr("fill", "#69b3a2")
};
