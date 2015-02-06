# d3MeteorS2P
Prototype Serivce Project for Convert d3.js SVG to PNG files with phantomjs &amp; Meteor.


d3.jsによってSVGとして可視化されをグラフをブラウザに表示されたままPhantomjsでヘッドレスにキャプチャしPNGファイルとして出力するアプリケーションのプロジェクトです。Webの表示とキャプチャ用のデータソースはMeteorを使って同期します。

##テスト用実行環境環
Meteor & Phantomjsのテスト実行環境はコンテナとしてDocker Hubで提供します。

##課題
MeteorのCollectionをデータソースとしたd3.jsな可視化表現の実装途中です。現在Meteor-D3.jsで参考となるサンプルが密な実装が多いような印象。

[Docker Hub - dogrunjp's Repositories](https://registry.hub.docker.com/u/dogrunjp/docker-s2p/)
