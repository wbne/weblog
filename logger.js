var date = new Date()
var hour = date.getHours()
var min = date.getMinutes()
var sec = date.getSeconds()
var url = window.location.hostname
var minuteTime = hour * 60 + min + sec / 60

var data
var vettedData = []
var urlNames = {}
var keys = []

if(min == -1) //TEMP CODE TO CLEAR STORAGE WHILE I'M TESTING STUFF
{
  browser.storage.sync.set({data: []});
}

var result = browser.storage.sync.get("data")
result.then(loadData, error)

function loadData(result)
{
  if(result.data != null)
  {
    data = result.data
  }
  else
  {
    data = []
  }
  //console.log(data)

  if(url.includes(".com") || url.includes(".org")) //because this extensions also counts its own webpage as a site
  {
    var temp = [url.replace("www.", "").replace(".com","").replace(".org",""), minuteTime]
    data.push(temp)
  }
  //console.log(url)
  browser.storage.sync.set({
    data: data
  });
  formatData()
}

function error()
{
    console.log("sadge")
}

function updateTime()
{
  hour = date.getHours();
  min = date.getMinutes();
  sec = date.getSeconds();
  minuteTime = hour * 60 + min + sec / 60
}

function formatData()
{
  for(i = 0; i < data.length; i++)
  {
    var tempArray
    var deltaTime
    if(i == (data.length - 1))
    {
      updateTime()
      deltaTime = minuteTime - data[i][1]
    }
    else
    {
      deltaTime = data[i+1][1] - data[i][1]
    }
    tempArray = [data[i][0], deltaTime]
    vettedData.push(tempArray)
  }

  for(i = 0; i < vettedData.length; i++)
  {
    if(vettedData[i][1] == 0)
    {
      vettedData.splice(i, 1)
      i = i - 1
    }
  }
  //console.log(vettedData)
  urlNames = {}
  for(i = 0; i < vettedData.length; i++)
  {
    if(!urlNames[vettedData[i][0]])
    {
      urlNames[vettedData[i][0]] = vettedData[i][1]
      keys.push(vettedData[i][0])
    }
    else
    {
      urlNames[vettedData[i][0]] += vettedData[i][1]
    }
  }
  //console.log(urlNames)
}

window.onload = function() {
  result = browser.storage.sync.get("data")
  result.then(loadData, error)
  setTimeout(() => {graph()}, 300)
};

function graph()
{
  var tempArray = []
  //console.log(keys)
  for(i = 0; i < keys.length; i++)
  {
    tempArray.push([keys[i], urlNames[keys[i]]])
  }
  //console.log(tempArray)
  width = 400
  height = 400

  d3.select("#graphArea").html("")
    .append('defs')
    .append('style')
    .attr('type', 'text/css')
    .text("@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300');")

  svg = d3.select("#graphArea")
  .append("svg")
    .classed("graph", true)
    .attr("width", width + 100)
    .attr("height", height + 150)
    .style("font-family", '"Open Sans", sans-serif')
    .append("g")
      .attr("transform",
            "translate(" + 50 + "," + 50 + ")");

  var dat = tempArray.map(function(d) {
    return {
      website: d[0],
      timeSpent: d[1]
    };
  });

  var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(dat.map(function(d) { return d.website; }))
  .padding(0.2);
  svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-15,0)rotate(-45)")
    .style("font-family", '"Open Sans", sans-serif')
    .style("text-anchor", "end");

  var y = d3.scaleLinear()
  .domain([0, d3.max(dat, function(d) {return +d.timeSpent})])
  .range([ height, 0]);
  svg.append("g")
  .call(d3.axisLeft(y));
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 100)
    .attr("y", -10)
    .text("Time Spent (min)")

  svg.selectAll("mybar")
  .data(dat)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.website); })
    .attr("y", function(d) { return y(d.timeSpent); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.timeSpent); })
    .attr("fill", "#77dd77")
}
