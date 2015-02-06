var Growthes = new Meteor.Collection('growthes');
if (Meteor.isClient) {
 Template.chart.rendered = function(){
 var self = this;
 // d3 code here
  var margin= {top:30, right:30, left: 80, bottom: 50},
        width = 760 - margin.left - margin.right, height = 400 - margin.top - margin.bottom;

 var condition = {"ng":"orange", "ok":"blue", "me":"red"}

 //setup x, parameter of tempreature
 var xValue = function(d){return d.temp;}, //value accesseor - returns the value to encode
        xScale = d3.scale.linear().range([0,width]),//scale - maps value to a visual display encoding
        xMap = function(d){return xScale(xValue(d))}, // map function - maps from data value to display value

 //setup y, parameter of light
 var yValue = function(d){return d.light;},
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function(d){return yScale(yValue(d));},

 //setup fill color
 var cValue = function(d){return d.result},
        color = function(d){return condition2[d]};

 //create graph canvas
 var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 //
 self.handle = Meteor.autorun(function(){
  var data = Growthes.findOne().data;
    data.forEach(function(d){
        d.temp = +d.temp;
        d.light = +d.light;
    });
    //avoid overlapping axis, reduce and add few pixcels from domain
    xScale.domain([d3.min(data,xValue) - 2, d3.max(data, xValue) + 2]);
    yScale.domain([d3.min(data,yValue) - 10, d3.max(data, yValue) + 10]);
    //draw dot
    svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 3.5)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", function(d){return condition[d.result];});

 }//Meteor.autorun & drawPlot//

 }//rendered//
}//isClient//
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Growthes.remove({});
    var data = [
        {x:"20",y:"1000",d:"1",s:"0"},
        {x:"10",y:"900",d:"1",s:"0"},
        {x:"15",y:"500",d:"2",s:"0"},
        {x:"8",y:"1500",d:"2",s:"0"}
        ];
    data.forEach(function(grow){
        Growthes.insert(grow);
  });
}
