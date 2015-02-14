# d3MeteorS2P
Prototype Serivce Project for Convert d3.js SVG to PNG files with phantomjs &amp; Meteor.


d3.jsによってSVGとして可視化されたグラフをブラウザに表示されたままの状態でPhantomjsでヘッドレスにキャプチャし、PNGファイルとして出力するアプリケーションのプロジェクトです。

Webの表示とキャプチャ用のデータソースはMeteorを使って同期します。

##テストアプリの実行環境
Meteor & Phantomjsのテスト実行環境はコンテナとしてDocker Hubで提供します。
[Docker Hub - dogrunjp's Repositories](https://registry.hub.docker.com/u/dogrunjp/docker-s2p/)

##進行状況
Meteor用のリアクティブなd3.jsのサンプルをアップしました。
できる限りシンプルにd3.jsの棒グラフがリアクティブに共有されるサンプルにしています。

Meteorのversionは1.0.3.1ですが、今回リアクティブ・コンテキストの実装に使っているautorun関係のAPIはこのヴァージョンまでにいろいろ変わっている様子であるため、今後のMeteorのアップデートでこのサンプルスクリプトが動くかどうかは疑問なとろ頃です。

Meteor環境でd3.jsを利用するためにコンソールからd3をインストールする必要があります。

>**meteor add d3**

サンプルアプリではserver側でcollection "Growthes"をpublishしています。これはデフォルトでcollectionがserver-client間で全て共有されるautopublishの設定を外しているためです。

>**meteor remove autopublish**

Meteo + d3.jsなところまでのリアクティブなアプリケーションのサンプルはMeteorのサービスにデプロイしています。

[シンプルなリアクティブアプリのサンプル](http://simpled3reactiveapp.meteor.com/)


##今後
1. phantom.jsでキャプチャーする感じのスクリプトの作成
2. d3.jsのサンプルをリアクティブなアプリケーションの良さが何となく伝わるレベルのものに。。。
