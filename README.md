# gbbs-slack-bolt

Glitch https://glitch.com/~gbbs-slack-bolt-production
[Slack's Bolt Framework](https://slack.dev/bolt/tutorial/getting-started)

## 機能

/gbbs
/gbbs help
コマンド一覧の確認

/gbbs id
自分のSlackIDの取得

/gbbs input
稼働予定入力のためのモーダルを開く→APIへPOSTする

/gbbs list
入力済みの稼働予定を確認する

## index.js

botのイベントリスナー

### command
スラッシュコマンド /gbbs と本文の組み合わせで機能を出し分ける
上述の機能参照

### view
/gbbs inputで開いたモーダルのsubmit時に発火する。
APIに対して稼働予定をPOSTする。

## modal.js

dailyとhourlyで表示するmodalの共通差分を返すmodal関数
optionsは都度APIから取得して一意に保っている。

## constrants.js

APIなどの定数を.envから呼び出す。
.envはGlitch側に設定。
