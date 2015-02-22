Growthes = new Mongo.Collection('growthes');
if (Meteor.isServer) {
    Meteor.startup(function () {
        Growthes.remove({});
        if(Growthes.find().count() === 0) {
            var data = [
                {"y": "1000", "x": "20", "flg": false, "cat": "good"},
                {"y": "980", "x": "18", "flg": false, "cat": "good"},
                {"y": "1200", "x": "15", "flg": false, "cat": "good"},
                {"y": "1500", "x": "18", "flg": false, "cat": "good"},
                {"y": "990", "x": "16", "flg": false, "cat": "good"},
                {"y": "1400", "x": "22", "flg": false, "cat": "good"},
                {"y": "1100", "x": "23", "flg": false, "cat": "good"},
                {"y": "1500", "x": "16", "flg": false, "cat": "good"},
                {"y": "980", "x": "18", "flg": false, "cat": "good"},
                {"y": "1050", "x": "10", "flg": false, "cat": "good"},
                {"y": "1300", "x": "11", "flg": false, "cat": "good"},
                {"y": "1550", "x": "12", "flg": false, "cat": "good"},
                {"y": "1250", "x": "13", "flg": false, "cat": "good"},
                {"y": "1010", "x": "14", "flg": false, "cat": "good"},
                {"y": "1200", "x": "15", "flg": false, "cat": "good"},
                {"y": "980", "x": "16", "flg": false, "cat": "ng"},
                {"y": "1200", "x": "17", "flg": false, "cat": "best"},
                {"y": "1300", "x": "18", "flg": false, "cat": "best"},
                {"y": "1100", "x": "19", "flg": false, "cat": "best"},
                {"y": "1400", "x": "20", "flg": false, "cat": "good"},
                {"y": "1000", "x": "21", "flg": false, "cat": "ng"},
                {"y": "990", "x": "22", "flg": false, "cat": "ng"},
                {"y": "940", "x": "23", "flg": false, "cat": "ng"},
                {"y": "900", "x": "24", "flg": false, "cat": "ng"},
                {"y": "800", "x": "25", "flg": false, "cat": "ng"},
                {"y": "500", "x": "26", "flg": false, "cat": "ng"},
                {"y": "600", "x": "27", "flg": false, "cat": "ng"},
                {"y": "700", "x": "28", "flg": false, "cat": "ng"},
                {"y": "800", "x": "29", "flg": false, "cat": "ng"},
                {"y": "500", "x": "30", "flg": false, "cat": "ng"},
                {"y": "1200", "x": "31", "flg": false, "cat": "good"}
                ];
            for (var i = 0; i < data.length; i++) {
                Growthes.insert(data[i]);
            }
        }

        Meteor.publish("all-growth", function(){
            return Growthes.find(); //全て
        });

        Meteor.methods({
            removeAllGrowth: function () {
                return Growthes.remove({});
            }
        });
        Meteor.methods({
           getPageAsPNG: function(){
               /*
                var page = require('webpage').create();
                page.open('hello.html', function(){
                  window.setTimeout(function(){
                    page.render('scatter.png');
                    phantom.exit();
                  },200);
                });
                */
               console.log("getpageaspng");
           },
            updateGrowthes:function(Cat,Flg){
                Growthes.update({cat:Cat},{$set:{flg:!Flg}},{multi:true})
            }
        })


    })
}

if (Meteor.isClient) {
    Meteor.subscribe("all-growth");
    Template.chart.events({
        'click #getpicture':function(){
            Meteor.call('getPageAsPNG');
            console.log("getpageaspng call");
        }
    });

    Template.chart.rendered = function() {
        var hasRead = false;
        var margin= {top:30, right:30, left: 80, bottom: 50},
            width = 760 - margin.left - margin.right, height = 400 - margin.top - margin.bottom;
        var condition = {"good":"orange", "ng":"blue", "best":"red"};

        //setup x, parameter of tempreature
        var xValue = function(d){return d.x;}, //value accesseor - returns the value to encode
                xScale = d3.scale.linear().range([0,width]),//scale - maps value to a visual display encoding
                xMap = function(d){return xScale(xValue(d))}, // map function - maps from data value to display value
                xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        //setup y, parameter of light
        var yValue = function(d){return d.y;},
                yScale = d3.scale.linear().range([height, 0]),
                yMap = function(d){return yScale(yValue(d));},
                yAxis = d3.svg.axis().scale(yScale).orient("left");

        datalength = 0;

        svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        //add style to axis
        svg.selectAll(".axis line, .axis path")
                .style({'stroke':'black', 'stroke-width':'1px', 'fill':'none'});

        function drawChart(data){
            hasRead = true;
            xScale.domain([d3.min(data,xValue) - 2, d3.max(data, xValue) + 2]);
            yScale.domain([d3.min(data,yValue) - 50, d3.max(data, yValue) + 10]);
            console.log(data);
            svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("x", width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text("X");

            //yaxis
            svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 12)
                    .attr("text-anchor","end")
                    .text("Y");

            //draw dot
            svg.selectAll("circle")
                    .data(data)
                    .enter().append("circle")
                    .attr("r", function(d){
                        if(d.flg == true){
                            return 15;
                        }else{
                            return 5;
                        }
                    })
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .attr("id", function (d) {
                        return d._id
                    })
                    .attr("data-selected", function(d){
                        return d.flg
                    })
                    .style("fill", function (d) {
                        return condition[d.cat];
                    })
                    .on("click",function(d){
                        var dId = d._id;
                        var dFlg = d.flg;
                        var dCat = d.cat;
                        thisFlag = dFlg;
                        //Growthes.update({_id:dId},{$set:{flg:!thisFlag}}); //clickしたデータのみ変更する場合
                        //Growthes.update({_id:Growthes.findOne({cat:dCat})['_id']}, {$set:{flg:!thisFlag}});//1docのみ有効
                        Meteor.call("updateGrowthes",dCat, dFlg);
                        //Growthes.update({cat:dCat},{$set:{flg:!thisFlag}});/クライアントではError: Not permittedになる
                     });

            //add style to axis
            svg.selectAll(".axis line, .axis path")
                    .style({'stroke':'black', 'stroke-width':'1px', 'fill':'none'});

            console.log("drawChart");
        }

        Tracker.autorun(function(){
            data = Growthes.find().fetch();
            data.forEach(function (d) {
                d.x = +d.x;
                d.y = +d.y;
            });

            //Cursor以外にグローバルにServerとClientで変数を共有する方法が分からなかったので、配列の長さをとりあえずハードコードしています。。。。
            if(hasRead == false && data.length == 31){
                drawChart(data);

            }else if(hasRead == true) {
                console.log("else");
                //draw dot
                svg.selectAll("circle")
                    .data(data)
                    .attr("r", function (d) {
                        if (d.flg == true) {
                            return 15;
                        } else {
                            return 5;
                        }
                    })
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .attr("id", function (d) {
                        return d._id
                    })
                    .attr("data-selected", function (d) {
                        return d.flg
                    })
                    .style("fill", function (d) {
                        return condition[d.cat];
                    })
                    .on("click",function(d){
                        var dId = d._id;
                        var dFlg = d.flg;
                        var dCat = d.cat;
                        thisFlag = dFlg;
                        Meteor.call("updateGrowthes",dCat, dFlg);
                     });

            }

            })

    }
}
