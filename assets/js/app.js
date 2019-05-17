// Define parameters
var svgWidth = 800;
var svgHeight = 700;

// Define margins
var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
};

// Define scatter plot area
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  //Initialize tooltips
  var toolTip = d3.select (".scatter")
  .append("div")
  .attr("class", "toolTip")
  .style("opacity", 0);
  
  
  //Pull in data from csv file 
  d3.csv("assets/data/data.csv").then(function(healthData) {

  //Loop through data in dataset/PARSE
  healthData.forEach(function(data) {
      data.ages = +data.ages;
      data.smokers = +data.smokers;
  });
  
  //Create scale functions 
  //Scale x to chart width
  var xScale = d3.scaleLinear()
  .domain([30, d3.max(healthData, d => d.ages)]) 
  .range([0, width]);
  
  //scale y to chart height
  var yScale = d3.scaleLinear()
  .domain([8, d3.max(healthData, d => d.smokers)])
  .range([height, 0]);
  
  //Create xAxis and yAxis function
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);
  
  //Append xAxis and yAxis to the chart
  //Set x to the bottom of the chart( add to html)
  chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis);
  
  //Set y to the y axis (add to html)
  chartGroup.append("g")
  .call(yAxis);
  
  //Create Circles
  var circlesGroup = chartGroup
    .selectAll("circle")
    .data(HealthData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.ages))
    .attr("cy", d => yScale(d.smokers))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".75");
  
  //Initialize Tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {return (`${d.state}<br>Age: ${d.age}<br>Smokers: ${d.smokers}`);
  
  }); 
  
  //Create tooltip in the chart
  chartGroup.call(toolTip);
  
  //Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function(data) {
   toolTip.show(data, this);
  
  })
  // Click mouseout
  .on("mouseout", function(data, index) {
  toolTip.hide(data);
      
  });
  
  // Add label to data points
  var text = chartGroup
  .selectAll(".stateText")
    .append("text")
    .data(HealthData)
    .enter()
    .attr("x", d => xScale(d.age))
    .attr("y", d => yScale(d.smokers))
    .style("text-anchor", "middle")
    .style("font-size", "12px")
    .text(function(data) {return data.locationAbbr});
  
    
  // Axes labels
    var smokers = chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left )
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokers(%)");
  
    var age = chartGroup
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Age (Median)");
  });