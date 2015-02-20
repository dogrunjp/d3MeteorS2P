Growthes = new Mongo.Collection('growthes');

if (Meteor.isServer) {
    Meteor.startup(function () {
        if(Growthes.find().count() === 0) {
            var data = [
                {x:"200",y:"100",cat:"1",flg:false},
                {x:"100",y:"90",cat:"1",flg:true},
                {x:"150",y:"50",cat:"2",flg:false},
                {x:"80",y:"150",cat:"2",flg:false}
                ];
            for (var i = 0; i < data.length; i++) {
                Growthes.insert(data[i]);
            }
        }
        Meteor.publish("all-growth", function(){
            return Growthes.find();
        });
  var phantomJS = Meteor.npmRequire("phantomjs");
  var spawn = Meteor.npmRequire('child_process').spawn;
        return Meteor.methods({
       getPageAsPNG: function(){
    command = spawn(phantomJS.path, ['assets/app/phantomDriver.js']);
    command.stdout.on('data', function (data) {
                    console.log('stdout: ' + data);
                });
                command.stderr.on('data', function (data) {
                    console.log('stderr: ' + data);
                });
                command.on('exit', function (code) {
                    console.log('child process exited with code ' + code);
                });
               //console.log("getpageaspng");
       }
        })

    })
}

if (Meteor.isClient) {
    Meteor.subscribe("all-growth");
    Template.chart.events({
        'click rect':function(e){
            var dId = e.target.id;
            var dFlg = e.target.getAttribute('data-selected');
            thisFlag = Growthes.findOne({_id: dId},{fields:{flg:1}});
            Growthes.update({_id:dId},{$set:{flg:!thisFlag.flg}});
        },
        'click #getpicture':function(){
            Meteor.call('getPageAsPNG');
            var  d = new Date();
            var sec = d.getSeconds();
            var ms = d.getMilliseconds();
            var imgs = "./mp.png?="+ sec + ms;
            Meteor.setTimeout(function(){
              window.open(imgs)
            }, 1000);
        }
    });

    Template.chart.rendered = function() {
        svg = d3.select("#sp").append("svg")
            .attr("width", 275)
            .attr("height", 275)
            .append("g");

        Tracker.autorun(function(){
            data = Growthes.find().fetch();
            data.forEach(function (d) {
                d.x = +d.x;
                d.y = +d.y;
            });

            svg.selectAll("g")
                .data(data)
                .enter()
                .append("rect");

            data.forEach(function (d) {
                d.x = +d.x;
                d.y = +d.y;
             });
            svg.selectAll("rect")
                .data(data)
                .attr("x", function(d, i){return (i - 1) * 38})
                .attr("width", 35)
                .attr("y", function(d){return +d.y})
                .attr("height", function(d){return 300 - d.y})
                .attr("fill", function(d){
                    if(d.flg == true){
                        return "orange"
                    }else{
                        return "steelBlue"
                    }
                })
                .attr("id", function(d){return d._id})
                .attr("data-selected", function(d){return d.flg})
                .attr("transform", "translate(30,30)");

        })

    }
}
