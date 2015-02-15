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
        // Growthesのdocuments全てをサーバからpublish
        //collectionを全共有しない場合は、meteor remove autopublishし明示的にpublishしておく
        Meteor.publish("all-growth", function(){
            return Growthes.find(); //全て
        });

        // コンソールやclientからのMeteor.call('removeAllGrowth')でGreowthes.removeされる。
        //collectionはブラウザに残り続けるので。。気持ち悪い場合はコンソールより実行してください。
        return Meteor.methods({
            removeAllGrowth: function(){
                return Growthes.remove({});
            }
        });
    })
}

if (Meteor.isClient) {
    //subscribeを宣言しcollectionをerver-clientでミラーリング
    Meteor.subscribe("all-growth");
    Template.chart.events({
        'click rect':function(e){
            var dId = e.target.id;
            var dFlg = e.target.getAttribute('data-selected');
            //Session.set({'selectedId': dId,'dataIsSelected': dFlg});////Sessionの変更でもTracker.autorunは発火するはずなんだけど上手く行かなかった。。
            thisFlag = Growthes.findOne({_id: dId},{fields:{flg:1}}); //取得したIDから一致するdocumentのflg値を取得（_id+flgのobjectが得られる）
            Growthes.update({_id:dId},{$set:{flg:!thisFlag.flg}}); //collectionのflgを現在の逆の値でアップデートする
            //console.log(dFlg + ":" + dId);
        }
    });

    Template.chart.rendered = function() {
        svg = d3.select("#sp").append("svg")
            .attr("width", 600)
            .attr("height", 300)
            .append("g");

        //template.renderedで最初に一度＆collectionに変更が有ったときに呼び出される
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
                .attr("x", function(d, i){return i * 38})
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
